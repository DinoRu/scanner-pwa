import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff, Zap } from "lucide-react";

const QRScanner = ({ onScan, isScanning, onScanningChange }) => {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Initialiser le scanner
  useEffect(() => {
    initScanner();
    return () => {
      stopScanner();
    };
  }, []);

  // Démarrer/arrêter le scan
  useEffect(() => {
    if (isScanning && selectedCamera) {
      startScanning();
    } else {
      stopScanner();
    }
  }, [isScanning, selectedCamera]);

  const initScanner = async () => {
    try {
      // Demander la permission de la caméra
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      stream.getTracks().forEach((track) => track.stop());

      setHasPermission(true);

      // Lister les caméras disponibles
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);

        // Sélectionner la caméra arrière par défaut
        const backCamera =
          devices.find((device) =>
            device.label.toLowerCase().includes("back")
          ) || devices[0];

        setSelectedCamera(backCamera.id);
      } else {
        setError("Aucune caméra détectée");
      }
    } catch (err) {
      console.error("Erreur init scanner:", err);
      setError("Permission caméra refusée");
      setHasPermission(false);
    }
  };

  const startScanning = async () => {
    if (!selectedCamera || html5QrCodeRef.current) return;

    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // QR Code scanné avec succès
          if (decodedText && onScan) {
            onScan(decodedText);

            // Vibration tactile
            if (navigator.vibrate) {
              navigator.vibrate(200);
            }

            // Son de scan (optionnel)
            playBeep();
          }
        },
        (errorMessage) => {
          // Ignorer les erreurs de scan en continu
        }
      );

      setError(null);
    } catch (err) {
      console.error("Erreur start scanning:", err);
      setError("Impossible de démarrer la caméra");
      html5QrCodeRef.current = null;
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error("Erreur stop scanner:", err);
      }
    }
  };

  const playBeep = () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (err) {
      // Ignorer les erreurs audio
    }
  };

  const toggleCamera = () => {
    if (cameras.length > 1) {
      const currentIndex = cameras.findIndex((c) => c.id === selectedCamera);
      const nextIndex = (currentIndex + 1) % cameras.length;
      setSelectedCamera(cameras[nextIndex].id);
    }
  };

  return (
    <div className="relative w-full">
      {/* Zone de scan */}
      <div className="relative">
        <div
          id="qr-reader"
          ref={scannerRef}
          className="scanner-frame mx-auto max-w-md"
        />

        {/* Ligne de scan animée */}
        {isScanning && !error && <div className="scan-line" />}

        {/* Overlay d'instructions */}
        {isScanning && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center bg-black/50 text-white px-6 py-3 rounded-lg">
              <Zap className="w-6 h-6 mx-auto mb-2 animate-pulse" />
              <p className="text-sm font-medium">
                Placez le QR code dans le cadre
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Erreur */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-center">
          <CameraOff className="w-12 h-12 mx-auto mb-2 text-red-500" />
          <p className="text-red-700 font-medium">{error}</p>
          {!hasPermission && (
            <button onClick={initScanner} className="mt-3 btn-primary text-sm">
              Autoriser la caméra
            </button>
          )}
        </div>
      )}

      {/* Bouton changer de caméra */}
      {cameras.length > 1 && isScanning && !error && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={toggleCamera}
            className="btn-secondary flex items-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Changer de caméra
          </button>
        </div>
      )}

      {/* Bouton démarrer/arrêter */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => onScanningChange(!isScanning)}
          className={`btn ${
            isScanning ? "btn-danger" : "btn-primary"
          } flex items-center gap-2`}
        >
          {isScanning ? (
            <>
              <CameraOff className="w-5 h-5" />
              Arrêter le scan
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              Démarrer le scan
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
