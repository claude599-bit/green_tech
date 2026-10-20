import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ServiceRequest, Quote, Notification } from '../../types';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  User,
  HardHat,
  ChevronRight,
  Filter,
  Check,
  X,
  Phone,
  MapPin,
  Sparkles,
  Car,
  Radio,
} from 'lucide-react';
import { mockWebSocket } from '../../services/mockWebSocket';

interface ClientDashboardProps {
  onOpenAssistant: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ onOpenAssistant }) => {
  const { user, refreshNotifications } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'new-request' | 'requests' | 'quotes' | 'profile'>('overview');
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Multi-step request state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [successReference, setSuccessReference] = useState<string | null>(null);
  const [newRequest, setNewRequest] = useState({
    categoryId: 'cat-solar',
    title: '',
    description: '',
    serviceType: 'depannage' as any,
    urgency: 'normale' as any,
    city: 'Douala',
    district: '',
    preferredDate: '',
    preferredContact: 'telephone' as any,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, quoteRes] = await Promise.all([api.getRequests(), api.getQuotes()]);
      setRequests(reqRes.requests || []);
      setQuotes(quoteRes.quotes || []);
      if (reqRes.requests?.length && !selectedRequest) {
        setSelectedRequest(reqRes.requests[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createRequest(newRequest);
      setSuccessReference(res.request.reference);
      await fetchData();
      refreshNotifications();
      // Reset form
      setNewRequest({
        categoryId: 'cat-solar',
        title: '',
        description: '',
        serviceType: 'depannage',
        urgency: 'normale',
        city: 'Douala',
        district: '',
        preferredDate: '',
        preferredContact: 'telephone',
      });
      setStep(1);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création de la demande');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuoteAction = async (quoteId: string, status: 'accepte' | 'refuse') => {
    const confirmMsg =
      status === 'accepte'
        ? 'Confirmez-vous l’acceptation formelle de ce devis de travaux GTEC ?'
        : 'Confirmez-vous le refus de ce devis ?';
    if (!window.confirm(confirmMsg)) return;

    try {
      await api.updateQuoteStatus(quoteId, status);
      await fetchData();
      refreshNotifications();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Real KPI calculations
  const openRequests = requests.filter((r) => ['nouvelle', 'a_qualifier', 'qualifiee', 'technicien_attribue'].includes(r.status));
  const activeInterventions = requests.filter((r) => ['mission_acceptee', 'planifiee', 'en_cours'].includes(r.status));
  const completedRequests = requests.filter((r) => ['terminee', 'validee_gtec'].includes(r.status));
  const pendingQuotes = quotes.filter((q) => q.status === 'envoye');

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Greeting & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm border border-emerald-300/80 shrink-0">
            <img src="/logo.png" alt="GTEC Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#075B35] uppercase tracking-wider">
              Portail Client Connecté
            </div>
            <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900 mt-0.5">
              Bienvenue, {user?.name}
            </h1>
            <p className="text-xs text-slate-500">
              {user?.clientType === 'entreprise' ? `Compte Entreprise (${user.companyName || 'Société'})` : 'Compte Particulier Résidentiel'} · {user?.city || 'Cameroun'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('new-request')}
            className="px-4 py-2 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#69B536]" />
            <span>Nouvelle Demande</span>
          </button>
          <button
            onClick={onOpenAssistant}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#075B35] border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#69B536]" />
            <span>Assistance IA</span>
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
          onClick={() => setActiveTab('new-request')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'new-request' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Nouvelle Demande
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'requests' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Mes Demandes ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'quotes' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Devis Chiffrés ({quotes.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Mon Profil
        </button>
      </div>

      {/* SUCCESS MODAL FOR NEW REQUEST */}
      {successReference && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-start justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <div className="font-bold text-sm text-[#075B35] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#69B536]" />
              <span>Demande enregistrée avec succès ! Référence : {successReference}</span>
            </div>
            <p>
              Votre dossier a été transmis à l’administration GTEC pour qualification. Vous pouvez suivre l’évolution de son statut en direct dans la section « Mes Demandes ».
            </p>
          </div>
          <button
            onClick={() => setSuccessReference(null)}
            className="p-1 text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Real Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-medium text-slate-500">Demandes Ouvertes</div>
              <div className="font-['IBM_Plex_Mono'] font-bold text-2xl text-slate-900 tabular-nums">
                {openRequests.length}
              </div>
              <div className="text-[11px] text-slate-400">En cours de traitement</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-medium text-slate-500">Interventions Actives</div>
              <div className="font-['IBM_Plex_Mono'] font-bold text-2xl text-emerald-700 tabular-nums">
                {activeInterventions.length}
              </div>
              <div className="text-[11px] text-slate-400">Technicien mobilisé</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-medium text-slate-500">Devis à Valider</div>
              <div className="font-['IBM_Plex_Mono'] font-bold text-2xl text-amber-600 tabular-nums">
                {pendingQuotes.length}
              </div>
              <div className="text-[11px] text-slate-400">Attente approbation</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-medium text-slate-500">Dossiers Clôturés</div>
              <div className="font-['IBM_Plex_Mono'] font-bold text-2xl text-[#075B35] tabular-nums">
                {completedRequests.length}
              </div>
              <div className="text-[11px] text-slate-400">Rapports disponibles</div>
            </div>
          </div>

          {/* Recent Requests and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-['Space_Grotesk'] font-bold text-sm text-slate-900">
                  Dernières Demandes & Interventions
                </h3>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="text-xs text-[#075B35] font-semibold hover:underline"
                >
                  Voir tout ({requests.length})
                </button>
              </div>

              {requests.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Aucune demande de service enregistrée pour le moment.</p>
                  <button
                    onClick={() => setActiveTab('new-request')}
                    className="text-[#075B35] font-semibold underline"
                  >
                    Créer votre première demande
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {requests.slice(0, 4).map((req) => (
                    <div
                      key={req.id}
                      onClick={() => {
                        setSelectedRequest(req);
                        setActiveTab('requests');
                      }}
                      className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-['IBM_Plex_Mono'] font-bold text-slate-900">
                            {req.reference}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{req.city} ({req.district || 'Centre'})</span>
                        </div>
                        <h4 className="font-semibold text-slate-800 text-sm">{req.title}</h4>
                        <div className="text-slate-500 text-[11px]">
                          Créée le {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>

                      <div className="text-right space-y-1 shrink-0">
                        <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-semibold ${
                          req.status === 'terminee'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'en_cours'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {req.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Support & Quick Contact card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#063D2A] text-white p-5 rounded-xl space-y-3 shadow-xs">
                <h3 className="font-['Space_Grotesk'] font-bold text-sm text-white">
                  Besoin d'un dépannage immédiat ?
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  Pour les situations d'urgence industrielle (coupure chaîne de froid, arrêt groupe), notre standard téléphonique est ouvert 24/7.
                </p>
                <div className="pt-2">
                  <a
                    href="tel:+237655547649"
                    className="w-full py-2 bg-[#69B536] hover:bg-[#5fa830] text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors font-mono"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+237 6 55 54 76 49</span>
                  </a>
                </div>
              </div>

              {pendingQuotes.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2 text-xs text-amber-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Devis en attente d'approbation</span>
                  </div>
                  <p>
                    Vous avez {pendingQuotes.length} devis transmis par GTEC. Consultez-les pour lancer les travaux.
                  </p>
                  <button
                    onClick={() => setActiveTab('quotes')}
                    className="text-amber-800 font-semibold underline"
                  >
                    Examiner les devis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-STEP NEW REQUEST FORM */}
      {activeTab === 'new-request' && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075B35]">
              Formulaire Métier
            </span>
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
              Déposer une nouvelle demande d'intervention
            </h2>
          </div>

          {/* Stepper Header */}
          <div className="grid grid-cols-3 gap-2 text-xs border-b border-slate-200 pb-4">
            <button
              onClick={() => setStep(1)}
              className={`text-left p-2 rounded-lg font-medium ${step === 1 ? 'bg-[#075B35] text-white' : 'text-slate-500'}`}
            >
              1. Domaine technique
            </button>
            <button
              onClick={() => setStep(2)}
              className={`text-left p-2 rounded-lg font-medium ${step === 2 ? 'bg-[#075B35] text-white' : 'text-slate-500'}`}
            >
              2. Description du besoin
            </button>
            <button
              onClick={() => setStep(3)}
              className={`text-left p-2 rounded-lg font-medium ${step === 3 ? 'bg-[#075B35] text-white' : 'text-slate-500'}`}
            >
              3. Vérification & Envoi
            </button>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-5">
            {/* STEP 1: Choose Domain */}
            {step === 1 && (
              <div className="space-y-4">
                <span className="block text-xs font-semibold text-slate-700">
                  Sélectionnez le domaine concerné par l'intervention :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'cat-solar', title: 'Génie Électrique & Solaire', desc: 'Panneaux solaires, onduleurs, batteries, distribution électrique' },
                    { id: 'cat-hvac', title: 'Froid & Climatisation', desc: 'Chambres froides, compresseurs, VRV, maintenance frigorifique' },
                    { id: 'cat-it', title: 'Génie Informatique & Réseaux', desc: 'Baies de brassage, câblage fibre, serveurs, vidéosurveillance' },
                    { id: 'cat-civil', title: 'Génie Civil & BTP Durable', desc: 'Ouvrages techniques, réhabilitation, toitures, dalles' },
                  ].map((dom) => (
                    <div
                      key={dom.id}
                      onClick={() => setNewRequest({ ...newRequest, categoryId: dom.id })}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        newRequest.categoryId === dom.id
                          ? 'border-[#075B35] bg-emerald-50/60 ring-1 ring-[#075B35]'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <h4 className="font-bold text-slate-900">{dom.title}</h4>
                      <p className="text-slate-500 text-[11px] mt-1">{dom.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 bg-[#075B35] text-white rounded-lg text-xs font-semibold hover:bg-[#063D2A] transition-colors"
                  >
                    Suivant : Détails du besoin
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Describe Need */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Titre court de la demande *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                    placeholder="ex: Panne onduleur 5kVA ou Maintenance chambre froide"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Type de prestation
                    </label>
                    <select
                      value={newRequest.serviceType}
                      onChange={(e) => setNewRequest({ ...newRequest, serviceType: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                    >
                      <option value="depannage">Dépannage d'urgence / Réparation</option>
                      <option value="installation">Nouvelle Installation / Projet</option>
                      <option value="maintenance">Maintenance Préventive / Entretien</option>
                      <option value="audit_etude">Audit Énergétique & Dimensionnement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Niveau d'urgence
                    </label>
                    <select
                      value={newRequest.urgency}
                      onChange={(e) => setNewRequest({ ...newRequest, urgency: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                    >
                      <option value="normale">Normale (Planification standard)</option>
                      <option value="haute">Haute (Sous 48h)</option>
                      <option value="critique">Critique (Urgence & arrêt d'activité)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Ville camerounaise d'intervention *
                    </label>
                    <select
                      value={newRequest.city}
                      onChange={(e) => setNewRequest({ ...newRequest, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                    >
                      <option value="Douala">Douala (Littoral)</option>
                      <option value="Yaoundé">Yaoundé (Centre)</option>
                      <option value="Bafoussam">Bafoussam (Ouest)</option>
                      <option value="Kribi">Kribi (Sud)</option>
                      <option value="Edéa">Edéa (Littoral)</option>
                      <option value="Limbe">Limbe (Sud-Ouest)</option>
                      <option value="Autre localité">Autre localité</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Quartier ou Lieu-dit précis
                    </label>
                    <input
                      type="text"
                      value={newRequest.district}
                      onChange={(e) => setNewRequest({ ...newRequest, district: e.target.value })}
                      placeholder="ex: Bonanjo, Akwa, Bassa, Bastos, Nsam..."
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Description détaillée du problème ou cahier des charges *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                    placeholder="Précisez la marque de vos équipements, les symptômes observés, les codes d'erreur ou la puissance désirée..."
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#075B35]"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    disabled={!newRequest.title || !newRequest.description}
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 bg-[#075B35] text-white rounded-lg text-xs font-semibold hover:bg-[#063D2A] disabled:opacity-50 transition-colors"
                  >
                    Suivant : Vérifier & Envoyer
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Verification & Send */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-[#F5F7F1] p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                    Récapitulatif avant envoi
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div><strong>Domaine :</strong> {newRequest.categoryId}</div>
                    <div><strong>Type :</strong> {newRequest.serviceType}</div>
                    <div><strong>Urgence :</strong> <span className="font-semibold text-red-700">{newRequest.urgency}</span></div>
                    <div><strong>Lieu :</strong> {newRequest.city} ({newRequest.district || 'Non précisé'})</div>
                    <div className="col-span-2"><strong>Titre :</strong> {newRequest.title}</div>
                    <div className="col-span-2"><strong>Description :</strong> {newRequest.description}</div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg text-[11px] text-emerald-800">
                  Après confirmation, un identifiant de référence unique (ex: GTEC-2026-XXXX) sera attribué. Notre administration qualifiera votre demande et dépêchera le technicien certifié approprié.
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Modifier
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-[#69B536] hover:bg-[#5da22e] text-slate-950 rounded-lg text-xs font-bold transition-colors shadow-xs"
                  >
                    {submitting ? 'Envoi au serveur GTEC...' : 'Confirmer et Soumettre ma Demande'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 3: MES DEMANDES (LIST + DETAIL VIEW) */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {/* Mobile view toggle */}
          <div className="lg:hidden flex rounded-lg bg-slate-200/80 p-1 text-xs">
            <button
              onClick={() => setSelectedRequest(null)}
              className={`flex-1 py-1.5 rounded-md font-medium text-center transition-all ${
                !selectedRequest ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Liste des demandes ({requests.length})
            </button>
            <button
              disabled={!requests.length}
              onClick={() => setSelectedRequest(selectedRequest || requests[0])}
              className={`flex-1 py-1.5 rounded-md font-medium text-center transition-all ${
                selectedRequest ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Détail du dossier {selectedRequest ? `(${selectedRequest.reference})` : ''}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Requests List */}
            <div className={`lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden ${
              selectedRequest ? 'hidden lg:block' : 'block'
            }`}>
              <div className="p-4 border-b border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Space_Grotesk'] font-bold text-sm text-slate-900">
                    Mes Demandes ({requests.length})
                  </h3>
                </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${statusFilter === 'all' ? 'bg-[#075B35] text-white font-medium' : 'bg-slate-100 text-slate-600'}`}
                >
                  Tous ({requests.length})
                </button>
                <button
                  onClick={() => setStatusFilter('en_cours')}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${statusFilter === 'en_cours' ? 'bg-[#075B35] text-white font-medium' : 'bg-slate-100 text-slate-600'}`}
                >
                  En cours
                </button>
                <button
                  onClick={() => setStatusFilter('terminee')}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${statusFilter === 'terminee' ? 'bg-[#075B35] text-white font-medium' : 'bg-slate-100 text-slate-600'}`}
                >
                  Terminées
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Aucune demande ne correspond à ce filtre.
                </div>
              ) : (
                filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-4 transition-colors cursor-pointer text-xs space-y-1.5 ${
                      selectedRequest?.id === req.id ? 'bg-emerald-50/70 border-l-4 border-[#075B35]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-['IBM_Plex_Mono'] font-bold text-slate-900">
                        {req.reference}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        req.status === 'terminee'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'en_cours'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-semibold text-slate-800 text-xs sm:text-sm line-clamp-1">{req.title}</h4>

                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <span>{req.city}</span>
                      <span>·</span>
                      <span>{new Date(req.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Request Detail Panel */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            {selectedRequest ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-['IBM_Plex_Mono'] text-base font-bold text-[#075B35]">
                        {selectedRequest.reference}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{selectedRequest.categoryTitle}</span>
                    </div>
                    <h2 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900 mt-1">
                      {selectedRequest.title}
                    </h2>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      {selectedRequest.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Location & Details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#F5F7F1] p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Lieu :</span>
                    <strong className="text-slate-900">{selectedRequest.city} ({selectedRequest.district || 'Secteur principal'})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Type de service :</span>
                    <strong className="text-slate-900 capitalize">{selectedRequest.serviceType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Urgence déclarée :</span>
                    <strong className="text-red-700 capitalize">{selectedRequest.urgency}</strong>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Description du besoin
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200/80 leading-relaxed whitespace-pre-line">
                    {selectedRequest.description}
                  </p>
                </div>

                {/* Assigned Technician Card (Visible if assigned) */}
                {selectedRequest.assignedTechnicianName && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#075B35]">
                      <HardHat className="w-4 h-4 text-[#69B536]" />
                      <span>Technicien GTEC Assigné à la mission</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 text-sm block">
                          {selectedRequest.assignedTechnicianName}
                        </strong>
                        <span className="text-slate-600">Intervention planifiée : {selectedRequest.scheduledDate || 'Sous 24h'}</span>
                      </div>
                      {selectedRequest.assignedTechnicianPhone && (
                        <a
                          href={`tel:${selectedRequest.assignedTechnicianPhone}`}
                          className="px-3 py-1.5 bg-white border border-emerald-300 rounded text-emerald-800 font-mono hover:bg-emerald-50 transition-colors"
                        >
                          {selectedRequest.assignedTechnicianPhone}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline History */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Historique horodaté des statuts
                  </h4>
                  <div className="space-y-3 border-l-2 border-emerald-500/30 pl-4 text-xs">
                    {selectedRequest.history.map((h, idx) => (
                      <div key={idx} className="relative space-y-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#075B35] absolute -left-[21px] top-1" />
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-medium">
                            {h.status.replace('_', ' ').toUpperCase()}
                          </strong>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 text-[11px]">
                            {new Date(h.timestamp).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        {h.comment && <p className="text-slate-600 text-[11px]">{h.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">
                Sélectionnez une demande dans la liste pour voir les détails.
              </div>
            )}
          </div>
        </div>
      </div>
    )}

      {/* TAB 4: DEVIS */}
      {activeTab === 'quotes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-['Space_Grotesk'] font-bold text-lg text-slate-900">
              Devis transmis par Green Tech Energy Cameroon
            </h3>
          </div>

          {quotes.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Aucun devis n'a encore été émis pour vos dossiers.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {quotes.map((q) => (
                <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white p-0.5 border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center">
                        <img src="/logo.png" alt="GTEC Logo" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-['IBM_Plex_Mono'] font-bold text-[#075B35]">
                            Dossier {q.requestReference}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">Valide jusqu'au {q.validUntil}</span>
                        </div>
                        <h4 className="font-['Space_Grotesk'] font-bold text-base text-slate-900 mt-0.5">
                          {q.title}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                        q.status === 'accepte'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.status === 'refuse'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {q.status === 'accepte' ? 'APPROUVÉ PAR LE CLIENT' : q.status === 'refuse' ? 'REFUSÉ' : 'EN ATTENTE DE VALIDATION'}
                      </span>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F5F7F1] text-slate-700">
                        <tr>
                          <th className="p-2.5">Description de la prestation</th>
                          <th className="p-2.5 text-center">Qté</th>
                          <th className="p-2.5 text-right">Prix Unitaire</th>
                          <th className="p-2.5 text-right">Total HT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {q.items.map((it) => (
                          <tr key={it.id}>
                            <td className="p-2.5 text-slate-800 font-medium">{it.description}</td>
                            <td className="p-2.5 text-center font-mono">{it.quantity}</td>
                            <td className="p-2.5 text-right font-mono tabular-nums">{it.unitPrice.toLocaleString('fr-FR')} FCFA</td>
                            <td className="p-2.5 text-right font-mono font-semibold tabular-nums">{it.totalPrice.toLocaleString('fr-FR')} FCFA</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Total Calculations */}
                  <div className="bg-[#F5F7F1] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="text-slate-500">
                      TVA applicable : 19.25% (Réglementation fiscale du Cameroun)
                    </div>
                    <div className="space-y-1 text-right font-mono">
                      <div>Sous-total HT : <strong>{q.subtotal.toLocaleString('fr-FR')} FCFA</strong></div>
                      <div>TVA (19.25%) : <strong>{q.taxAmount.toLocaleString('fr-FR')} FCFA</strong></div>
                      <div className="text-sm font-bold text-[#075B35] pt-1 border-t border-slate-300">
                        Total TTC : {q.totalAmount.toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {q.status === 'envoye' && (
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleQuoteAction(q.id, 'refuse')}
                        className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Refuser le devis
                      </button>
                      <button
                        onClick={() => handleQuoteAction(q.id, 'accepte')}
                        className="px-5 py-2 bg-[#69B536] hover:bg-[#5da22e] text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
                      >
                        Approuver et Lancer les Travaux
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
              Paramètres du compte Client
            </h3>
            <p className="text-xs text-slate-500">
              Coordonnées utilisées par GTEC pour la facturation et les avis d'intervention.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-500 block">Nom complet :</span>
              <strong className="text-sm text-slate-900">{user?.name}</strong>
            </div>

            <div>
              <span className="text-slate-500 block">Adresse e-mail :</span>
              <strong className="text-sm text-slate-900">{user?.email}</strong>
            </div>

            <div>
              <span className="text-slate-500 block">Téléphone de contact :</span>
              <strong className="text-sm text-slate-900 font-mono">{user?.phone}</strong>
            </div>

            <div>
              <span className="text-slate-500 block">Type de compte :</span>
              <span className="capitalize font-semibold text-[#075B35]">{user?.clientType || 'Particulier'}</span>
            </div>

            {user?.companyName && (
              <div>
                <span className="text-slate-500 block">Raison Sociale Entreprise :</span>
                <strong className="text-sm text-slate-900">{user.companyName}</strong>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
