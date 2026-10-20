import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Laptop, Apple, X, CheckCircle2, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled, isInstallable, isMobile, isIOS, isAndroid, isDesktop, install } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('gtec_pwa_banner_dismissed') === 'true';
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('gtec_pwa_banner_dismissed', 'true');
  };

  // Direct installation handler tailored to mobile OS
  const handleDirectInstall = async () => {
    // 1. Android: Trigger native browser install dialog immediately
    if (isAndroid) {
      if (isInstallable) {
        const accepted = await install();
        if (accepted) {
          return;
        }
      }
      // If prompt not yet available, show the focused Android instruction
      setModalOpen(true);
      return;
    }

    // 2. iPhone / iPad (iOS Safari): Trigger native share sheet immediately + guide
    if (isIOS) {
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          // Opens native iOS Share menu directly on the phone screen
          navigator.share({
            title: 'Green Tech Energy Cameroon (GTEC)',
            text: 'Application officielle GTEC Cameroun',
            url: window.location.href,
          }).catch(() => {
            // share cancelled or completed
          });
        } catch (e) {
          // fallback
        }
      }
      // Open direct iOS bottom sheet guide
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

  // If already running as installed standalone app or user dismissed for this session
  if (isInstalled || dismissed) {
    return null;
  }

  // Device-specific visual branding and badge
  const deviceConfig = isIOS
    ? {
        name: 'iPhone & iPad',
        icon: <Apple className="w-3.5 h-3.5 text-white" />,
        actionText: 'Installer sur mon iPhone',
        badge: 'iOS détecté',
      }
    : isAndroid
    ? {
        name: 'Smartphone Android',
        icon: <Smartphone className="w-3.5 h-3.5 text-emerald-400" />,
        actionText: 'Installer sur mon Android',
        badge: 'Android détecté',
      }
    : {
        name: 'PC & Bureau',
        icon: <Laptop className="w-3.5 h-3.5 text-blue-400" />,
        actionText: 'Installer sur ce PC',
        badge: 'Ordinateur',
      };

  return (
    <>
      <aside
        aria-label="Installation directe de l'application GTEC"
        className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-5 sm:max-w-md z-40 bg-[#042519]/95 backdrop-blur-md text-white p-4 rounded-2xl border border-emerald-500/50 shadow-2xl animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-start gap-3">
          {/* Logo badge */}
          <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md shrink-0 flex items-center justify-center border border-emerald-400/40">
            <img src="/logo.png" alt="GTEC Logo" className="w-full h-full object-contain" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs font-bold text-white truncate">
                  Application Officielle GTEC
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-emerald-800 text-emerald-200 rounded-full shrink-0">
                  {deviceConfig.icon}
                  <span>{deviceConfig.badge}</span>
                </span>
              </div>

              <button
                onClick={handleDismiss}
                className="text-emerald-300/70 hover:text-white p-1 rounded-md transition-colors"
                title="Masquer"
                aria-label="Fermer la bannière"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-emerald-100/90 leading-snug">
              {isIOS
                ? 'Installez directement l\'application sur l\'écran d\'accueil de votre iPhone.'
                : isAndroid
                ? 'Installez directement l\'application sur l\'écran de votre téléphone Android.'
                : 'Accès rapide plein écran avec suivi en direct et fonctionnement hors-ligne.'}
            </p>

            {/* Direct Action Button */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleDirectInstall}
                className="px-4 py-2 bg-[#69B536] hover:bg-[#5ea72f] text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{deviceConfig.actionText}</span>
              </button>

              <button
                onClick={handleDismiss}
                className="px-2.5 py-1.5 text-[11px] text-emerald-300 hover:text-white transition-colors cursor-pointer"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      </aside>

      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
