import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, History, RefreshCw, User } from "lucide-react";
import QRScanner from "../components/QRScanner";
import ScanResult from "../components/ScanResult";
import StatsCard from "../components/StatsCard";
import apiService from "../services/api";
import { getHistory, getLocalStats } from "../services/offline";

const ScannerPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Vérifier l'authentification
    const currentUser = apiService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    // Charger les stats et l'historique
    loadStats();
    loadHistory();

    // Écouter les changements de connexion
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigate]);

  const loadStats = async () => {
    try {
      if (isOnline) {
        const data = await apiService.getStats();
        setStats(data);
      } else {
        const localStats = await getLocalStats();
        setStats(localStats);
      }
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    }
  };

  const loadHistory = async () => {
    try {
      if (isOnline) {
        const data = await apiService.getHistory(20);
        setHistory(data);
      } else {
        const localHistory = await getHistory(20);
        setHistory(localHistory);
      }
    } catch (error) {
      console.error("Erreur chargement historique:", error);
    }
  };

  const syncOfflineData = async () => {
    if (!isOnline) return;

    setSyncing(true);
    try {
      const result = await apiService.syncOfflineData();
      if (result.synced > 0) {
        console.log(`${result.synced} scans synchronisés`);
        loadStats();
        loadHistory();
      }
    } catch (error) {
      console.error("Erreur synchronisation:", error);
    } finally {
      setSyncing(false);
    }
  };

  const handleScan = async (ticketCode) => {
    // Arrêter le scan temporairement
    setIsScanning(false);

    try {
      // Valider le billet
      const result = await apiService.validateTicket(ticketCode);
      setScanResult(result);

      // Recharger les stats et l'historique
      await loadStats();
      await loadHistory();

      // Redémarrer le scan après 3 secondes
      setTimeout(() => {
        setIsScanning(true);
      }, 3000);
    } catch (error) {
      setScanResult({
        success: false,
        message: error.message,
        ticket: { code: ticketCode },
      });

      setTimeout(() => {
        setIsScanning(true);
      }, 3000);
    }
  };

  const handleLogout = () => {
    if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      apiService.logout();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-top safe-bottom">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎫</span>
              <div>
                <h1 className="text-xl font-bold">Didi Scanner</h1>
                <p className="text-sm text-blue-100">
                  {user?.username || "Contrôleur"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Statistiques */}
        <StatsCard stats={stats} isOnline={isOnline} />

        {/* Boutons d'action */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn-secondary flex items-center gap-2 flex-1"
          >
            <History className="w-5 h-5" />
            Historique
          </button>
          <button
            onClick={() => {
              loadStats();
              loadHistory();
              syncOfflineData();
            }}
            disabled={syncing}
            className="btn-secondary flex items-center gap-2 flex-1"
          >
            <RefreshCw className={`w-5 h-5 ${syncing ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>

        {/* Historique */}
        {showHistory && (
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Derniers scans</h3>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucun scan récent
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                {history.map((scan, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 ${
                      scan.valid || scan.success
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono font-bold">
                          {scan.ticketCode || scan.ticket?.code}
                        </p>
                        <p className="text-sm text-gray-600">
                          {scan.ticket?.customerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {new Date(scan.timestamp).toLocaleTimeString("fr-FR")}
                        </p>
                        {scan.offline && (
                          <span className="text-xs text-orange-600">
                            À synchroniser
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scanner */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-center">
            {isScanning ? "Scanner en cours..." : "Prêt à scanner"}
          </h2>
          <QRScanner
            onScan={handleScan}
            isScanning={isScanning}
            onScanningChange={setIsScanning}
          />
        </div>
      </main>

      {/* Résultat du scan */}
      <ScanResult result={scanResult} onClose={() => setScanResult(null)} />
    </div>
  );
};

export default ScannerPage;
