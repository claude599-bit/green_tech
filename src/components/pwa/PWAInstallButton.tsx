import React, { useState } from 'react';
import { Download, Smartphone, Apple, Laptop } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'compact' | 'footer' | 'prominent';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { isInstalled, isInstallable, isIOS, isAndroid, install } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  // If already running in standalone mode (already installed), hide
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    // 1. Android: Trigger native browser prompt immediately
    if (isAndroid) {
      if (isInstallable) {
        const accepted = await install();
        if (accepted) return;
      }
      setModalOpen(true);
      return;
    }

    // 2. iOS: Trigger native Share sheet and open iOS modal
    if (isIOS) {
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          navigator.share({
            title: 'Green Tech Energy Cameroon (GTEC)',
            text: 'Application officielle GTEC Cameroun',
            url: window.location.href,
          }).catch(() => {});
        } catch (e) {}
      }
      setModalOpen(true);
      return;
    }

    // 3. Desktop / PC
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setModalOpen(true);
      }
    } else {
      setModalOpen(true);
    }
  };

  const getMobileDeviceLabel = () => {
    if (isIOS) return "Installer sur iPhone";
    if (isAndroid) return "Installer sur Android";
    return "Installer l'App";
  };

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleClick}
          title={isIOS ? "Installer sur iPhone" : isAndroid ? "Installer sur Android" : "Installer l'application GTEC"}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/30 transition-all cursor-pointer ${className}`}
        >
          {isIOS ? <Apple className="w-3.5 h-3.5 text-slate-100" /> : <Download className="w-3.5 h-3.5 text-[#69B536]" />}
          <span className="hidden sm:inline">{getMobileDeviceLabel()}</span>
        </button>
        <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  if (variant === 'prominent') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl bg-[#69B536] hover:bg-[#5ea72f] text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer ${className}`}
        >
          {isIOS ? <Apple className="w-4 h-4 text-slate-950" /> : <Download className="w-4 h-4" />}
          <span>{isIOS ? 'Installer sur cet iPhone' : isAndroid ? 'Installer sur cet Android' : "Installer l'application"}</span>
        </button>
        <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  // Default navbar variant
  return (
    <>
      <button
        onClick={handleClick}
        title={isIOS ? "Installer sur iPhone" : isAndroid ? "Installer sur Android" : "Installer l'application GTEC"}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-900/70 hover:bg-emerald-800 text-emerald-100 border border-emerald-400/40 hover:border-emerald-300 transition-all shadow-xs cursor-pointer ${className}`}
      >
        {isIOS ? <Apple className="w-3.5 h-3.5 text-slate-200" /> : <Download className="w-3.5 h-3.5 text-[#69B536]" />}
        <span className="whitespace-nowrap">{getMobileDeviceLabel()}</span>
      </button>
      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
