import React from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Wifi,
  WifiOff,
} from "lucide-react";

const StatsCard = ({ stats, isOnline }) => {
  const todayScans = stats?.todayScans || stats?.today || 0;
  const validScans = stats?.validScans || 0;
  const invalidScans = stats?.invalidScans || 0;
  const pendingSync = stats?.pendingSync || stats?.pending || 0;

  return (
    <div className="space-y-3">
      {/* Statut de connexion */}
      <div
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
          isOnline
            ? "bg-green-50 text-green-700"
            : "bg-orange-50 text-orange-700"
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">En ligne</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Hors ligne</span>
          </>
        )}
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-2 gap-3">
        {/* Scans aujourd'hui */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Aujourd'hui
            </span>
          </div>
          <div className="text-3xl font-bold text-blue-600">{todayScans}</div>
          <p className="text-xs text-blue-700 mt-1">scans effectués</p>
        </div>

        {/* Billets valides */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Valides</span>
          </div>
          <div className="text-3xl font-bold text-green-600">{validScans}</div>
          <p className="text-xs text-green-700 mt-1">billets acceptés</p>
        </div>

        {/* Billets invalides */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">Invalides</span>
          </div>
          <div className="text-3xl font-bold text-red-600">{invalidScans}</div>
          <p className="text-xs text-red-700 mt-1">billets refusés</p>
        </div>

        {/* En attente de sync */}
        {pendingSync > 0 && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">
                En attente
              </span>
            </div>
            <div className="text-3xl font-bold text-orange-600">
              {pendingSync}
            </div>
            <p className="text-xs text-orange-700 mt-1">à synchroniser</p>
          </div>
        )}
      </div>

      {/* Taux de succès */}
      {(validScans > 0 || invalidScans > 0) && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Taux de réussite
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {Math.round((validScans / (validScans + invalidScans)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(validScans / (validScans + invalidScans)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
