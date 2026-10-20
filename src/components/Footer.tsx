import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { PWAInstallButton } from './pwa/PWAInstallButton';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#202622] text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Slogan */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-sm shrink-0 border border-emerald-400/30 overflow-hidden">
                <img src="/logo.png" alt="GTEC Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] font-bold text-white text-base leading-tight">GTEC</span>
                <span className="text-[10px] text-[#69B536] font-bold tracking-widest uppercase">Cameroun</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              « Innover aujourd’hui, construire un avenir durable »
            </p>
            <p className="text-xs text-slate-400">
              Entreprise spécialisée dans le génie électrique, solaire photovoltaïque, froid industriel, informatique et BTP durable.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-['Space_Grotesk'] font-semibold text-white text-xs uppercase tracking-wider">
              Services Clés
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Solaire & Génie Électrique
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Froid & Climatisation Industrielle
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Réseaux Informatiques & Télécoms
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Génie Civil & BTP Durable
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Access */}
          <div className="space-y-3">
            <h4 className="font-['Space_Grotesk'] font-semibold text-white text-xs uppercase tracking-wider">
              Espaces Métier
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/connexion')} className="hover:text-white transition-colors">
                  Portail Client Connecté
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/connexion')} className="hover:text-white transition-colors">
                  Espace Technicien Terrain
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/connexion')} className="hover:text-white transition-colors">
                  Supervision Administration GTEC
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/demande-devis')} className="hover:text-white transition-colors">
                  Demande de Devis en Ligne
                </button>
              </li>
              <li className="pt-2">
                <PWAInstallButton variant="compact" />
              </li>
            </ul>
          </div>

          {/* Coordinates */}
          <div className="space-y-3">
            <h4 className="font-['Space_Grotesk'] font-semibold text-white text-xs uppercase tracking-wider">
              Contact & Siège
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#69B536] shrink-0" />
                <a href="tel:+237655547649" className="hover:text-white transition-colors font-mono">
                  +237 6 55 54 76 49
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#69B536] shrink-0" />
                <a href="mailto:contact@greentech-cm.com" className="hover:text-white transition-colors">
                  contact@greentech-cm.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#69B536] shrink-0" />
                <span>Douala (Akwa / Bonanjo) & Yaoundé, Cameroun</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Green Tech Energy Cameroon (GTEC). Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('/confidentialite')} className="hover:text-slate-400 transition-colors">
              Confidentialité
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/mentions-legales')} className="hover:text-slate-400 transition-colors">
              Mentions Légales
            </button>
            <span>·</span>
            <span className="text-[#69B536]">Engagement Énergie Propre Cameroun</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
