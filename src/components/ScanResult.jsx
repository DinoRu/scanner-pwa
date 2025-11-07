import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";

const ScanResult = ({ result, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (result) {
      setIsVisible(true);

      // Auto-fermeture après 3 secondes
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  if (!result) return null;

  const isSuccess = result.success || result.valid;
  const isOffline = result.offline;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`card max-w-md w-full slide-up ${
          isSuccess ? "success-pulse" : "shake"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icône et statut */}
        <div className="text-center mb-4">
          {isOffline ? (
            <div className="mb-4">
              <WifiOff className="w-16 h-16 mx-auto text-orange-500 mb-2" />
              <h3 className="text-xl font-bold text-orange-600">
                Mode Hors Ligne
              </h3>
            </div>
          ) : isSuccess ? (
            <div className="mb-4">
              <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-2 animate-pulse-fast" />
              <h3 className="text-2xl font-bold text-green-600">
                Billet Valide ✓
              </h3>
            </div>
          ) : (
            <div className="mb-4">
              <XCircle className="w-20 h-20 mx-auto text-red-500 mb-2" />
              <h3 className="text-2xl font-bold text-red-600">
                Billet Invalide ✗
              </h3>
            </div>
          )}
        </div>

        {/* Informations du billet */}
        {result.ticket && (
          <div className="space-y-2 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Code billet</p>
              <p className="text-lg font-mono font-bold text-gray-900">
                {result.ticket.code || result.ticket.ticketCode}
              </p>
            </div>

            {result.ticket.customerName && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Client</p>
                <p className="text-lg font-semibold text-gray-900">
                  {result.ticket.customerName}
                </p>
              </div>
            )}

            {result.ticket.category && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Catégorie</p>
                <p className="text-lg font-semibold text-gray-900">
                  {result.ticket.category}
                </p>
              </div>
            )}

            {result.ticket.seatNumber && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Place</p>
                <p className="text-lg font-semibold text-gray-900">
                  {result.ticket.seatNumber}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Message */}
        {result.message && (
          <div
            className={`p-3 rounded-lg mb-4 ${
              isOffline
                ? "bg-orange-50 border border-orange-200"
                : isSuccess
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isOffline
                  ? "text-orange-700"
                  : isSuccess
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {result.message}
            </p>
          </div>
        )}

        {/* Détails supplémentaires pour les billets invalides */}
        {!isSuccess && !isOffline && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-700 mb-1">
                  Raison du refus:
                </p>
                <ul className="text-red-600 space-y-1">
                  {result.reason === "already_used" && (
                    <li>• Billet déjà utilisé</li>
                  )}
                  {result.reason === "not_found" && (
                    <li>• Billet non trouvé dans le système</li>
                  )}
                  {result.reason === "expired" && <li>• Billet expiré</li>}
                  {result.reason === "cancelled" && <li>• Billet annulé</li>}
                  {!result.reason && <li>• Billet non valide</li>}
                </ul>
                {result.ticket?.usedAt && (
                  <p className="mt-2 text-xs">
                    Utilisé le:{" "}
                    {new Date(result.ticket.usedAt).toLocaleString("fr-FR")}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message offline */}
        {isOffline && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-sm text-orange-700">
                Le scan a été enregistré localement et sera synchronisé dès que
                la connexion sera rétablie.
              </p>
            </div>
          </div>
        )}

        {/* Horodatage */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {new Date().toLocaleString("fr-FR")}
          </p>
        </div>

        {/* Bouton fermer */}
        <div className="mt-4">
          <button onClick={handleClose} className="btn-secondary w-full">
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;
