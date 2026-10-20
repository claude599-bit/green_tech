import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ServiceRequest, User, Quote, AuditLog } from '../../types';
import {
  Shield,
  FileText,
  Users,
  HardHat,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  Plus,
  Send,
  Eye,
  Search,
  Filter,
  Clock,
  Sparkles,
  Phone,
  Building,
  TrendingUp,
  BarChart3,
  MapPin,
  Compass,
} from 'lucide-react';
import { AnalyticsCharts } from '../../components/admin/AnalyticsCharts';
import { CameroonInterventionsMap } from '../../components/admin/CameroonInterventionsMap';

interface AdminDashboardProps {
  onOpenAssistant: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenAssistant }) => {
  const { user, refreshNotifications } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'analytics' | 'requests' | 'technicians' | 'quotes' | 'audit'>('overview');
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [technicians, setTechnicians] = useState<(User & { activeMissions: number })[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Assign Technician Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetRequest, setTargetRequest] = useState<ServiceRequest | null>(null);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState('Matinée (08h - 12h)');
  const [adminNotes, setAdminNotes] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Create Quote Modal
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteTargetRequest, setQuoteTargetRequest] = useState<ServiceRequest | null>(null);
  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteItems, setQuoteItems] = useState([
    { description: 'Fourniture matériel principal certifié', quantity: 1, unitPrice: 500000 },
    { description: 'Main d’œuvre installation & tests de conformité', quantity: 1, unitPrice: 150000 },
  ]);
  const [creatingQuote, setCreatingQuote] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, techRes, quoteRes, auditRes] = await Promise.all([
        api.getRequests(),
        api.getTechnicians(),
        api.getQuotes(),
        api.getAuditLogs(),
      ]);
      setRequests(reqRes.requests || []);
      setTechnicians(techRes.technicians || []);
      setQuotes(quoteRes.quotes || []);
      setAuditLogs(auditRes.auditLogs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Handle Technician Validation Toggle
  const handleValidateTechnician = async (techId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'actif' ? 'suspendu' : 'actif';
    try {
      await api.updateTechnicianStatus(techId, newStatus);
      await fetchData();
      refreshNotifications();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Handle Technician Assignment
  const handleConfirmAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRequest || !selectedTechId) return;

    setAssigning(true);
    try {
      await api.assignTechnician(targetRequest.id, {
        technicianId: selectedTechId,
        scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
        scheduledTimeSlot,
        adminNotes,
      });
      setAssignModalOpen(false);
      setTargetRequest(null);
      setSelectedTechId('');
      setAdminNotes('');
      await fetchData();
      refreshNotifications();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setAssigning(false);
    }
  };

  // Handle Create Quote
  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteTargetRequest) return;
    setCreatingQuote(true);
    try {
      await api.createQuote({
        requestId: quoteTargetRequest.id,
        title: quoteTitle || `Devis Chiffré ${quoteTargetRequest.reference}`,
        items: quoteItems,
      });
      setQuoteModalOpen(false);
      setQuoteTargetRequest(null);
      await fetchData();
      refreshNotifications();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCreatingQuote(false);
    }
  };

  const addQuoteItem = () => {
    setQuoteItems([...quoteItems, { description: '', quantity: 1, unitPrice: 50000 }]);
  };

  const updateQuoteItem = (index: number, field: string, value: any) => {
    const updated = [...quoteItems];
    updated[index] = { ...updated[index], [field]: value };
    setQuoteItems(updated);
  };

  // Calculated Real KPIs
  const newRequests = requests.filter((r) => r.status === 'nouvelle');
  const toQualifyRequests = requests.filter((r) => ['nouvelle', 'a_qualifier'].includes(r.status));
  const unassignedRequests = requests.filter((r) => !r.assignedTechnicianId && !['terminee', 'annulee'].includes(r.status));
  const inProgressMissions = requests.filter((r) => ['mission_acceptee', 'planifiee', 'en_cours'].includes(r.status));
  const completedMissions = requests.filter((r) => ['rapport_soumis', 'terminee', 'validee_gtec'].includes(r.status));
  const pendingTechnicians = technicians.filter((t) => t.status === 'en_attente_validation');
  const activeTechnicians = technicians.filter((t) => t.status === 'actif');

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Alert banner if technicians are pending validation */}
      {pendingTechnicians.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/40 p-4 rounded-xl flex items-center justify-between text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Action Administrateur Requise :</strong> {pendingTechnicians.length} technicien(s) en attente de vérification et d'agrément GTEC.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('technicians')}
            className="text-amber-900 font-bold underline hover:text-black cursor-pointer"
          >
            Vérifier les profils
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm border border-emerald-300/80 shrink-0">
            <img src="/logo.png" alt="GTEC Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#075B35] uppercase tracking-wider">
              Tour de Contrôle & Dispatch
            </div>
            <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 mt-0.5">
              Supervision GTEC Cameroun
            </h1>
            <p className="text-xs text-slate-500">
              Gestion intégrée des demandes, dispatch techniciens, devis et traçabilité des opérations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAssistant}
            className="px-4 py-2 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#69B536]" />
            <span>Copilote IA (Dispatch & Chiffrage)</span>
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
          onClick={() => setActiveTab('map')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'map' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <MapPin className="w-3.5 h-3.5 text-[#075B35]" />
          <span>Carte GPS Cameroun</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#075B35]" />
          <span>Statistiques & Graphes</span>
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'requests' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Gestion Demandes ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('technicians')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'technicians' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Techniciens ({technicians.length})
          {pendingTechnicians.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
              {pendingTechnicians.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'quotes' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Devis & Facturation ({quotes.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Journal d'Audit ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-medium text-slate-500">Demandes Reçues</div>
              <div className="font-['IBM_Plex_Mono'] font-bold text-2xl text-slate-900 tabular-nums">
                {requests.length}
              </div>
              <div className="text-[11px] text-slate-400">Total plateforme</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-medium text-slate-500">À Qualifier / Dispatcher</div>
              <div className="font-['IBM_Plex_Mono'] font-bold text-2xl text-amber-600 tabular-nums">
                {toQualifyRequests.length}
              </div>
              <div className="text-[11px] text-slate-400">Sans technicien validé</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-medium text-slate-500">Interventions en Cours</div>
              <div className="font-['IBM_Plex_Mono'] font-bold text-2xl text-emerald-700 tabular-nums">
                {inProgressMissions.length}
              </div>
              <div className="text-[11px] text-slate-400">Sur site au Cameroun</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-medium text-slate-500">Techniciens Agréés Actifs</div>
              <div className="font-['IBM_Plex_Mono'] font-bold text-2xl text-[#075B35] tabular-nums">
                {activeTechnicians.length}
              </div>
              <div className="text-[11px] text-slate-400">{pendingTechnicians.length} en attente validation</div>
            </div>
          </div>

          {/* Cartographie Interactive Google Maps des Interventions au Cameroun */}
          <CameroonInterventionsMap requests={requests} />

          {/* Visualisation Recharts : Statistiques par Type de Service et par Mois */}
          <AnalyticsCharts requests={requests} />

          {/* Action List: Needs Qualification */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-900">
                Actions Prioritaires de Dispatch & Qualification
              </h3>
              <span className="text-xs font-medium text-slate-500">
                {unassignedRequests.length} demande(s) en attente d'assignation
              </span>
            </div>

            {unassignedRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Toutes les demandes de service ont été qualifiées et assignées.
              </div>
            ) : (
              <div className="space-y-3">
                {unassignedRequests.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-[#F5F7F1]/80 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-['IBM_Plex_Mono'] font-bold text-slate-900 text-sm">
                          {r.reference}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-700 font-medium">{r.clientName} ({r.clientType})</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600">{r.city} ({r.district || 'Centre'})</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.urgency === 'critique' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {r.urgency}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm">{r.title}</h4>
                      <p className="text-slate-500 text-xs line-clamp-1">{r.description}</p>
                      {r.declineReason && (
                        <div className="p-1.5 bg-red-50 text-red-700 border border-red-200 rounded text-[11px] font-medium">
                          Alerte Réattribution : Précédemment déclinée (Motif : {r.declineReason})
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setQuoteTargetRequest(r);
                          setQuoteTitle(`Devis Chiffré pour ${r.title}`);
                          setQuoteModalOpen(true);
                        }}
                        className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Créer Devis
                      </button>
                      <button
                        onClick={() => {
                          setTargetRequest(r);
                          setAssignModalOpen(true);
                        }}
                        className="px-4 py-1.5 bg-[#69B536] hover:bg-[#5da22e] text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                      >
                        Assigner un Technicien
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 1.2: DEDICATED GPS MAP TAB */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <CameroonInterventionsMap requests={requests} />
        </div>
      )}

      {/* TAB 1.5: DEDICATED ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <AnalyticsCharts requests={requests} />
        </div>
      )}

      {/* TAB 2: REQUESTS MANAGEMENT */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-slate-900">
              Registre Intégral des Demandes GTEC ({requests.length})
            </h3>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher réf, client, ville..."
                  className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35] text-xs"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#075B35]"
              >
                <option value="all">Tous les statuts</option>
                <option value="nouvelle">Nouvelle</option>
                <option value="qualifiee">Qualifiée</option>
                <option value="technicien_attribue">Technicien assigné</option>
                <option value="mission_acceptee">Mission acceptée</option>
                <option value="en_cours">En cours</option>
                <option value="terminee">Terminée</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F5F7F1] text-slate-700">
                <tr>
                  <th className="p-3">Réf / Date</th>
                  <th className="p-3">Client & Localité</th>
                  <th className="p-3">Objet & Domaine</th>
                  <th className="p-3">Technicien Assigné</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <span className="font-['IBM_Plex_Mono'] font-bold text-slate-900 block">
                        {req.reference}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="p-3">
                      <strong className="text-slate-900 block">{req.clientName}</strong>
                      <span className="text-slate-500 text-[11px]">{req.city} ({req.district || 'Centre'})</span>
                    </td>
                    <td className="p-3">
                      <strong className="text-slate-800 line-clamp-1 block">{req.title}</strong>
                      <span className="text-slate-500 text-[11px]">{req.categoryTitle}</span>
                    </td>
                    <td className="p-3">
                      {req.assignedTechnicianName ? (
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <HardHat className="w-3.5 h-3.5 text-[#075B35]" />
                          <span>{req.assignedTechnicianName}</span>
                        </div>
                      ) : (
                        <span className="text-amber-700 font-medium">Non assigné</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                        req.status === 'terminee'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'en_cours'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'technicien_attribue'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {req.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setTargetRequest(req);
                            setAssignModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-[#075B35] text-white hover:bg-[#063D2A] rounded font-medium text-[11px] transition-colors"
                        >
                          {req.assignedTechnicianName ? 'Changer' : 'Assigner'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TECHNICIANS MANAGEMENT */}
      {activeTab === 'technicians' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg text-slate-900">
                Annuaire des Techniciens Partenaires ({technicians.length})
              </h3>
              <p className="text-xs text-slate-500">
                Seuls les techniciens au statut « Actif / Validé » peuvent recevoir des ordres de mission.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="p-5 rounded-xl border border-slate-200 bg-[#F5F7F1]/50 space-y-4 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#075B35] flex items-center justify-center font-bold text-sm">
                      {tech.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{tech.name}</h4>
                      <div className="text-slate-500 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-[#075B35]" />
                        <span>{tech.phone}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    tech.status === 'actif'
                      ? 'bg-[#69B536] text-black'
                      : tech.status === 'en_attente_validation'
                      ? 'bg-amber-400 text-black'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tech.status === 'actif' ? 'VALIDÉ GTEC' : tech.status === 'en_attente_validation' ? 'EN ATTENTE VALIDATION' : 'SUSPENDU'}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 font-medium">Compétences :</span>{' '}
                    <span className="font-semibold text-slate-800">
                      {(tech.skills || []).map((s) => s.replace('_', ' ')).join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Zones couvertes :</span>{' '}
                    <span className="text-slate-800">{(tech.zones || []).join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 pt-1">
                    <span>Expérience : {tech.experienceYears || 3} ans</span>
                    <span>Charge active : <strong className="text-slate-900 font-mono">{tech.activeMissions} mission(s)</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">
                    Inscrit le {new Date(tech.createdAt).toLocaleDateString('fr-FR')}
                  </span>

                  <button
                    onClick={() => handleValidateTechnician(tech.id, tech.status)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      tech.status === 'actif'
                        ? 'border border-red-300 text-red-700 hover:bg-red-50'
                        : 'bg-[#075B35] text-white hover:bg-[#063D2A]'
                    }`}
                  >
                    {tech.status === 'actif' ? (
                      <>
                        <UserX className="w-3.5 h-3.5" />
                        <span>Suspendre</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Valider & Agréer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: QUOTES MANAGEMENT */}
      {activeTab === 'quotes' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-slate-900">
              Registre des Devis Émis ({quotes.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F5F7F1] text-slate-700">
                <tr>
                  <th className="p-3">N° Devis / Réf</th>
                  <th className="p-3">Intitulé</th>
                  <th className="p-3 text-right">Montant HT</th>
                  <th className="p-3 text-right">Montant TTC (FCFA)</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Validité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <span className="font-['IBM_Plex_Mono'] font-bold text-slate-900 block">{q.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Dossier {q.requestReference}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{q.title}</td>
                    <td className="p-3 text-right font-mono tabular-nums">{q.subtotal.toLocaleString('fr-FR')} FCFA</td>
                    <td className="p-3 text-right font-mono font-bold text-[#075B35] tabular-nums">
                      {q.totalAmount.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.status === 'accepte'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.status === 'refuse'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {q.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{q.validUntil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-slate-900">
              Journal d'Audit & Traçabilité des Actions ({auditLogs.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-[#F5F7F1]/80 border border-slate-200 text-xs flex items-center justify-between gap-4"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-['IBM_Plex_Mono'] font-bold text-[#075B35] text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-slate-800">{log.userName} ({log.userRole})</span>
                  </div>
                  <p className="text-slate-600 text-xs">{log.details}</p>
                </div>
                <div className="text-[11px] text-slate-400 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN TECHNICIAN */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-900">
                  Attribution de Mission Contrôlée
                </h3>
                <span className="text-xs text-[#075B35] font-mono">Dossier {targetRequest?.reference}</span>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="space-y-4 text-xs">
              <div className="bg-[#F5F7F1] p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">{targetRequest?.title}</div>
                <div className="text-slate-600">Client : {targetRequest?.clientName} · Lieu : {targetRequest?.city} ({targetRequest?.district})</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Sélectionner un technicien validé par GTEC *
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2">
                  {technicians.filter((t) => t.status === 'actif').length === 0 ? (
                    <div className="p-4 text-center text-slate-500">
                      Aucun technicien validé disponible. Veuillez valider un profil dans l'onglet Techniciens.
                    </div>
                  ) : (
                    technicians
                      .filter((t) => t.status === 'actif')
                      .map((t) => (
                        <label
                          key={t.id}
                          className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                            selectedTechId === t.id
                              ? 'border-[#075B35] bg-emerald-50/70 ring-1 ring-[#075B35]'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="assignedTech"
                              checked={selectedTechId === t.id}
                              onChange={() => setSelectedTechId(t.id)}
                              className="text-[#075B35] focus:ring-[#075B35]"
                            />
                            <div>
                              <strong className="text-slate-900 block">{t.name}</strong>
                              <span className="text-[11px] text-slate-500">
                                Zones : {(t.zones || []).join(', ')} · Charge : {t.activeMissions} mission(s)
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#69B536] text-black">
                            Agréé GTEC
                          </span>
                        </label>
                      ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Date prévue d'intervention *
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Créneau horaire
                  </label>
                  <select
                    value={scheduledTimeSlot}
                    onChange={(e) => setScheduledTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                  >
                    <option value="Matinée (08h - 12h)">Matinée (08h - 12h)</option>
                    <option value="Après-midi (13h - 17h)">Après-midi (13h - 17h)</option>
                    <option value="Journée complète">Journée complète</option>
                    <option value="Urgence immédiate">Urgence immédiate (Sous 2h)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Consignes spécifiques pour le technicien
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="ex: Prendre un multimètre TRMS, prévoir échelle 4m, client disponible dès 8h..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!selectedTechId || assigning}
                  className="px-6 py-2 bg-[#075B35] hover:bg-[#063D2A] text-white font-bold rounded-lg disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {assigning ? 'Transmission...' : 'Confirmer l’Attribution & Notifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE FORMAL QUOTE */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-900">
                  Émission de Devis Chiffré GTEC
                </h3>
                <span className="text-xs text-[#075B35] font-mono">Dossier {quoteTargetRequest?.reference}</span>
              </div>
              <button
                onClick={() => setQuoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Intitulé du devis *
                </label>
                <input
                  type="text"
                  required
                  value={quoteTitle}
                  onChange={(e) => setQuoteTitle(e.target.value)}
                  placeholder="ex: Devis réfection armoire électrique ou fourniture kit solaire"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-800">Lignes de prestation (FCFA) :</label>
                  <button
                    type="button"
                    onClick={addQuoteItem}
                    className="text-[#075B35] font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une ligne</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {quoteItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-[#F5F7F1] p-2.5 rounded-lg border border-slate-200/80">
                      <div className="sm:col-span-6">
                        <label className="sm:hidden text-[10px] text-slate-500 font-medium mb-0.5 block">Description</label>
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => updateQuoteItem(idx, 'description', e.target.value)}
                          placeholder="Description de la prestation..."
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:contents">
                        <div className="sm:col-span-2">
                          <label className="sm:hidden text-[10px] text-slate-500 font-medium mb-0.5 block">Quantité</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuoteItem(idx, 'quantity', Number(e.target.value))}
                            placeholder="Qté"
                            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <label className="sm:hidden text-[10px] text-slate-500 font-medium mb-0.5 block">Prix unitaire (FCFA)</label>
                          <input
                            type="number"
                            step="1000"
                            value={item.unitPrice}
                            onChange={(e) => updateQuoteItem(idx, 'unitPrice', Number(e.target.value))}
                            placeholder="Prix unitaire FCFA"
                            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creatingQuote}
                  className="px-6 py-2 bg-[#69B536] hover:bg-[#5da22e] text-slate-950 font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  {creatingQuote ? 'Émission...' : 'Émettre le devis au client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
