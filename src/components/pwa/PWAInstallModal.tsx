import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  Apple,
  X,
  CheckCircle2,
  Share2,
  PlusSquare,
  ArrowRight,
  ShieldCheck,
  Zap,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isDesktop, install } = usePWAInstall();

  // Automatically locked to detected mobile OS
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [showAllTabs, setShowAllTabs] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    if (isIOS) {
      setActiveTab('ios');
    } else if (isAndroid) {
      setActiveTab('android');
    } else {
      setActiveTab('desktop');
    }
  }, [isIOS, isAndroid, isOpen]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'GTEC - Green Tech Energy Cameroon',
          text: 'Application officielle GTEC Cameroun',
          url: window.location.href,
        });
      } catch (err) {
        // user dismissed share sheet
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#042519] via-[#063D2A] to-[#042519] p-5 sm:p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white p-1 shadow-md shrink-0 flex items-center justify-center border border-emerald-400/40">
              <img src="/logo.png" alt="GTEC Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3 text-[#69B536]" />
                <span>
                  {isIOS ? 'Système iPhone / iPad détecté' : isAndroid ? 'Système Android détecté' : 'Installation PWA Directe'}
                </span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-lg sm:text-xl font-bold text-white mt-1">
                Installer l'application GTEC
              </h2>
              <p className="text-xs text-emerald-100/80">
                Installation directe sur l'écran d'accueil sans passer par les stores
              </p>
            </div>
          </div>
        </div>

        {/* Optional Multi-Platform Tabs (collapsed by default on mobile so it's 100% direct) */}
        {showAllTabs ? (
          <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('android')}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'android' ? 'border-[#075B35] text-[#075B35]' : 'border-transparent text-slate-500'
              }`}
            >
              Android
            </button>
            <button
              onClick={() => setActiveTab('ios')}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'ios' ? 'border-[#075B35] text-[#075B35]' : 'border-transparent text-slate-500'
              }`}
            >
              iPhone / iPad
            </button>
            <button
              onClick={() => setActiveTab('desktop')}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'desktop' ? 'border-[#075B35] text-[#075B35]' : 'border-transparent text-slate-500'
              }`}
            >
              PC / Mac
            </button>
          </div>
        ) : null}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {installSuccess ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#075B35] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#69B536]" />
              </div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
                Application GTEC installée !
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                L'icône GTEC est maintenant sur votre écran d'accueil. Vous pouvez la lancer comme une application native.
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: IPHONE / IPAD DIRECT INSTRUCTIONS */}
              {activeTab === 'ios' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#075B35]">
                      <Apple className="w-4 h-4 text-slate-900" />
                      <span>Ajout direct sur l'écran d'accueil de votre iPhone</span>
                    </div>
                    <p className="text-[11px] text-emerald-900 leading-relaxed">
                      Sur iOS Safari, l'installation s'effectue directement en 2 touchers rapides sans aucun téléchargement lourd.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="w-6 h-6 rounded-full bg-[#075B35] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        1
                      </span>
                      <div className="space-y-1.5 flex-1">
                        <div className="font-semibold text-slate-900">
                          Appuyez sur le bouton Partager en bas de Safari :
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 font-bold border border-blue-200 text-xs shadow-xs">
                          <Share2 className="w-4 h-4 text-blue-600" />
                          <span>Bouton Partager (carré avec flèche vers le haut)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="w-6 h-6 rounded-full bg-[#075B35] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        2
                      </span>
                      <div className="space-y-1.5 flex-1">
                        <div className="font-semibold text-slate-900">
                          Faites défiler le menu et touchez :
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#075B35] font-bold border border-emerald-300 text-xs shadow-xs">
                          <PlusSquare className="w-4 h-4 text-[#69B536]" />
                          <span>« Sur l'écran d'accueil »</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <span className="w-6 h-6 rounded-full bg-[#075B35] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        3
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">
                          Touchez <strong>« Ajouter »</strong> en haut à droite.
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          L'icône GTEC apparaîtra directement à côté de vos autres applications !
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Direct Native Share Trigger Button for iOS */}
                  <div className="pt-1">
                    <button
                      onClick={handleNativeShare}
                      className="w-full py-3.5 px-4 bg-[#69B536] hover:bg-[#5ea72f] text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Ouvrir le menu de partage Safari maintenant</span>
                    </button>
                  </div>

                  {/* Pulsing indicator pointing down to Safari navigation bar */}
                  <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-800 animate-pulse pt-1">
                    <ArrowDown className="w-4 h-4 text-[#075B35]" />
                    <span>Le bouton de partage se trouve tout en bas de votre écran</span>
                  </div>
                </div>
              )}

              {/* TAB 2: ANDROID DIRECT FLOW */}
              {activeTab === 'android' && (
                <div className="space-y-4">
                  {isInstallable ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-white p-1 mx-auto shadow-sm flex items-center justify-center border border-emerald-300">
                        <img src="/logo.png" alt="GTEC Logo" className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-900">
                          Prêt à installer sur votre Android
                        </h3>
                        <p className="text-xs text-slate-600">
                          Appuyez ci-dessous pour lancer l'invite d'installation officielle Android.
                        </p>
                      </div>
                      <button
                        onClick={handleInstallClick}
                        className="w-full py-4 px-4 bg-[#69B536] hover:bg-[#5ea72f] text-slate-950 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                      >
                        <Download className="w-5 h-5" />
                        <span>Installer l'application GTEC maintenant</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-[#075B35]" />
                          <span>Installation Android via Google Chrome</span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Si l'invite automatique ne s'affiche pas encore :
                        </p>
                        <ol className="space-y-2.5 text-xs text-slate-700 pt-1">
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-[#075B35]">1.</span>
                            <span>Appuyez sur le menu <strong>⋮ (3 points)</strong> en haut à droite de Chrome.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-[#075B35]">2.</span>
                            <span>Choisissez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-[#075B35]">3.</span>
                            <span>Confirmez avec <strong>« Installer »</strong>.</span>
                          </li>
                        </ol>
                      </div>

                      <button
                        onClick={handleInstallClick}
                        className="w-full py-3.5 px-4 bg-[#075B35] hover:bg-[#063D2A] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-[#69B536]" />
                        <span>Réessayer l'invite d'installation</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DESKTOP / PC FLOW */}
              {activeTab === 'desktop' && (
                <div className="space-y-4">
                  {isInstallable ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-900">
                          Installer GTEC sur votre ordinateur
                        </h3>
                        <p className="text-xs text-slate-600">
                          Lance l'application dans une fenêtre autonome Chrome / Edge sur PC ou Mac.
                        </p>
                      </div>
                      <button
                        onClick={handleInstallClick}
                        className="w-full py-3.5 px-4 bg-[#075B35] hover:bg-[#063D2A] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Laptop className="w-4 h-4 text-[#69B536]" />
                        <span>Installer l'application sur ce PC</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-700">
                      <div className="font-bold text-slate-900">Installation sur navigateur de bureau (Chrome, Edge) :</div>
                      <p>
                        Cliquez sur l'icône d'installation située tout à droite dans la <strong>barre d'adresse</strong> du navigateur (icône d'écran ou flèche dans un cercle), puis cliquez sur <strong>« Installer »</strong>.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={() => setShowAllTabs(!showAllTabs)}
            className="text-[11px] text-slate-500 hover:text-[#075B35] underline cursor-pointer"
          >
            {showAllTabs ? 'Masquer les autres appareils' : 'Changer d’appareil (Android / iPhone / PC)'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
