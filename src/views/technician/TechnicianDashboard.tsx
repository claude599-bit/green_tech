import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ServiceRequest } from '../../types';
import {
  HardHat,
  CheckCircle2,
  XCircle,
  Play,
  FileCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  ShieldAlert,
  Send,
  Calendar,
} from 'lucide-react';

interface TechnicianDashboardProps {
  onOpenAssistant: () => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({ onOpenAssistant }) => {
  const { user, refreshNotifications } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'missions' | 'planning' | 'profile'>('overview');
  const [missions, setMissions] = useState<ServiceRequest[]>([]);
  const [selectedMission, setSelectedMission] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // Decline mission modal
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  // Report modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [workDescription, setWorkDescription] = useState('');
  const [partsReplaced, setPartsReplaced] = useState('');
  const [hoursSpent, setHoursSpent] = useState('3.5');
  const [recommendations, setRecommendations] = useState('');
  const [safetyChecked, setSafetyChecked] = useState(true);
  const [submittingReport, setSubmittingReport] = useState(false);

  const isProfileValidated = user?.status === 'actif';

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const res = await api.getRequests();
      setMissions(res.requests || []);
      if (res.requests?.length && !selectedMission) {
        setSelectedMission(res.requests[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [user]);

  const handleAcceptMission = async (missionId: string) => {
    if (!isProfileValidated) {
      alert('Action bloquée : votre profil technicien doit être validé par GTEC avant d’accepter une mission.');
      return;
    }
    try {
      await api.technicianResponse(missionId, true);
      await fetchMissions();
      refreshNotifications();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleConfirmDecline = async () => {
    if (!selectedMission) return;
    try {
      await api.technicianResponse(selectedMission.id, false, declineReason);
      setDeclineModalOpen(false);
      setDeclineReason('');
      await fetchMissions();
      refreshNotifications();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleStartIntervention = async (missionId: string) => {
    try {
      await api.updateRequestStatus(missionId, 'en_cours', 'Début des travaux sur site par le technicien');
      await fetchMissions();
      refreshNotifications();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMission) return;
    setSubmittingReport(true);
    try {
      await api.submitReport(selectedMission.id, {
        workDescription,
        partsReplaced,
        hoursSpent: Number(hoursSpent),
        recommendations,
        safetyComplianceChecked: safetyChecked,
      });
      setReportModalOpen(false);
      setWorkDescription('');
      setPartsReplaced('');
      setRecommendations('');
      await fetchMissions();
      refreshNotifications();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmittingReport(false);
    }
  };

  // KPIs
  const missionsToExamine = missions.filter((m) => m.status === 'technicien_attribue');
  const missionsAccepted = missions.filter((m) => m.status === 'mission_acceptee');
  const missionsInProgress = missions.filter((m) => m.status === 'en_cours');
  const missionsCompleted = missions.filter((m) => ['rapport_soumis', 'terminee', 'validee_gtec'].includes(m.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Validation Status Warning */}
      {!isProfileValidated ? (
        <div className="bg-amber-500/10 border-2 border-amber-500 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-950">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-amber-950">
                Compte Technicien en Attente de Validation par GTEC
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed max-w-2xl">
                Conformément à la politique qualité GTEC, vos certifications et compétences déclarées ({(user?.skills || []).join(', ')}) sont en cours d'audit par l'administration. 
                <strong> Vous ne pouvez pas accepter ou exécuter d'ordres de mission</strong> tant que votre statut n'a pas été validé par un administrateur.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-400 text-slate-950 rounded-full shrink-0">
            Audit en cours
          </span>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#69B536]" />
            <span>
              <strong>Profil Technicien Agréé GTEC :</strong> Vous êtes actif et habilité à intervenir sur les missions dans vos zones ({(user?.zones || []).join(', ')}).
            </span>
          </div>
          <button
            onClick={onOpenAssistant}
            className="text-[#075B35] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#69B536]" />
            <span>Aide diagnostic terrain</span>
          </button>
        </div>
      )}

      {/* Greeting and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm border border-emerald-300/80 shrink-0">
            <img src="/logo.png" alt="GTEC Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#075B35] uppercase tracking-wider">
              Centre de Mission Technicien Terrain
            </div>
            <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 mt-0.5">
              Espace Professionnel : {user?.name}
            </h1>
            <p className="text-xs text-slate-500">
              Spécialités : {(user?.skills || []).join(', ')} · Téléphone : {user?.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAssistant}
            className="px-4 py-2 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#69B536]" />
            <span>Copilote IA (Abaques & Calculs)</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl w-full sm:w-auto overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Vue d'ensemble
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'missions' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Mes Missions ({missions.length})
        </button>
        <button
          onClick={() => setActiveTab('planning')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'planning' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Planning & Disponibilité
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Compétences & Profil
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Real Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-medium text-slate-500">Missions à Confirmer</div>
              <div className="font-['IBM_Plex_Mono'] font-bold text-2xl text-amber-600 tabular-nums">
                {missionsToExamine.length}
              </div>
              <div className="text-[11px] text-slate-400">En attente de réponse</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-medium text-slate-500">Missions Acceptées</div>
              <div className="font-['IBM_Plex_Mono'] font-bold text-2xl text-slate-900 tabular-nums">
                {missionsAccepted.length}
              </div>
              <div className="text-[11px] text-slate-400">À planifier sur site</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-medium text-slate-500">En Cours sur le Terrain</div>
              <div className="font-['IBM_Plex_Mono'] font-bold text-2xl text-emerald-600 tabular-nums">
                {missionsInProgress.length}
              </div>
              <div className="text-[11px] text-slate-400">Travaux actifs</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-medium text-slate-500">Interventions Finalisées</div>
              <div className="font-['IBM_Plex_Mono'] font-bold text-2xl text-[#075B35] tabular-nums">
                {missionsCompleted.length}
              </div>
              <div className="text-[11px] text-slate-400">Rapports transmis</div>
            </div>
          </div>

          {/* Urgent Missions Action Cards */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-900">
              Ordres de Mission Assignés par GTEC
            </h3>

            {missions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <HardHat className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Aucune mission assignée pour l'instant.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {missions.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border border-slate-200 bg-[#F5F7F1]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-['IBM_Plex_Mono'] font-bold text-slate-900 text-sm">
                          {m.reference}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 font-medium">{m.city} ({m.district || 'Centre'})</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          m.urgency === 'critique' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          Urgence : {m.urgency}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm">{m.title}</h4>
                      <p className="text-slate-500 text-xs line-clamp-1">{m.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {m.status === 'technicien_attribue' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedMission(m);
                              setDeclineModalOpen(true);
                            }}
                            className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Décliner
                          </button>
                          <button
                            disabled={!isProfileValidated}
                            onClick={() => handleAcceptMission(m.id)}
                            className="px-4 py-1.5 bg-[#69B536] hover:bg-[#5da22e] text-slate-950 rounded-lg text-xs font-bold disabled:opacity-40 cursor-pointer shadow-xs"
                          >
                            Accepter la mission
                          </button>
                        </>
                      )}

                      {m.status === 'mission_acceptee' && (
                        <button
                          onClick={() => handleStartIntervention(m.id)}
                          className="px-4 py-1.5 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Play className="w-3.5 h-3.5 text-[#69B536]" />
                          <span>Démarrer l'intervention</span>
                        </button>
                      )}

                      {m.status === 'en_cours' && (
                        <button
                          onClick={() => {
                            setSelectedMission(m);
                            setReportModalOpen(true);
                          }}
                          className="px-4 py-1.5 bg-[#69B536] hover:bg-[#5da22e] text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Rédiger Rapport de Fin</span>
                        </button>
                      )}

                      {['terminee', 'rapport_soumis'].includes(m.status) && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-[#69B536]" />
                          <span>Intervention clôturée</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MISSIONS DETAIL VIEW */}
      {activeTab === 'missions' && (
        <div className="space-y-4">
          {/* Mobile view toggle */}
          <div className="lg:hidden flex rounded-lg bg-slate-200/80 p-1 text-xs">
            <button
              onClick={() => setSelectedMission(null)}
              className={`flex-1 py-1.5 rounded-md font-medium text-center transition-all ${
                !selectedMission ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Liste des missions ({missions.length})
            </button>
            <button
              disabled={!missions.length}
              onClick={() => setSelectedMission(selectedMission || missions[0])}
              className={`flex-1 py-1.5 rounded-md font-medium text-center transition-all ${
                selectedMission ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Détail mission {selectedMission ? `(${selectedMission.reference})` : ''}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className={`lg:col-span-5 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs ${
              selectedMission ? 'hidden lg:block' : 'block'
            }`}>
              <div className="p-4 border-b border-slate-200">
                <h3 className="font-['Space_Grotesk'] font-bold text-sm text-slate-900">
                  Liste des Missions Assignées ({missions.length})
                </h3>
              </div>
            <div className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto">
              {missions.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMission(m)}
                  className={`p-4 cursor-pointer text-xs space-y-1.5 transition-colors ${
                    selectedMission?.id === m.id ? 'bg-emerald-50/70 border-l-4 border-[#075B35]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['IBM_Plex_Mono'] font-bold text-slate-900">{m.reference}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">{m.title}</h4>
                  <div className="text-slate-500 text-[11px]">{m.city} ({m.district || 'Centre'})</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            {selectedMission ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <div className="font-['IBM_Plex_Mono'] text-base font-bold text-[#075B35]">
                      {selectedMission.reference}
                    </div>
                    <h2 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900 mt-1">
                      {selectedMission.title}
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {selectedMission.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Client & Intervention Location info */}
                <div className="bg-[#F5F7F1] p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-900">Coordonnées de l'Intervention :</div>
                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-500 block">Contact Client :</span>
                      <strong>{selectedMission.clientName}</strong>
                      {selectedMission.companyName && <div className="text-slate-500">{selectedMission.companyName}</div>}
                    </div>
                    <div>
                      <span className="text-slate-500 block">Téléphone Client :</span>
                      <a href={`tel:${selectedMission.clientPhone}`} className="text-[#075B35] font-mono font-bold hover:underline">
                        {selectedMission.clientPhone}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Localisation :</span>
                      <strong>{selectedMission.city} · {selectedMission.district}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Créneau prévu :</span>
                      <strong>{selectedMission.scheduledDate || 'Dès que possible'}</strong>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Détail de la demande client
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-line">
                    {selectedMission.description}
                  </p>
                </div>

                {/* Admin notes if any */}
                {selectedMission.internalAdminNotes && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                    <strong>Consigne Coordination GTEC :</strong> {selectedMission.internalAdminNotes}
                  </div>
                )}

                {/* Action controls */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                  {selectedMission.status === 'technicien_attribue' && (
                    <>
                      <button
                        onClick={() => setDeclineModalOpen(true)}
                        className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Décliner la mission
                      </button>
                      <button
                        disabled={!isProfileValidated}
                        onClick={() => handleAcceptMission(selectedMission.id)}
                        className="px-5 py-2 bg-[#69B536] hover:bg-[#5da22e] text-slate-950 font-bold rounded-lg text-xs disabled:opacity-40 cursor-pointer shadow-xs"
                      >
                        Accepter la mission
                      </button>
                    </>
                  )}

                  {selectedMission.status === 'mission_acceptee' && (
                    <button
                      onClick={() => handleStartIntervention(selectedMission.id)}
                      className="px-5 py-2.5 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Play className="w-4 h-4 text-[#69B536]" />
                      <span>Démarrer l'intervention sur site</span>
                    </button>
                  )}

                  {selectedMission.status === 'en_cours' && (
                    <button
                      onClick={() => setReportModalOpen(true)}
                      className="px-5 py-2.5 bg-[#69B536] hover:bg-[#5da22e] text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Rédiger le Rapport de Clôture</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Sélectionnez une mission pour afficher tous les détails d'intervention.
              </div>
            )}
          </div>
        </div>
      </div>
    )}

      {/* TAB 3: PLANNING & AVAILABILITY */}
      {activeTab === 'planning' && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
              Disponibilités & Calendrier d'Intervention
            </h3>
            <p className="text-xs text-slate-500">
              Indiquez vos créneaux d'activité pour aider l'administration GTEC à vous dispatcher les missions prioritaires.
            </p>
          </div>

          <div className="p-4 bg-[#F5F7F1] rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">État de disponibilité actuel :</span>
              <strong className="text-sm text-emerald-800">Disponible pour interventions</strong>
            </div>
            <button
              onClick={() => alert('Disponibilité mise à jour dans le système GTEC.')}
              className="px-3.5 py-1.5 bg-[#075B35] text-white font-semibold rounded-lg text-xs"
            >
              Modifier
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Interventions planifiées cette semaine :</h4>
            {missionsAccepted.length + missionsInProgress.length === 0 ? (
              <p className="text-slate-500">Aucune intervention programmée pour les 7 prochains jours.</p>
            ) : (
              <div className="space-y-2">
                {[...missionsAccepted, ...missionsInProgress].map((m) => (
                  <div key={m.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900">{m.title}</strong>
                      <div className="text-slate-500 text-[11px]">{m.city} · {m.district}</div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#075B35]">
                      {m.scheduledDate || 'Cette semaine'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE & SKILLS */}
      {activeTab === 'profile' && (
        <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
              Profil Technicien Agréé GTEC
            </h3>
            <p className="text-xs text-slate-500">
              Vos informations d'évaluation et de mobilité géographique.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-500 block">Nom & Prénom :</span>
              <strong className="text-sm text-slate-900">{user?.name}</strong>
            </div>

            <div>
              <span className="text-slate-500 block">Téléphone professionnel :</span>
              <strong className="text-sm text-slate-900 font-mono">{user?.phone}</strong>
            </div>

            <div>
              <span className="text-slate-500 block">Statut d'agrément GTEC :</span>
              <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold mt-1 ${isProfileValidated ? 'bg-[#69B536] text-black' : 'bg-amber-400 text-black'}`}>
                {isProfileValidated ? 'Technicien Validé & Agréé' : 'En attente de validation'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Domaines d'intervention déclarés :</span>
              <div className="flex flex-wrap gap-1.5">
                {(user?.skills || []).map((sk) => (
                  <span key={sk} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-semibold text-[11px]">
                    {sk.replace('_', ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Zones géographiques de mobilité :</span>
              <div className="flex flex-wrap gap-1.5">
                {(user?.zones || []).map((zn) => (
                  <span key={zn} className="px-2.5 py-1 bg-emerald-50 text-[#075B35] border border-emerald-200 rounded font-semibold text-[11px]">
                    {zn}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DECLINE MISSION MODAL */}
      {declineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200 space-y-4">
            <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-900">
              Décliner la mission {selectedMission?.reference}
            </h3>
            <p className="text-xs text-slate-600">
              En déclinant, cette mission sera immédiatement retournée à l'administration GTEC avec votre motif afin qu'elle soit réattribuée à un autre technicien disponible.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Motif d'indisponibilité ou de refus *
              </label>
              <textarea
                required
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="ex: Déjà engagé sur une intervention urgente à Bassa ou manque d'outillage spécifique..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeclineModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={!declineReason.trim()}
                onClick={handleConfirmDecline}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
              >
                Confirmer le refus & alerter GTEC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERVENTION REPORT MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-900">
                  Rapport de Fin d'Intervention
                </h3>
                <span className="text-xs text-[#075B35] font-mono">Dossier {selectedMission?.reference}</span>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Travaux réalisés & Constats techniques *
                </label>
                <textarea
                  required
                  rows={4}
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder="Détaillez les mesures prises, réglages effectués, tests sous tension et conformité..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Pièces ou consommables remplacés
                </label>
                <input
                  type="text"
                  value={partsReplaced}
                  onChange={(e) => setPartsReplaced(e.target.value)}
                  placeholder="ex: Relais thermique 25A, connecteurs MC4, 1.5kg fluide R404A..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Temps passé (heures)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    value={hoursSpent}
                    onChange={(e) => setHoursSpent(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Date d'exécution
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={new Date().toLocaleDateString('fr-FR')}
                    className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 rounded-lg text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Recommandations pérennes pour le client
                </label>
                <textarea
                  rows={2}
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="ex: Nettoyage trimestriel des panneaux solaires, surveillance de pression..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="checkbox"
                    checked={safetyChecked}
                    onChange={(e) => setSafetyChecked(e.target.checked)}
                    className="rounded text-[#075B35] focus:ring-[#075B35]"
                  />
                  <span>Contrôle de sécurité & consignation vérifiés conforme GTEC</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submittingReport || !workDescription.trim()}
                  className="px-6 py-2 bg-[#69B536] hover:bg-[#5da22e] text-slate-950 font-bold rounded-lg disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {submittingReport ? 'Enregistrement...' : 'Valider & Clôturer l’Intervention'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
