import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, HardHat, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RegisterViewProps {
  onNavigate: (view: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [role, setRole] = useState<'client' | 'technicien'>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+237 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clientType, setClientType] = useState<'particulier' | 'entreprise'>('particulier');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('Douala');
  const [skills, setSkills] = useState<string[]>(['solaire_electrique']);
  const [experienceYears, setExperienceYears] = useState(3);
  const [zones, setZones] = useState<string[]>(['Douala']);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleZone = (zone: string) => {
    setZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe saisis ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (!acceptTerms) {
      setError('Veuillez accepter les conditions d’utilisation de la plateforme GTEC.');
      return;
    }
    if (role === 'technicien' && skills.length === 0) {
      setError('Veuillez sélectionner au moins un domaine de compétence technique.');
      return;
    }

    setLoading(true);

    try {
      const newUser = await register({
        role,
        name,
        email,
        phone,
        password,
        clientType: role === 'client' ? clientType : undefined,
        companyName: role === 'client' && clientType === 'entreprise' ? companyName : undefined,
        city,
        skills: role === 'technicien' ? skills : undefined,
        experienceYears: role === 'technicien' ? experienceYears : undefined,
        zones: role === 'technicien' ? zones : undefined,
      });

      if (newUser.role === 'technicien') {
        onNavigate('/technicien');
      } else {
        onNavigate('/client');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l’inscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center mx-auto shadow-md border border-emerald-200/80">
          <img src="/logo.png" alt="Logo GTEC" className="w-full h-full object-contain" />
        </div>
        <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#202622]">
          Création de compte GTEC
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Choisissez votre profil pour rejoindre la plateforme technique de Green Tech Energy Cameroon.
        </p>
      </div>

      {/* Role Picker Tabs */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-200/70 rounded-xl max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setRole('client')}
          className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            role === 'client'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4 text-[#075B35]" />
          <span>Compte Client</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('technicien')}
          className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            role === 'technicien'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HardHat className="w-4 h-4 text-[#69B536]" />
          <span>Compte Technicien</span>
        </button>
      </div>

      {role === 'technicien' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 space-y-1">
          <div className="font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Processus d'agrément technicien GTEC</span>
          </div>
          <p>
            Votre compte sera créé au statut <strong>« En attente de validation »</strong>. Nos coordinateurs d'ingénierie vérifieront vos compétences avant de vous attribuer vos premières interventions de terrain.
          </p>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nom complet ou Raison sociale *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'client' ? 'ex: Martial Tene' : 'ex: Paul Ndongo'}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Numéro de téléphone (+237 Cameroun) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+237 6 77 00 00 00"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Adresse e-mail de connexion *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@domaine.cm"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Ville principale *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
              >
                <option value="Douala">Douala (Littoral)</option>
                <option value="Yaoundé">Yaoundé (Centre)</option>
                <option value="Bafoussam">Bafoussam (Ouest)</option>
                <option value="Kribi">Kribi (Sud)</option>
                <option value="Garoua">Garoua (Nord)</option>
                <option value="Autre">Autre localité</option>
              </select>
            </div>
          </div>

          {/* Client Specific Details */}
          {role === 'client' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <span className="block text-xs font-semibold text-slate-700">Type de client :</span>
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="clientType"
                    checked={clientType === 'particulier'}
                    onChange={() => setClientType('particulier')}
                    className="text-[#075B35] focus:ring-[#075B35]"
                  />
                  <span>Particulier (Résidence)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="clientType"
                    checked={clientType === 'entreprise'}
                    onChange={() => setClientType('entreprise')}
                    className="text-[#075B35] focus:ring-[#075B35]"
                  />
                  <span>Entreprise / Professionnel</span>
                </label>
              </div>

              {clientType === 'entreprise' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nom de l'entreprise ou société
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="ex: AgroCam Industries SA"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Technician Specific Details */}
          {role === 'technicien' && (
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/70 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Domaines de compétence certifiés *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'solaire_electrique', label: 'Solaire & Génie Électrique' },
                    { id: 'froid_climatisation', label: 'Froid & Climatisation' },
                    { id: 'informatique_reseau', label: 'Informatique & Réseaux' },
                    { id: 'genie_civil', label: 'Génie Civil & BTP Durable' },
                  ].map((s) => (
                    <label key={s.id} className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={skills.includes(s.id)}
                        onChange={() => toggleSkill(s.id)}
                        className="rounded text-[#075B35] focus:ring-[#075B35]"
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Années d'expérience de terrain
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Zones de mobilité géographique
                  </label>
                  <div className="flex flex-wrap gap-1.5 text-[11px] pt-1">
                    {['Douala', 'Yaoundé', 'Edéa', 'Kribi', 'Bafoussam', 'Limbe'].map((z) => (
                      <button
                        type="button"
                        key={z}
                        onClick={() => toggleZone(z)}
                        className={`px-2 py-0.5 rounded border transition-colors ${
                          zones.includes(z)
                            ? 'bg-[#075B35] text-white border-[#075B35]'
                            : 'bg-white text-slate-600 border-slate-300'
                        }`}
                      >
                        {z}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mot de passe (min. 6 car.) *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Confirmation du mot de passe *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                required
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="rounded text-[#075B35] focus:ring-[#075B35] mt-0.5"
              />
              <span>
                J'accepte les conditions générales d'utilisation et la politique de confidentialité de Green Tech Energy Cameroon (GTEC).
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#075B35] hover:bg-[#063D2A] text-white font-semibold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
          >
            <span>{loading ? 'Création en cours...' : `Finaliser l'inscription ${role === 'client' ? 'Client' : 'Technicien'}`}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Déjà inscrit sur la plateforme ?{' '}
            <button
              onClick={() => onNavigate('/connexion')}
              className="font-semibold text-[#075B35] hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
