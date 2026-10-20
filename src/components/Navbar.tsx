import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, HardHat, Sparkles, Menu, X, ArrowRight, Download } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { PWAInstallButton } from './pwa/PWAInstallButton';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAssistant }) => {
  const { user, unreadCount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardRoute = () => {
    if (!user) return '/connexion';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'technicien') return '/technicien';
    return '/client';
  };

  const getDashboardLabel = () => {
    if (!user) return 'Mon Espace';
    if (user.role === 'admin') return 'Administration GTEC';
    if (user.role === 'technicien') return 'Espace Technicien';
    return 'Espace Client';
  };

  const getRoleIcon = () => {
    if (!user) return <User className="w-3.5 h-3.5" />;
    if (user.role === 'admin') return <Shield className="w-3.5 h-3.5 text-amber-400" />;
    if (user.role === 'technicien') return <HardHat className="w-3.5 h-3.5 text-lime-400" />;
    return <User className="w-3.5 h-3.5 text-emerald-400" />;
  };

  const handleMobileNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#063D2A] text-white border-b border-[#075B35] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-16">
          {/* Zone 1: Brand wordmark & Logo officiel */}
          <button
            onClick={() => handleMobileNav('/')}
            className="flex items-center gap-2.5 text-left text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-sm shrink-0 border border-emerald-400/40 overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="GTEC Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] font-bold tracking-tight text-white text-base sm:text-lg leading-none">GTEC</span>
              <span className="text-[10px] text-[#69B536] font-bold tracking-widest uppercase">Cameroun</span>
            </div>
          </button>

          {/* Zone 2: Desktop 4-5 single-line clean text links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-emerald-100">
            <button
              onClick={() => onNavigate('/')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${currentView === '/' ? 'text-white font-semibold underline underline-offset-8 decoration-[#69B536] decoration-2' : ''}`}
            >
              Accueil
            </button>
            <button
              onClick={() => onNavigate('/services')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${currentView === '/services' ? 'text-white font-semibold underline underline-offset-8 decoration-[#69B536] decoration-2' : ''}`}
            >
              Services Techniques
            </button>
            <button
              onClick={() => onNavigate('/realisations')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${currentView === '/realisations' ? 'text-white font-semibold underline underline-offset-8 decoration-[#69B536] decoration-2' : ''}`}
            >
              Réalisations
            </button>
            <button
              onClick={() => onNavigate('/a-propos')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${currentView === '/a-propos' ? 'text-white font-semibold underline underline-offset-8 decoration-[#69B536] decoration-2' : ''}`}
            >
              À Propos
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${currentView === '/contact' ? 'text-white font-semibold underline underline-offset-8 decoration-[#69B536] decoration-2' : ''}`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Actions + Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Copilote IA button (compact on mobile, full text on sm+) */}
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-lg bg-[#075B35] text-emerald-100 hover:text-white hover:bg-[#075B35]/80 border border-emerald-600/40 transition-all shadow-sm cursor-pointer"
              title="Copilote IA GTEC"
              aria-label="Ouvrir le copilote IA GTEC"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#69B536] shrink-0" />
              <span className="hidden sm:inline">Copilote IA</span>
            </button>

            {/* Notification Center (Simulation WebSocket en direct) */}
            <NotificationCenter onNavigate={onNavigate} />

            {/* PWA Install Button (affiché à partir de sm, car le bandeau bas et le menu gèrent le mobile) */}
            <div className="hidden sm:block">
              <PWAInstallButton />
            </div>

            {user ? (
              <button
                onClick={() => onNavigate(getDashboardRoute())}
                className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-slate-950 bg-[#69B536] hover:bg-[#5da22e] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
              >
                {getRoleIcon()}
                <span className="hidden sm:inline">{getDashboardLabel()}</span>
                <span className="sm:hidden font-mono uppercase text-[10px]">{user.role}</span>
                {unreadCount > 0 && (
                  <span className="bg-[#063D2A] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                    {unreadCount}
                  </span>
                )}
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('/connexion')}
                  className="px-2.5 py-1.5 text-xs font-medium text-emerald-100 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  Connexion
                </button>
                <button
                  onClick={() => onNavigate('/demande-devis')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-[#69B536] hover:bg-[#5da22e] rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
                >
                  <span>Devis</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-emerald-100 hover:text-white hover:bg-emerald-900/60 rounded-lg transition-colors cursor-pointer"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#052d1f] border-t border-[#075B35] px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1 text-sm font-medium">
            <button
              onClick={() => handleMobileNav('/')}
              className={`p-2.5 rounded-lg text-left transition-colors flex items-center justify-between ${currentView === '/' ? 'bg-[#075B35] text-white font-bold' : 'text-emerald-100 hover:bg-emerald-900/40'}`}
            >
              <span>Accueil</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#69B536]" />
            </button>
            <button
              onClick={() => handleMobileNav('/services')}
              className={`p-2.5 rounded-lg text-left transition-colors flex items-center justify-between ${currentView === '/services' ? 'bg-[#075B35] text-white font-bold' : 'text-emerald-100 hover:bg-emerald-900/40'}`}
            >
              <span>Services Techniques GTEC</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#69B536]" />
            </button>
            <button
              onClick={() => handleMobileNav('/realisations')}
              className={`p-2.5 rounded-lg text-left transition-colors flex items-center justify-between ${currentView === '/realisations' ? 'bg-[#075B35] text-white font-bold' : 'text-emerald-100 hover:bg-emerald-900/40'}`}
            >
              <span>Réalisations au Cameroun</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#69B536]" />
            </button>
            <button
              onClick={() => handleMobileNav('/a-propos')}
              className={`p-2.5 rounded-lg text-left transition-colors flex items-center justify-between ${currentView === '/a-propos' ? 'bg-[#075B35] text-white font-bold' : 'text-emerald-100 hover:bg-emerald-900/40'}`}
            >
              <span>À Propos de GTEC</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#69B536]" />
            </button>
            <button
              onClick={() => handleMobileNav('/contact')}
              className={`p-2.5 rounded-lg text-left transition-colors flex items-center justify-between ${currentView === '/contact' ? 'bg-[#075B35] text-white font-bold' : 'text-emerald-100 hover:bg-emerald-900/40'}`}
            >
              <span>Contact (+237 6 55 54 76 49)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#69B536]" />
            </button>
          </nav>

          <div className="pt-3 border-t border-[#075B35]/70 flex flex-col gap-2">
            {!user ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleMobileNav('/connexion')}
                  className="w-full py-2.5 text-center text-xs font-semibold bg-[#075B35] text-white rounded-lg hover:bg-[#063D2A]"
                >
                  Connexion
                </button>
                <button
                  onClick={() => handleMobileNav('/inscription')}
                  className="w-full py-2.5 text-center text-xs font-semibold bg-[#69B536] text-slate-950 rounded-lg hover:bg-[#5ea72f]"
                >
                  S'inscrire
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleMobileNav(getDashboardRoute())}
                className="w-full py-2.5 text-center text-xs font-bold bg-[#69B536] text-slate-950 rounded-lg flex items-center justify-center gap-2"
              >
                {getRoleIcon()}
                <span>Accéder à {getDashboardLabel()}</span>
              </button>
            )}

            {/* Demande de devis action prioritaire */}
            <button
              onClick={() => handleMobileNav('/demande-devis')}
              className="w-full py-3 text-center text-xs font-bold bg-[#69B536] text-slate-950 rounded-xl hover:bg-[#5ea72f] shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Demander une Intervention ou un Devis</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Copilote IA mobile action */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssistant();
              }}
              className="w-full py-2.5 px-3 text-center text-xs font-semibold bg-[#075B35] border border-emerald-500/40 text-emerald-100 hover:text-white rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#69B536]" />
              <span>Copilote IA : Dimensionnement Solaire</span>
            </button>

            {/* Mobile PWA Install CTA */}
            <div className="pt-1">
              <PWAInstallButton variant="prominent" className="w-full justify-center" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
