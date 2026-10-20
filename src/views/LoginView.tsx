import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Shield,
  User,
  HardHat,
  Building,
  KeyRound,
  Copy,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface LoginViewProps {
  onNavigate: (view: string) => void;
}

interface TestAccount {
  id: string;
  role: 'client' | 'technicien' | 'admin';
  roleLabel: string;
  badgeColor: string;
  name: string;
  email: string;
  password: string;
  context: string;
  city: string;
  statusBadge?: string;
}

const TEST_ACCOUNTS: TestAccount[] = [
  {
    id: 'usr-admin-1',
    role: 'admin',
    roleLabel: 'Administrateur GTEC',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    name: 'Danielle Eboa (Supervision GTEC)',
    email: 'admin@greentech-cm.com',
    password: 'admin123',
    city: 'Douala',
    context: 'Accès complet tour de contrôle : affectation des techniciens, émission des devis, validation des profils, journal d’audit.',
  },
  {
    id: 'usr-client-1',
    role: 'client',
    roleLabel: 'Client Particulier',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    name: 'Martial Tene',
    email: 'martial.t@gmail.com',
    password: 'client123',
    city: 'Douala (Akwa)',
    context: 'Dépôt de demandes solaires/climatisation, consultation et acceptation de devis chiffrés en FCFA, suivi des interventions.',
  },
  {
    id: 'usr-client-2',
    role: 'client',
    roleLabel: 'Client Entreprise (B2B)',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    name: 'Dr. Paul Manga (AgroCam Industries SA)',
    email: 'direction@agrocam.cm',
    password: 'client123',
    city: 'Douala (Zone Industrielle Bassa)',
    context: 'Compte professionnel grands comptes : maintenance froid industriel, centrale solaire 25kWc, facturation entreprise.',
  },
  {
    id: 'usr-tech-1',
    role: 'technicien',
    roleLabel: 'Technicien Solaire & Élec (Validé)',
    badgeColor: 'bg-lime-100 text-lime-900 border-lime-300',
    name: 'Fabrice Kamga',
    email: 'fabrice.kamga@gtec-tech.cm',
    password: 'tech123',
    city: 'Douala / Kribi',
    statusBadge: 'Validé GTEC',
    context: 'Missions de terrain : acceptation ou refus motivé, lancement de travaux, rédaction et signature des rapports d’intervention.',
  },
  {
    id: 'usr-tech-2',
    role: 'technicien',
    roleLabel: 'Technicien Climatisation & Froid (Validé)',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    name: 'Samuel Ndongo',
    email: 'samuel.ndongo@gtec-tech.cm',
    password: 'tech123',
    city: 'Yaoundé / Mbalmayo',
    statusBadge: 'Validé GTEC',
    context: 'Spécialiste froid et HVAC : diagnostic de chambres froides, maintenance de climatiseurs split/VRV, gestion des disponibilités.',
  },
  {
    id: 'usr-tech-pending',
    role: 'technicien',
    roleLabel: 'Technicien En Attente (Profil Non Validé)',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
    name: 'Hervé Mbarga',
    email: 'herve.mbarga@gmail.com',
    password: 'tech123',
    city: 'Bafoussam (Ouest)',
    statusBadge: 'En attente de validation',
    context: 'Permet de tester la règle de sécurité métier : blocage strict des missions jusqu’à validation par l’administrateur GTEC.',
  },
];

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { login, switchDemoUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showAccountsGuide, setShowAccountsGuide] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') onNavigate('/admin');
      else if (loggedUser.role === 'technicien') onNavigate('/technicien');
      else onNavigate('/client');
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (userId: string, role: string) => {
    setLoading(true);
    setError(null);
    try {
      await switchDemoUser(userId);
      if (role === 'admin') onNavigate('/admin');
      else if (role === 'technicien') onNavigate('/technicien');
      else onNavigate('/client');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-20 h-20 rounded-2xl bg-white p-2 flex items-center justify-center mx-auto shadow-md border border-emerald-200/80">
          <img src="/logo.png" alt="Logo GTEC" className="w-full h-full object-contain" />
        </div>
        <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#202622]">
          Connexion à la Plateforme GTEC
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Espace sécurisé pour les clients particuliers et entreprises, techniciens agréés et l’administration technique GTEC au Cameroun.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulaire classique */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-['Space_Grotesk'] font-bold text-sm text-slate-900">
              Formulaire d'authentification
            </h2>
            <KeyRound className="w-4 h-4 text-[#075B35]" />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: admin@greentech-cm.com"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#075B35]/20 focus:border-[#075B35]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      'Pour tester, vous pouvez cliquer sur "Remplir" sur n\'importe quel compte ci-contre ou utiliser le mot de passe "admin123", "client123" ou "tech123".'
                    )
                  }
                  className="text-[11px] text-[#075B35] hover:underline"
                >
                  Aide mot de passe ?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#075B35]/20 focus:border-[#075B35]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#075B35] hover:bg-[#063D2A] text-white font-semibold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm cursor-pointer"
            >
              <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Nouveau sur GTEC ?{' '}
              <button
                onClick={() => onNavigate('/inscription')}
                className="font-bold text-[#075B35] hover:underline cursor-pointer"
              >
                Créer un compte
              </button>
            </p>
          </div>
        </div>

        {/* Section explicite des identifiants des comptes tests */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-emerald-900 text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-emerald-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#69B536]" />
                <h2 className="font-['Space_Grotesk'] font-bold text-sm sm:text-base">
                  Identifiants des Comptes de Test (GTEC)
                </h2>
              </div>
              <button
                onClick={() => setShowAccountsGuide(!showAccountsGuide)}
                className="text-xs text-emerald-200 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>{showAccountsGuide ? 'Réduire' : 'Déplier'}</span>
                {showAccountsGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Pour explorer immédiatement tous les rôles et workflows métiers (Client, Technicien, Supervision Admin), vous pouvez vous connecter en 1-clic ou copier les identifiants ci-dessous.
            </p>
          </div>

          {showAccountsGuide && (
            <div className="space-y-3">
              {TEST_ACCOUNTS.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-white p-4 sm:p-4.5 rounded-xl border border-slate-200 shadow-2xs hover:border-[#69B536]/60 transition-all space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${acc.badgeColor}`}>
                        {acc.roleLabel}
                      </span>
                      {acc.statusBadge && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {acc.statusBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">{acc.city}</span>
                  </div>

                  <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                    {acc.name}
                  </div>

                  {/* Identifiants email & mdp */}
                  <div className="bg-[#F5F7F1] p-2.5 rounded-lg border border-slate-200/80 text-xs font-mono grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200">
                      <div className="truncate mr-1">
                        <span className="text-slate-500 text-[10px] block font-sans">E-mail</span>
                        <span className="text-slate-800 text-[11px] select-all truncate block">{acc.email}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(acc.email, `${acc.id}-email`)}
                        className="p-1 text-slate-400 hover:text-[#075B35] shrink-0 cursor-pointer"
                        title="Copier l'e-mail"
                      >
                        {copiedKey === `${acc.id}-email` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-slate-200">
                      <div>
                        <span className="text-slate-500 text-[10px] block font-sans">Mot de passe</span>
                        <span className="text-slate-800 text-[11px] select-all font-bold block">{acc.password}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(acc.password, `${acc.id}-pass`)}
                        className="p-1 text-slate-400 hover:text-[#075B35] shrink-0 cursor-pointer"
                        title="Copier le mot de passe"
                      >
                        {copiedKey === `${acc.id}-pass` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Contexte d'utilisation */}
                  <p className="text-[11px] text-slate-600 leading-normal flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#075B35] shrink-0 mt-0.5" />
                    <span>{acc.context}</span>
                  </p>

                  {/* Actions boutons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo(acc.id, acc.role)}
                      className="px-3 py-1.5 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-[#69B536]" />
                      <span>Connexion directe en 1-clic</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillCredentials(acc.email, acc.password)}
                      className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      Remplir dans le formulaire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
