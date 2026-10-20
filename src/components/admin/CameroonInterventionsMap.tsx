import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { ServiceRequest } from '../../types';
import {
  MapPin,
  Navigation,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Phone,
  HardHat,
  Filter,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Radio,
  Car,
  Bike,
  Sparkles,
  Zap,
  Target,
  Maximize2,
  Check,
  Send,
} from 'lucide-react';
import { mockWebSocket } from '../../services/mockWebSocket';

declare const google: any;

interface CameroonInterventionsMapProps {
  requests: ServiceRequest[];
  onSelectRequest?: (request: ServiceRequest) => void;
}

// Coordonnées officielles des principales métropoles et zones d'intervention au Cameroun
export const CAMEROON_ZONES = [
  { name: 'Cameroun (Vue Globale)', lat: 4.85, lng: 11.5, zoom: 7 },
  { name: 'Douala & Zone Littorale', lat: 4.0511, lng: 9.7679, zoom: 12 },
  { name: 'Yaoundé & Région Centre', lat: 3.848, lng: 11.5021, zoom: 12 },
  { name: 'Kribi (Pôle Industriel & Port)', lat: 2.939, lng: 9.91, zoom: 13 },
  { name: 'Edéa (Pôle Énergie & Alu)', lat: 3.8, lng: 10.1333, zoom: 13 },
  { name: 'Bafoussam (Région Ouest)', lat: 5.4778, lng: 10.4176, zoom: 13 },
  { name: 'Garoua & Grand Nord', lat: 9.3, lng: 13.4, zoom: 12 },
];

export function resolveGpsCoordinates(city: string, district?: string): { lat: number; lng: number } {
  const normCity = (city || '').toLowerCase();
  const normDist = (district || '').toLowerCase();

  if (normCity.includes('douala')) {
    if (normDist.includes('bassa')) return { lat: 4.062, lng: 9.754 };
    if (normDist.includes('bonanjo')) return { lat: 4.0435, lng: 9.689 };
    if (normDist.includes('bonab')) return { lat: 4.078, lng: 9.67 };
    if (normDist.includes('deido') || normDist.includes('deïdo')) return { lat: 4.06, lng: 9.705 };
    if (normDist.includes('akwa')) return { lat: 4.0535, lng: 9.6995 };
    return { lat: 4.0511, lng: 9.7679 };
  }

  if (normCity.includes('yaound')) {
    if (normDist.includes('bastos')) return { lat: 3.882, lng: 11.515 };
    if (normDist.includes('mvan')) return { lat: 3.821, lng: 11.51 };
    if (normDist.includes('omnisport')) return { lat: 3.874, lng: 11.535 };
    return { lat: 3.848, lng: 11.5021 };
  }

  if (normCity.includes('kribi')) return { lat: 2.939, lng: 9.91 };
  if (normCity.includes('ed') || normCity.includes('édéa')) return { lat: 3.8, lng: 10.1333 };
  if (normCity.includes('bafoussam')) return { lat: 5.4778, lng: 10.4176 };
  if (normCity.includes('garoua')) return { lat: 9.3, lng: 13.4 };
  if (normCity.includes('maroua')) return { lat: 10.5956, lng: 14.3247 };
  if (normCity.includes('limb')) return { lat: 4.02, lng: 9.21 };

  return { lat: 4.0511, lng: 9.7679 }; // Par défaut Douala
}

const DOMAIN_STYLES: Record<string, { bg: string; border: string; label: string; dot: string }> = {
  'cat-solar': { bg: '#075B35', border: '#69B536', label: 'Solaire & Électrique', dot: 'bg-[#69B536]' },
  'cat-hvac': { bg: '#0284C7', border: '#38BDF8', label: 'Froid & Climatisation', dot: 'bg-cyan-400' },
  'cat-it': { bg: '#7C3AED', border: '#A78BFA', label: 'Informatique & Réseaux', dot: 'bg-purple-400' },
  'cat-civil': { bg: '#D97706', border: '#FBBF24', label: 'Génie Civil & BTP', dot: 'bg-amber-400' },
};

// Modèle de technicien en suivi temps réel
export interface TrackedTechnician {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  avatar: string;
  vehicleType: 'car' | 'bike';
  vehiclePlate: string;
  missionRef: string;
  missionId: string;
  destinationTitle: string;
  destinationClient: string;
  destinationAddress: string;
  originBaseName: string;
  waypoints: { lat: number; lng: number }[];
  currentProgress: number; // 0 à 100
  currentCoords: { lat: number; lng: number };
  heading: number; // Degrés
  speedKmH: number;
  status: 'en_route' | 'arrive_sur_site' | 'en_intervention';
  statusLabel: string;
  color: string;
}

// Calcul de la distance haversine en kilomètres
function calculateDistanceKm(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calcul du cap / bearing entre deux points GPS
function computeBearing(start: { lat: number; lng: number }, end: { lat: number; lng: number }): number {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;
  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

// Calcul des coordonnées interpolées sur une liste de waypoints
function interpolatePosition(waypoints: { lat: number; lng: number }[], progressPct: number) {
  if (waypoints.length === 0) return { coords: { lat: 4.0511, lng: 9.7679 }, heading: 0 };
  if (waypoints.length === 1 || progressPct <= 0) return { coords: waypoints[0], heading: 0 };
  if (progressPct >= 100) return { coords: waypoints[waypoints.length - 1], heading: 0 };

  const segmentCount = waypoints.length - 1;
  const totalScaled = (progressPct / 100) * segmentCount;
  const segIndex = Math.min(Math.floor(totalScaled), segmentCount - 1);
  const localFraction = totalScaled - segIndex;

  const p1 = waypoints[segIndex];
  const p2 = waypoints[segIndex + 1];

  const lat = p1.lat + (p2.lat - p1.lat) * localFraction;
  const lng = p1.lng + (p2.lng - p1.lng) * localFraction;
  const heading = computeBearing(p1, p2);

  return { coords: { lat, lng }, heading };
}

// Composant interne pour recentrer dynamiquement la caméra Google Maps
function CameraController({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    map.panTo(center);
    map.setZoom(zoom);
  }, [map, center, zoom]);
  return null;
}

// Composant Polyline Google Maps pour tracer l'itinéraire du technicien
function MapPolyline({
  path,
  color = '#075B35',
  weight = 4,
}: {
  path: { lat: number; lng: number }[];
  color?: string;
  weight?: number;
}) {
  const map = useMap();
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path,
        map,
        strokeColor: color,
        strokeOpacity: 0.85,
        strokeWeight: weight,
      });
    } else {
      polylineRef.current.setPath(path);
      polylineRef.current.setOptions({ strokeColor: color, strokeWeight: weight });
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, path, color, weight]);

  return null;
}

export const CameroonInterventionsMap: React.FC<CameroonInterventionsMapProps> = ({
  requests,
  onSelectRequest,
}) => {
  const apiKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_MAPS_API_KEY) ||
    'AIzaSyAnvmbhBYZA32YjzcmHCzQAtPMMcnTFKUQ';

  const [selectedReq, setSelectedReq] = useState<ServiceRequest | null>(null);
  const [selectedTech, setSelectedTech] = useState<TrackedTechnician | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('active');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [showLiveTracking, setShowLiveTracking] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [cameraState, setCameraState] = useState<{ lat: number; lng: number; zoom: number }>({
    lat: 4.85,
    lng: 11.5,
    zoom: 7,
  });

  // Techniciens en transit avec trajectoires et waypoints réels à Douala et Yaoundé
  const [technicians, setTechnicians] = useState<TrackedTechnician[]>([
    {
      id: 'tech-douala-1',
      name: "Samuel Eto'o Mbarga",
      phone: '+237 677 88 99 00',
      specialty: 'Énergie Solaire & Réseaux Industriels',
      avatar: 'SE',
      vehicleType: 'car',
      vehiclePlate: 'LT-742-GTEC',
      missionRef: 'GTEC-2026-002',
      missionId: 'req-2',
      destinationTitle: 'Installation Photovoltaïque 15 kVA',
      destinationClient: 'Groupe SABC Boissons Cameroun',
      destinationAddress: 'Zone Industrielle de Bassa, Douala',
      originBaseName: 'Atelier Central GTEC Akwa',
      waypoints: [
        { lat: 4.0535, lng: 9.6995 }, // Akwa base
        { lat: 4.056, lng: 9.715 }, // Bd de la Liberté
        { lat: 4.059, lng: 9.732 }, // Axe lourd Deïdo
        { lat: 4.0608, lng: 9.745 }, // Carrefour Ndokoti
        { lat: 4.062, lng: 9.754 }, // Site Bassa
      ],
      currentProgress: 55,
      currentCoords: { lat: 4.059, lng: 9.732 },
      heading: 85,
      speedKmH: 46,
      status: 'en_route',
      statusLabel: 'En route vers Bassa',
      color: '#69B536',
    },
    {
      id: 'tech-yaounde-1',
      name: 'Ibrahim Ndop',
      phone: '+237 671 23 45 67',
      specialty: 'Génie Climatique & Froid Médical',
      avatar: 'IN',
      vehicleType: 'bike',
      vehiclePlate: 'RC-118-MOTO',
      missionRef: 'GTEC-2026-004',
      missionId: 'req-4',
      destinationTitle: "Dépannage d'urgence CTA & TGBT",
      destinationClient: 'Dr. Paul Biya Jr (Clinique Bastos)',
      destinationAddress: 'Bastos Résidentiel, Yaoundé',
      originBaseName: 'Dépôt GTEC Mvan Yaoundé',
      waypoints: [
        { lat: 3.821, lng: 11.51 }, // Mvan
        { lat: 3.842, lng: 11.505 }, // Poste Centrale
        { lat: 3.865, lng: 11.512 }, // Tsinga / Bastos sud
        { lat: 3.882, lng: 11.515 }, // Bastos clinique
      ],
      currentProgress: 35,
      currentCoords: { lat: 3.842, lng: 11.505 },
      heading: 15,
      speedKmH: 38,
      status: 'en_route',
      statusLabel: 'En route vers Bastos',
      color: '#38BDF8',
    },
    {
      id: 'tech-kribi-1',
      name: 'Marc Nkono',
      phone: '+237 699 11 22 33',
      specialty: 'BTP & Groupes Électrogènes',
      avatar: 'MN',
      vehicleType: 'car',
      vehiclePlate: 'KB-331-GTEC',
      missionRef: 'GTEC-2026-003',
      missionId: 'req-3',
      destinationTitle: 'Audit Énergétique Portuaire',
      destinationClient: 'Port Autonome de Kribi (PAK)',
      destinationAddress: 'Complexe Portuaire de Mboro, Kribi',
      originBaseName: 'Base Sud Kribi Ville',
      waypoints: [
        { lat: 2.948, lng: 9.905 },
        { lat: 2.939, lng: 9.91 },
      ],
      currentProgress: 100,
      currentCoords: { lat: 2.939, lng: 9.91 },
      heading: 140,
      speedKmH: 0,
      status: 'arrive_sur_site',
      statusLabel: 'Sur site (intervention)',
      color: '#FBBF24',
    },
  ]);

  // Boucle de simulation temps réel pour déplacer les techniciens le long de leur itinéraire
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTechnicians((prev) =>
        prev.map((tech) => {
          if (tech.status === 'arrive_sur_site' || tech.status === 'en_intervention') {
            return tech;
          }

          // Augmenter la progression en fonction du multiplicateur de vitesse
          const nextProgress = tech.currentProgress + 1.2 * speedMultiplier;

          if (nextProgress >= 100) {
            // Le technicien arrive à destination !
            const dest = tech.waypoints[tech.waypoints.length - 1];

            // Émettre une notification WebSocket en direct pour alerter le client
            mockWebSocket.simulateTechnicianArrived({
              requestId: tech.missionId,
              reference: tech.missionRef,
              technicianName: tech.name,
              locationName: tech.destinationAddress,
            });

            return {
              ...tech,
              currentProgress: 100,
              currentCoords: dest,
              speedKmH: 0,
              status: 'arrive_sur_site',
              statusLabel: 'Arrivé sur site',
            };
          }

          const { coords, heading } = interpolatePosition(tech.waypoints, nextProgress);

          // Variation naturelle de vitesse
          const speedDelta = (Math.random() - 0.5) * 4;
          const newSpeed = Math.max(20, Math.min(65, Math.round(tech.speedKmH + speedDelta)));

          return {
            ...tech,
            currentProgress: nextProgress,
            currentCoords: coords,
            heading,
            speedKmH: newSpeed,
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  // Enrichir chaque requête avec ses coordonnées GPS
  const mappedRequests = useMemo(() => {
    return requests.map((req) => {
      const coords = req.coordinates || resolveGpsCoordinates(req.city, req.district);
      return {
        ...req,
        coordinates: coords,
      };
    });
  }, [requests]);

  // Filtrer les interventions
  const filteredRequests = useMemo(() => {
    return mappedRequests.filter((r) => {
      if (statusFilter === 'active') {
        if (!['en_cours', 'mission_acceptee', 'planifiee'].includes(r.status)) return false;
      } else if (statusFilter === 'pending') {
        if (!['nouvelle', 'a_qualifier', 'qualifiee', 'technicien_attribue'].includes(r.status)) return false;
      } else if (statusFilter === 'completed') {
        if (!['terminee', 'validee_gtec', 'rapport_soumis'].includes(r.status)) return false;
      }

      if (domainFilter !== 'all' && r.categoryId !== domainFilter) {
        return false;
      }

      return true;
    });
  }, [mappedRequests, statusFilter, domainFilter]);

  const activeCount = mappedRequests.filter((r) => ['en_cours', 'mission_acceptee', 'planifiee'].includes(r.status)).length;
  const pendingCount = mappedRequests.filter((r) => ['nouvelle', 'a_qualifier', 'qualifiee', 'technicien_attribue'].includes(r.status)).length;
  const completedCount = mappedRequests.filter((r) => ['terminee', 'validee_gtec', 'rapport_soumis'].includes(r.status)).length;

  const handleZoneSelect = (zone: (typeof CAMEROON_ZONES)[0]) => {
    setCameraState({ lat: zone.lat, lng: zone.lng, zoom: zone.zoom });
  };

  const handleMarkerClick = (req: ServiceRequest) => {
    setSelectedTech(null);
    setSelectedReq(req);
    if (req.coordinates) {
      setCameraState({ lat: req.coordinates.lat, lng: req.coordinates.lng, zoom: 14 });
    }
  };

  const handleTechClick = (tech: TrackedTechnician) => {
    setSelectedReq(null);
    setSelectedTech(tech);
    setCameraState({ lat: tech.currentCoords.lat, lng: tech.currentCoords.lng, zoom: 14 });
  };

  const handleResetTechnicians = () => {
    setTechnicians((prev) =>
      prev.map((t, idx) => {
        const start = t.waypoints[0];
        return {
          ...t,
          currentProgress: idx === 0 ? 10 : idx === 1 ? 25 : 90,
          currentCoords: idx === 0 ? t.waypoints[0] : idx === 1 ? t.waypoints[1] : t.waypoints[t.waypoints.length - 1],
          status: idx === 2 ? 'arrive_sur_site' : 'en_route',
          statusLabel: idx === 2 ? 'Sur site' : 'En route',
          speedKmH: idx === 2 ? 0 : 45,
        };
      })
    );
  };

  const triggerTechnicianArrival = (tech: TrackedTechnician) => {
    const dest = tech.waypoints[tech.waypoints.length - 1];
    setTechnicians((prev) =>
      prev.map((t) =>
        t.id === tech.id
          ? {
              ...t,
              currentProgress: 100,
              currentCoords: dest,
              speedKmH: 0,
              status: 'arrive_sur_site',
              statusLabel: 'Arrivé sur site',
            }
          : t
      )
    );

    mockWebSocket.simulateTechnicianArrived({
      requestId: tech.missionId,
      reference: tech.missionRef,
      technicianName: tech.name,
      locationName: tech.destinationAddress,
    });
  };

  const pushEnRouteNotification = (tech: TrackedTechnician) => {
    mockWebSocket.simulateTechnicianEnRoute({
      requestId: tech.missionId,
      reference: tech.missionRef,
      technicianName: tech.name,
      technicianPhone: tech.phone,
      clientName: tech.destinationClient,
      city: tech.destinationAddress,
      etaMinutes: Math.max(3, Math.round(((100 - tech.currentProgress) / 100) * 20)),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
      {/* Barre supérieure : Titre et indicateurs d'état */}
      <div className="p-4 sm:p-5 bg-[#063D2A] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#075B35]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#69B536] text-[#063D2A] flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Space_Grotesk'] font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Cartographie & Suivi en Temps Réel des Techniciens</span>
                <span className="hidden sm:inline-flex items-center gap-1 bg-[#075B35] text-emerald-200 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                  <Radio className="w-2.5 h-2.5 text-[#69B536] animate-pulse" />
                  <span>GPS 10 Hz Live</span>
                </span>
              </h3>
              <p className="text-[11px] text-emerald-200">
                Visualisation des déplacements des techniciens GTEC en transit vers les sites d'intervention au Cameroun
              </p>
            </div>
          </div>
        </div>

        {/* Compteurs badges statut */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-[#69B536] text-slate-950 shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900 border border-emerald-700/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>En cours ({activeCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-emerald-950/60 text-amber-200 hover:bg-emerald-900 border border-amber-600/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>À dispatcher ({pendingCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-blue-400 text-slate-950 shadow-sm'
                : 'bg-emerald-950/60 text-cyan-200 hover:bg-emerald-900 border border-cyan-700/40'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Clôturées ({completedCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all text-[11px] cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-950 font-bold'
                : 'text-emerald-300 hover:text-white'
            }`}
          >
            Toutes ({mappedRequests.length})
          </button>
        </div>
      </div>

      {/* Barre d'outils dédiée au Suivi Temps Réel des Techniciens (Play/Pause, Vitesse, Focus) */}
      <div className="bg-[#04261a] px-3 sm:px-5 py-2.5 text-white flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 bg-[#075B35] px-2.5 py-1 rounded-lg text-emerald-100 font-bold text-[11px] shrink-0">
            <Radio className="w-3 h-3 text-[#69B536] animate-pulse" />
            <span>Suivi Télémétrique :</span>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-colors cursor-pointer shrink-0"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#69B536]" />
                <span>Reprendre</span>
              </>
            )}
          </button>

          <div className="flex items-center bg-black/30 rounded p-0.5 shrink-0">
            {[1, 2, 5].map((mult) => (
              <button
                key={mult}
                onClick={() => setSpeedMultiplier(mult)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${
                  speedMultiplier === mult
                    ? 'bg-[#69B536] text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {mult}x
              </button>
            ))}
          </div>

          <button
            onClick={handleResetTechnicians}
            className="flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-white text-[11px] hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Réinitialiser positions initiales des techniciens"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
        </div>

        {/* Boutons de raccourcis pour cibler et suivre un technicien spécifique */}
        <div className="flex items-center gap-1.5 ml-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] text-emerald-300 shrink-0 font-medium hidden md:inline">
            Cibler véhicule :
          </span>
          {technicians.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTechClick(t)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer ${
                selectedTech?.id === t.id
                  ? 'bg-[#69B536] text-slate-950 font-bold shadow-xs'
                  : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/50'
              }`}
            >
              {t.vehicleType === 'bike' ? <Bike className="w-3 h-3" /> : <Car className="w-3 h-3" />}
              <span>{t.name.split(' ')[0]}</span>
              <span className="font-mono text-[9px] bg-black/30 px-1 py-0.2 rounded">
                {t.speedKmH} km/h
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Barre de sélection des zones régionales */}
      <div className="bg-[#F5F7F1] p-3 sm:px-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-500 font-semibold text-[11px] shrink-0 mr-1 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-[#075B35]" />
            <span>Centrer :</span>
          </span>
          {CAMEROON_ZONES.map((zone, idx) => (
            <button
              key={idx}
              onClick={() => handleZoneSelect(zone)}
              className="px-2.5 py-1 rounded bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              {zone.name}
            </button>
          ))}
        </div>

        {/* Sélecteur de domaine technique */}
        <div className="flex items-center gap-2 ml-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#075B35]"
          >
            <option value="all">Tous les domaines d'ingénierie</option>
            <option value="cat-solar">Solaire & Électrique</option>
            <option value="cat-hvac">Froid & Climatisation</option>
            <option value="cat-it">Informatique & Réseaux</option>
            <option value="cat-civil">Génie Civil & BTP</option>
          </select>
        </div>
      </div>

      {/* Zone Carte Google Maps + Panneau Latéral */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] sm:min-h-[580px]">
        {/* Colonne Carte Google Maps */}
        <div className="lg:col-span-8 relative w-full h-[440px] sm:h-[580px] bg-slate-100">
          <APIProvider apiKey={apiKey} libraries={['marker']}>
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={{ lat: cameraState.lat, lng: cameraState.lng }}
              defaultZoom={cameraState.zoom}
              gestureHandling="greedy"
              disableDefaultUI={false}
              internalUsageAttributionIds={['gmp_git_agentskills_v1']}
              style={{ width: '100%', height: '100%' }}
            >
              <CameraController center={{ lat: cameraState.lat, lng: cameraState.lng }} zoom={cameraState.zoom} />

              {/* Tracé de l'itinéraire des techniciens en transit */}
              {showLiveTracking &&
                technicians.map((t) => (
                  <MapPolyline
                    key={`route-${t.id}`}
                    path={t.waypoints}
                    color={t.color}
                    weight={selectedTech?.id === t.id ? 5 : 3}
                  />
                ))}

              {/* Marqueurs des interventions fixes au Cameroun */}
              {filteredRequests.map((req) => {
                const domain = DOMAIN_STYLES[req.categoryId] || DOMAIN_STYLES['cat-solar'];
                const isSelected = selectedReq?.id === req.id;
                const isCritical = req.urgency === 'critique';

                return (
                  <AdvancedMarker
                    key={req.id}
                    position={req.coordinates!}
                    onClick={() => handleMarkerClick(req)}
                    title={`${req.reference} - ${req.title}`}
                  >
                    <div className="relative group cursor-pointer transition-transform hover:scale-110">
                      {isCritical && (
                        <div className="absolute -inset-1.5 rounded-full bg-red-500 animate-ping opacity-75" />
                      )}

                      <Pin
                        background={domain.bg}
                        borderColor={domain.border}
                        glyphColor="#FFFFFF"
                        scale={isSelected ? 1.3 : 1.1}
                      />

                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {req.reference}
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* MARQUEURS DES TECHNICIENS EN DÉPLACEMENT TEMPS RÉEL */}
              {showLiveTracking &&
                technicians.map((tech) => {
                  const isSelected = selectedTech?.id === tech.id;
                  const isArrived = tech.status === 'arrive_sur_site';

                  return (
                    <AdvancedMarker
                      key={`tech-marker-${tech.id}`}
                      position={tech.currentCoords}
                      onClick={() => handleTechClick(tech)}
                      title={`${tech.name} (${tech.vehiclePlate})`}
                    >
                      <div className="relative group cursor-pointer select-none">
                        {/* Anneau de balise GPS pulsant */}
                        <div
                          className={`absolute -inset-2 rounded-full opacity-75 ${
                            isArrived ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
                          }`}
                        />

                        {/* Corps du badge véhicule avec icône et vitesse */}
                        <div
                          className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white font-bold text-xs shadow-xl border-2 transition-all ${
                            isSelected
                              ? 'bg-slate-950 scale-125 ring-2 ring-white border-[#69B536]'
                              : 'bg-[#063D2A] hover:scale-110 border-[#69B536]'
                          }`}
                        >
                          <div
                            className="transition-transform duration-300"
                            style={{ transform: `rotate(${tech.heading}deg)` }}
                          >
                            {tech.vehicleType === 'bike' ? (
                              <Bike className="w-3.5 h-3.5 text-[#69B536]" />
                            ) : (
                              <Car className="w-3.5 h-3.5 text-[#69B536]" />
                            )}
                          </div>

                          <span className="font-['Space_Grotesk'] text-[11px] whitespace-nowrap">
                            {tech.name.split(' ')[0]}
                          </span>

                          <span className="font-mono text-[9px] bg-black/40 px-1.5 py-0.2 rounded text-emerald-200">
                            {tech.speedKmH > 0 ? `${tech.speedKmH}k` : 'STOP'}
                          </span>
                        </div>

                        {/* Info étiquette flottante au survol */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white font-mono text-[9px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center gap-1">
                          <Radio className="w-2.5 h-2.5 text-[#69B536] animate-pulse" />
                          <span>{tech.statusLabel}</span>
                        </div>
                      </div>
                    </AdvancedMarker>
                  );
                })}

              {/* InfoWindow quand une intervention fixe est sélectionnée */}
              {selectedReq && selectedReq.coordinates && (
                <InfoWindow
                  position={selectedReq.coordinates}
                  onCloseClick={() => setSelectedReq(null)}
                >
                  <div className="p-2 max-w-xs space-y-2 text-slate-800 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-['IBM_Plex_Mono'] font-bold text-[#075B35] text-xs">
                        {selectedReq.reference}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          selectedReq.urgency === 'critique' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {selectedReq.urgency.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs leading-snug">
                      {selectedReq.title}
                    </h4>

                    <div className="bg-slate-50 p-2 rounded text-[11px] space-y-1">
                      <div>
                        <span className="text-slate-500">Client :</span> <strong>{selectedReq.clientName}</strong>
                        {selectedReq.companyName && (
                          <span className="text-slate-500 block text-[10px]">{selectedReq.companyName}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-3 h-3 text-[#075B35] shrink-0" />
                        <span>
                          {selectedReq.city} · {selectedReq.district || 'Centre'}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-500">
                        GPS : {selectedReq.coordinates.lat.toFixed(4)}° N, {selectedReq.coordinates.lng.toFixed(4)}° E
                      </div>
                    </div>

                    {selectedReq.assignedTechnicianName && (
                      <div className="flex items-center justify-between text-[11px] bg-emerald-50 p-1.5 rounded border border-emerald-200 text-emerald-900">
                        <span className="flex items-center gap-1 font-medium">
                          <HardHat className="w-3.5 h-3.5 text-[#075B35]" />
                          <span>{selectedReq.assignedTechnicianName}</span>
                        </span>
                        {selectedReq.assignedTechnicianPhone && (
                          <a
                            href={`tel:${selectedReq.assignedTechnicianPhone}`}
                            className="font-mono font-bold text-[#075B35] hover:underline"
                          >
                            Appeler
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}

              {/* InfoWindow quand un technicien en déplacement est sélectionné */}
              {selectedTech && (
                <InfoWindow
                  position={selectedTech.currentCoords}
                  onCloseClick={() => setSelectedTech(null)}
                >
                  <div className="p-2.5 max-w-sm space-y-2.5 text-slate-900 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#063D2A] text-white flex items-center justify-center font-bold text-xs">
                          {selectedTech.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-950 leading-tight">
                            {selectedTech.name}
                          </h4>
                          <span className="text-[10px] text-slate-500">
                            {selectedTech.specialty}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {selectedTech.vehiclePlate}
                      </span>
                    </div>

                    {/* Données de télémétrie en direct */}
                    <div className="grid grid-cols-3 gap-1.5 bg-[#F5F7F1] p-2 rounded-lg text-center font-mono text-[10px]">
                      <div>
                        <span className="text-slate-400 block text-[9px]">VITESSE</span>
                        <strong className="text-emerald-800 text-xs">{selectedTech.speedKmH} km/h</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">PROGRÈS</span>
                        <strong className="text-slate-800 text-xs">{Math.round(selectedTech.currentProgress)}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">STATUT</span>
                        <strong className="text-[#075B35] text-[10px] uppercase">{selectedTech.status}</strong>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded text-[11px] space-y-1">
                      <div>
                        <span className="text-slate-500 font-medium">Mission :</span>{' '}
                        <strong>{selectedTech.missionRef}</strong> — {selectedTech.destinationTitle}
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Client :</span>{' '}
                        <strong>{selectedTech.destinationClient}</strong>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-[#075B35] shrink-0" />
                        <span>{selectedTech.destinationAddress}</span>
                      </div>
                    </div>

                    {/* Actions de simulation et notification directes */}
                    <div className="pt-1 flex flex-col gap-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => triggerTechnicianArrival(selectedTech)}
                          className="px-2 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Target className="w-3 h-3" />
                          <span>Arrivée sur site</span>
                        </button>

                        <button
                          onClick={() => pushEnRouteNotification(selectedTech)}
                          className="px-2 py-1.5 bg-[#075B35] hover:bg-[#063D2A] text-white rounded font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Send className="w-3 h-3 text-[#69B536]" />
                          <span>Alerter client</span>
                        </button>
                      </div>

                      <a
                        href={`tel:${selectedTech.phone}`}
                        className="w-full text-center py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-[#075B35]" />
                        <span>Appeler {selectedTech.phone}</span>
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Légende flottante en bas à gauche de la carte */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-md text-[11px] space-y-1.5 pointer-events-auto max-w-[240px]">
            <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider">
              Légende Domaines & Suivi
            </span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#075B35]" />
                <span className="text-slate-700 truncate">Solaire</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                <span className="text-slate-700 truncate">Froid / CVC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                <span className="text-slate-700 truncate">Réseaux</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                <span className="text-slate-700 truncate">BTP & Génie</span>
              </div>
            </div>
            <div className="pt-1 border-t border-slate-200 flex items-center gap-1.5 text-[10px] text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Technicien GTEC en route</span>
            </div>
          </div>
        </div>

        {/* Colonne latérale : Liste synchronisée des techniciens en transit et interventions */}
        <div className="lg:col-span-4 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col h-[440px] sm:h-[580px]">
          {/* Onglet sélecteur Techniciens en transit / Interventions */}
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <div>
              <h4 className="font-['Space_Grotesk'] font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <span>Techniciens Déployés ({technicians.length})</span>
              </h4>
              <p className="text-[10px] text-slate-500">
                Suivi GPS direct des équipes mobiles GTEC
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#075B35] text-white px-2 py-0.5 rounded shadow-xs">
              Live GPS
            </span>
          </div>

          {/* Liste des techniciens en transit avec cartes de télémétrie */}
          <div className="p-2 space-y-2 overflow-y-auto max-h-[260px] border-b border-slate-200 bg-[#F5F7F1]/50">
            {technicians.map((tech) => {
              const isSelected = selectedTech?.id === tech.id;
              const isArrived = tech.status === 'arrive_sur_site';

              return (
                <div
                  key={tech.id}
                  onClick={() => handleTechClick(tech)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'border-[#075B35] bg-emerald-50/90 shadow-xs ring-1 ring-[#075B35]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#063D2A] text-white flex items-center justify-center font-bold text-[10px]">
                        {tech.avatar}
                      </div>
                      <div>
                        <strong className="text-slate-900 text-xs">{tech.name}</strong>
                        <span className="text-[10px] text-slate-400 block">{tech.specialty}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isArrived
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {tech.statusLabel}
                    </span>
                  </div>

                  {/* Barre de progression du trajet */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{tech.originBaseName.split(' ')[0]}</span>
                      <span className="font-bold text-[#075B35]">
                        {tech.speedKmH > 0 ? `${tech.speedKmH} km/h` : 'Arrêté'}
                      </span>
                      <span>{tech.destinationAddress.split(',')[0]}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#69B536] h-full transition-all duration-500"
                        style={{ width: `${Math.min(100, tech.currentProgress)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="font-mono text-[#075B35] font-bold">
                      {tech.missionRef}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        pushEnRouteNotification(tech);
                      }}
                      className="text-[#075B35] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      title="Diffuser une notification au client"
                    >
                      <span>Alerter client</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Liste des interventions cartographiées */}
          <div className="p-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <span className="text-[11px] font-bold text-slate-700">
              Interventions sur la carte ({filteredRequests.length})
            </span>
            <span className="text-[10px] text-slate-500">Cliquer pour centrer</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1 p-2 space-y-1.5">
            {filteredRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Aucune intervention ne correspond aux filtres.
              </div>
            ) : (
              filteredRequests.map((req) => {
                const domain = DOMAIN_STYLES[req.categoryId] || DOMAIN_STYLES['cat-solar'];
                const isSelected = selectedReq?.id === req.id;

                return (
                  <div
                    key={req.id}
                    onClick={() => handleMarkerClick(req)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'border-[#075B35] bg-emerald-50/70 shadow-xs ring-1 ring-[#075B35]'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${domain.dot}`} />
                        <span className="font-['IBM_Plex_Mono'] font-bold text-slate-900 text-xs">
                          {req.reference}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          req.status === 'en_cours'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'nouvelle'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h5 className="font-semibold text-slate-800 text-xs line-clamp-1">{req.title}</h5>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#075B35]" />
                        <span>
                          {req.city} ({req.district || 'Centre'})
                        </span>
                      </div>
                      {req.assignedTechnicianName && (
                        <span className="text-[10px] font-medium text-emerald-800">
                          {req.assignedTechnicianName.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
