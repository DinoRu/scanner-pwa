import axios from "axios";
import { saveToQueue, getQueuedScans } from "./offline";

// Configuration de l'API
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://109.69.16.90:5000/api";

const api = axios.create({
  baseURL: "http://localhost:5555/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Service API adapté au backend existant
const apiService = {
  // ============================================
  // AUTHENTIFICATION
  // ============================================

  async login(username, password) {
    try {
      const response = await api.post("/auth/login", { username, password });
      const { token, user } = response.data.data;

      // Vérifier que l'utilisateur est un contrôleur
      if (user.role !== "controleur") {
        throw new Error("Accès réservé aux contrôleurs uniquement");
      }

      // Sauvegarder le token et les infos user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { token, user };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  // ============================================
  // VALIDATION DE BILLETS (SCAN)
  // ============================================

  async validateTicket(ticketCodeOrId) {
    try {
      // Extraire l'ID du billet depuis le QR code si nécessaire
      const ticketId = this.extractTicketId(ticketCodeOrId);

      // Scanner le billet via POST /api/tickets/:id/scan
      const response = await api.post(`/tickets/${ticketId}/scan`);

      // Adapter la réponse au format attendu par la PWA
      if (response.data.success && response.data.data) {
        const scanResult = response.data.data;

        return {
          success: scanResult.success,
          valid: scanResult.success,
          message: scanResult.message,
          details: scanResult.details,
          ticket: scanResult.ticket || {
            code: ticketId,
            ticketCode: ticketId,
          },
        };
      }

      // Si pas de succès
      return {
        success: false,
        valid: false,
        message: response.data.message || "Erreur de validation",
        ticket: { code: ticketId, ticketCode: ticketId },
      };
    } catch (error) {
      // Si pas de connexion, sauvegarder en queue
      if (!navigator.onLine || error.code === "ECONNABORTED") {
        await saveToQueue({
          ticketCode: ticketCodeOrId,
          timestamp: new Date().toISOString(),
          controller: this.getCurrentUser()?.username,
        });

        return {
          success: false,
          offline: true,
          message: "Scan enregistré (mode hors ligne)",
          ticket: { code: ticketCodeOrId, ticketCode: ticketCodeOrId },
        };
      }

      // Gérer les erreurs spécifiques
      if (error.response?.data) {
        const errorData = error.response.data;

        // Si c'est une réponse de scan invalide
        if (errorData.data) {
          return {
            success: false,
            valid: false,
            message: errorData.data.message || "Billet invalide",
            details: errorData.data.details,
            ticket: errorData.data.ticket || {
              code: ticketCodeOrId,
              ticketCode: ticketCodeOrId,
            },
            reason: this.determineFailureReason(errorData.data.message),
          };
        }
      }

      throw this.handleError(error);
    }
  },

  /**
   * Extraire l'ID du billet depuis le QR code
   */
  extractTicketId(qrCodeData) {
    try {
      // Si c'est déjà un ID simple
      if (typeof qrCodeData === "string" && qrCodeData.startsWith("DIDI-")) {
        return qrCodeData;
      }

      // Si c'est un JSON du QR code
      if (typeof qrCodeData === "string" && qrCodeData.includes("{")) {
        const parsed = JSON.parse(qrCodeData);
        return parsed.id || parsed.ticketId || qrCodeData;
      }

      // Si c'est un objet
      if (typeof qrCodeData === "object") {
        return (
          qrCodeData.id || qrCodeData.ticketId || JSON.stringify(qrCodeData)
        );
      }

      return qrCodeData;
    } catch (error) {
      // Si erreur de parsing, retourner tel quel
      return qrCodeData;
    }
  },

  /**
   * Déterminer la raison de l'échec depuis le message
   */
  determineFailureReason(message) {
    if (!message) return "unknown";

    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("déjà utilisé") ||
      lowerMessage.includes("already used")
    ) {
      return "already_used";
    }
    if (
      lowerMessage.includes("non trouvé") ||
      lowerMessage.includes("not found")
    ) {
      return "not_found";
    }
    if (lowerMessage.includes("expiré") || lowerMessage.includes("expired")) {
      return "expired";
    }
    if (lowerMessage.includes("annulé") || lowerMessage.includes("cancelled")) {
      return "cancelled";
    }

    return "invalid";
  },

  // ============================================
  // HISTORIQUE DES SCANS
  // ============================================

  async getHistory(limit = 50) {
    try {
      // Essayer d'abord l'endpoint dédié s'il existe
      try {
        const response = await api.get(`/tickets/scans?limit=${limit}`);
        return response.data.data || response.data;
      } catch (error) {
        // Si l'endpoint n'existe pas, utiliser la liste des tickets filtrée
        const response = await api.get("/tickets", {
          params: {
            used: true,
            limit: limit,
            sortBy: "used_at",
            sortOrder: "DESC",
          },
        });

        if (response.data.success && response.data.data) {
          // Adapter le format
          const tickets = response.data.data.tickets || [];
          return tickets.map((ticket) => ({
            ticketCode: ticket.id,
            timestamp: ticket.usedAt || ticket.used_at,
            valid: ticket.used,
            success: ticket.used,
            ticket: {
              code: ticket.id,
              customerName: ticket.name,
              category: ticket.category,
            },
          }));
        }
      }

      return [];
    } catch (error) {
      // En mode offline, retourner l'historique local
      if (!navigator.onLine) {
        const queuedScans = await getQueuedScans();
        return queuedScans;
      }
      console.error("Erreur récupération historique:", error);
      return [];
    }
  },

  // ============================================
  // STATISTIQUES
  // ============================================

  async getStats() {
    try {
      // Essayer l'endpoint stats contrôleur s'il existe
      try {
        const response = await api.get("/tickets/stats/controller");
        return response.data.data || response.data;
      } catch (error) {
        // Sinon, calculer depuis la liste des tickets
        const response = await api.get("/tickets", {
          params: { limit: 1000 },
        });

        if (response.data.success && response.data.data) {
          const tickets = response.data.data.tickets || [];
          const today = new Date().toDateString();

          const todayTickets = tickets.filter(
            (t) => t.usedAt && new Date(t.usedAt).toDateString() === today
          );

          return {
            todayScans: todayTickets.length,
            totalScans: tickets.filter((t) => t.used).length,
            validScans: tickets.filter((t) => t.used).length,
            invalidScans: 0, // Pas d'info dans cette méthode
            offline: false,
          };
        }
      }

      return {
        todayScans: 0,
        totalScans: 0,
        validScans: 0,
        invalidScans: 0,
      };
    } catch (error) {
      if (!navigator.onLine) {
        return {
          todayScans: 0,
          totalScans: 0,
          validScans: 0,
          invalidScans: 0,
          offline: true,
        };
      }
      console.error("Erreur récupération stats:", error);
      return {
        todayScans: 0,
        totalScans: 0,
        validScans: 0,
        invalidScans: 0,
      };
    }
  },

  // ============================================
  // SYNCHRONISATION
  // ============================================

  async syncOfflineData() {
    const queuedScans = await getQueuedScans();

    if (queuedScans.length === 0) {
      return { synced: 0, failed: 0 };
    }

    let synced = 0;
    let failed = 0;

    for (const scan of queuedScans) {
      try {
        await this.validateTicket(scan.ticketCode);
        synced++;
        // Supprimer de la queue après succès
        await this.removeFromQueue(scan.id);
      } catch (error) {
        failed++;
        console.error("Erreur sync:", error);
      }
    }

    return { synced, failed };
  },

  // ============================================
  // UTILITAIRES
  // ============================================

  handleError(error) {
    if (error.response) {
      // Erreur du serveur
      const message =
        error.response.data?.error ||
        error.response.data?.message ||
        "Erreur serveur";
      return new Error(message);
    } else if (error.request) {
      // Pas de réponse
      return new Error("Impossible de contacter le serveur");
    } else {
      // Autre erreur
      return new Error(error.message || "Une erreur est survenue");
    }
  },

  isOnline() {
    return navigator.onLine;
  },
};

export default apiService;
