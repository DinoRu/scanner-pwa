import React, { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA installée");
    } else {
      console.log("Installation refusée");
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleInstall}
      className="
        fixed bottom-6 right-6
        flex items-center gap-2
        bg-blue-600 text-white 
        px-4 py-3 
        rounded-full shadow-xl
        hover:bg-blue-700 active:scale-95
        transition-all duration-200
      "
    >
      <ArrowDownTrayIcon className="w-6 h-6" />
      <span className="font-medium">Installer l’app</span>
    </button>
  );
};

export default InstallPWAButton;
