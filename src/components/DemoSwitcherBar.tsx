import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserCheck,
  Shield,
  HardHat,
  Building,
  User as UserIcon,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  KeyRound,
  X,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';

interface DemoSwitcherBarProps {
  onNavigate: (view: string) => void;
}

const TEST_LOGINS = [
  {
    id: 'usr-admin-1',
    role: 'admin',
    label: 'Administrateur GTEC',
    name: 'Danielle Eboa',
    email: 'admin@greentech-cm.com',
    password: 'admin123',
    city: 'Douala',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    desc: 'Supervision globale, attribution des techniciens, émission de devis, validation des profils.',
  },
  {
    id: 'usr-client-1',
    role: 'client',
    label: 'Client Particulier',
    name: 'Martial Tene',
    email: 'martial.t@gmail.com',
    password: 'client123',
    city: 'Douala (Akwa)',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    desc: 'Dépôt de devis solaire / climatisation, acceptation des offres en FCFA, suivi.',
  },
  {
    id: 'usr-client-2',
    role: 'client',
    label: 'Client Entreprise (B2B)',
    name: 'Dr. Paul Manga (AgroCam Industries SA)',
    email: 'direction@agrocam.cm',
    password: 'client123',
    city: 'Douala (Zone Bassa)',
    badge: 'bg-blue-100 text-blue-900 border-blue-300',
    desc: 'Maintenance chambres froides & centrale photovoltaïque industrielle 25 kWc.',
  },
  {
    id: 'usr-tech-1',
    role: 'technicien',
    label: 'Technicien Solaire (Validé)',
    name: 'Fabrice Kamga',
    email: 'fabrice.kamga@gtec-tech.cm',
    password: 'tech123',
    city: 'Douala / Kribi',
    badge: 'bg-lime-100 text-lime-900 border-lime-300',
    desc: 'Acceptation de missions, intervention terrain, signature des rapports de conformité.',
  },
  {
    id: 'usr-tech-2',
    role: 'technicien',
    label: 'Technicien Froid & Clim (Validé)',
    name: 'Samuel Ndongo',
    email: 'samuel.ndongo@gtec-tech.cm',
    password: 'tech123',
    city: 'Yaoundé / Mbalmayo',
    badge: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    desc: 'Intervention génie frigorifique et climatisation, gestion des disponibilités.',
  },
  {
    id: 'usr-tech-pending',
    role: 'technicien',
    label: 'Technicien En Attente (Bloqué)',
    name: 'Hervé Mbarga',
    email: 'herve.mbarga@gmail.com',
    password: 'tech123',
    city: 'Bafoussam',
    badge: 'bg-orange-100 text-orange-900 border-orange-300',
    desc: 'Compte en attente pour tester la règle de blocage de mission avant validation administrative.',
  },
];

export const DemoSwitcherBar: React.FC<DemoSwitcherBarProps> = ({ onNavigate }) => {
  const { user, switchDemoUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSwitch = async (userId: string, targetRole: string) => {
    try {
      setSwitching(true);
      await switchDemoUser(userId);
      if (targetRole === 'admin') onNavigate('/admin');
      else if (targetRole === 'technicien') onNavigate('/technicien');
      else onNavigate('/client');
    } catch (e) {
      console.error(e);
    } finally {
      setSwitching(false);
      setCredentialsModalOpen(false);
    }
  };

  const handleLogoutToVisitor = async () => {
    setSwitching(true);
    await logout();
    onNavigate('/');
    setSwitching(false);
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <>
      <div className="bg-[#063D2A] text-white border-b border-[#075B35] text-xs overflow-hidden">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-1.5 flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 truncate">
            <span className="font-semibold text-[#69B536] uppercase tracking-wider text-[10px] sm:text-[11px] flex items-center gap-1 shrink-0">
              <RefreshCw className={`w-3 h-3 ${switching ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Sélecteur de Rôle Test GTEC</span>
              <span className="md:hidden">Mode Test</span>
            </span>
            <span className="text-emerald-400/60 hidden sm:inline">·</span>
            <span className="text-emerald-100 truncate text-[10px] sm:text-[11px]">
              <strong className="text-white truncate">{user ? user.name : 'Visiteur'}</strong>
              {user && <span className="ml-1 text-[9px] sm:text-[10px] text-emerald-300 font-mono">({user.role})</span>}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Bouton pour afficher la liste des identifiants */}
            <button
              onClick={() => setCredentialsModalOpen(true)}
              className="flex items-center gap-1 text-[#69B536] hover:text-white bg-emerald-900/60 hover:bg-emerald-800 transition-colors py-0.5 px-1.5 sm:px-2 rounded border border-emerald-600/40 text-[10px] sm:text-[11px] font-semibold cursor-pointer"
              title="Voir tous les emails et mots de passe de test"
            >
              <KeyRound className="w-3 h-3 shrink-0" />
              <span className="hidden sm:inline">Identifiants & Mdp</span>
              <span className="sm:hidden">Comptes</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-0.5 sm:gap-1 text-emerald-200 hover:text-white transition-colors py-0.5 sm:py-1 px-1.5 sm:px-2 rounded hover:bg-emerald-900/50 text-[10px] sm:text-[11px] font-medium cursor-pointer"
            >
              <span>{isOpen ? 'Fermer' : 'Rôles'}</span>
              {isOpen ? <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="bg-[#052d1f] border-t border-[#075B35]/60 px-3 sm:px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap">
              <span className="text-[11px] text-emerald-300/80 mr-1 shrink-0 font-medium hidden sm:inline">Bascule rapide :</span>

              {/* Admin */}
              <button
                onClick={() => handleSwitch('usr-admin-1', 'admin')}
                className={`px-2.5 py-1.5 rounded text-[11px] font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  user?.id === 'usr-admin-1'
                    ? 'bg-[#69B536] text-slate-900 font-semibold shadow-xs'
                    : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                <Shield className="w-3 h-3 text-amber-300" />
                <span>Admin GTEC</span>
              </button>

              {/* Client Particulier */}
              <button
                onClick={() => handleSwitch('usr-client-1', 'client')}
                className={`px-2.5 py-1.5 rounded text-[11px] font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  user?.id === 'usr-client-1'
                    ? 'bg-[#69B536] text-slate-900 font-semibold shadow-xs'
                    : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                <UserIcon className="w-3 h-3 text-emerald-300" />
                <span>Client Particulier</span>
              </button>

              {/* Client Entreprise */}
              <button
                onClick={() => handleSwitch('usr-client-2', 'client')}
                className={`px-2.5 py-1.5 rounded text-[11px] font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  user?.id === 'usr-client-2'
                    ? 'bg-[#69B536] text-slate-900 font-semibold shadow-xs'
                    : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                <Building className="w-3 h-3 text-emerald-300" />
                <span>Client Entreprise (AgroCam)</span>
              </button>

              {/* Technicien Validé 1 */}
              <button
                onClick={() => handleSwitch('usr-tech-1', 'technicien')}
                className={`px-2.5 py-1.5 rounded text-[11px] font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  user?.id === 'usr-tech-1'
                    ? 'bg-[#69B536] text-slate-900 font-semibold shadow-xs'
                    : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                <HardHat className="w-3 h-3 text-lime-300" />
                <span>Tech Solaire (Validé)</span>
              </button>

              {/* Technicien Validé 2 */}
              <button
                onClick={() => handleSwitch('usr-tech-2', 'technicien')}
                className={`px-2.5 py-1.5 rounded text-[11px] font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  user?.id === 'usr-tech-2'
                    ? 'bg-[#69B536] text-slate-900 font-semibold shadow-xs'
                    : 'bg-emerald-900/60 text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                <HardHat className="w-3 h-3 text-cyan-300" />
                <span>Tech Froid (Validé)</span>
              </button>

              {/* Technicien Non Validé */}
              <button
                onClick={() => handleSwitch('usr-tech-pending', 'technicien')}
                className={`px-2.5 py-1.5 rounded text-[11px] font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  user?.id === 'usr-tech-pending'
                    ? 'bg-amber-400 text-slate-950 font-semibold shadow-xs'
                    : 'bg-amber-950/40 text-amber-200 border border-amber-600/50 hover:bg-amber-900/50'
                }`}
                title="Compte technicien non validé - test blocage missions"
              >
                <UserCheck className="w-3 h-3 text-amber-400" />
                <span>Tech En Attente (Bloqué)</span>
              </button>

              {/* Déconnexion / Visiteur */}
              {user && (
                <button
                  onClick={handleLogoutToVisitor}
                  className="text-[11px] text-emerald-300/80 hover:text-white underline decoration-emerald-500/40 px-2 py-1 whitespace-nowrap shrink-0 cursor-pointer sm:ml-auto"
                >
                  Visiteur Déconnecté
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal des Identifiants & Mots de passe de test */}
      {credentialsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            {/* En-tête */}
            <div className="bg-[#063D2A] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#075B35] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center shrink-0 border border-emerald-400/40 shadow-xs">
                  <img src="/logo.png" alt="GTEC Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] font-bold text-sm sm:text-base text-white">
                    Identifiants des Comptes de Test GTEC
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    Emails, mots de passe et rôles préconfigurés pour tester les flux métiers
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCredentialsModalOpen(false)}
                className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800/50 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu de la liste des comptes */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 divide-y divide-slate-100">
              {TEST_LOGINS.map((acc) => (
                <div key={acc.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${acc.badge}`}>
                        {acc.label}
                      </span>
                      <strong className="text-xs text-slate-900">{acc.name}</strong>
                    </div>
                    <span className="text-[11px] text-slate-500">{acc.city}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-normal">{acc.desc}</p>

                  <div className="bg-[#F5F7F1] p-2.5 rounded-lg border border-slate-200 text-xs font-mono grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Email */}
                    <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-slate-200">
                      <div className="truncate mr-1">
                        <span className="text-slate-400 text-[9px] block font-sans uppercase">Email</span>
                        <span className="text-slate-800 text-[11px] truncate block select-all">{acc.email}</span>
                      </div>
                      <button
                        onClick={() => copyText(acc.email, `${acc.id}-m-email`)}
                        className="p-1 text-slate-400 hover:text-[#075B35] shrink-0 cursor-pointer"
                        title="Copier l'e-mail"
                      >
                        {copiedKey === `${acc.id}-m-email` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Mot de passe */}
                    <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-slate-200">
                      <div>
                        <span className="text-slate-400 text-[9px] block font-sans uppercase">Mot de passe</span>
                        <span className="text-slate-800 text-[11px] font-bold select-all block">{acc.password}</span>
                      </div>
                      <button
                        onClick={() => copyText(acc.password, `${acc.id}-m-pass`)}
                        className="p-1 text-slate-400 hover:text-[#075B35] shrink-0 cursor-pointer"
                        title="Copier le mot de passe"
                      >
                        {copiedKey === `${acc.id}-m-pass` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bouton de bascule immédiate */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleSwitch(acc.id, acc.role)}
                      className="px-3 py-1 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-md text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ArrowRight className="w-3 h-3 text-[#69B536]" />
                      <span>Basculer sur ce compte</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pied de page modal */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setCredentialsModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
