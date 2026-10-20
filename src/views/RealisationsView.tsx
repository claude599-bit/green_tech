import React, { useState } from 'react';
import { MapPin, CheckCircle, ArrowRight, ShieldCheck, Zap, Snowflake, Server, Building2, Filter } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem, AnimatedCounter } from '../components/animations/ScrollAnimation';

interface RealisationsViewProps {
  onNavigate: (view: string) => void;
}

export const RealisationsView: React.FC<RealisationsViewProps> = ({ onNavigate }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  const projects = [
    {
      title: 'Centrale Solaire Hybride 50kVA avec Stockage LiFePO4',
      client: 'Complexe Hôtelier & Éco-lodge',
      location: 'Kribi, Région du Sud',
      domain: 'Solaire & Électrique',
      category: 'solaire',
      specs: '96 modules monocristallins 550W, 4 onduleurs Victron 15kVA, 60kWh de batteries lithium',
      outcome: 'Autonomie électrique de 92% sans interruption, réduction de 65% de la facture carburant groupe.',
      savings: 'Économie annuelle : ~18 500 000 XAF',
      image: '/src/assets/images/hero_solar_clean_energy_1792438626678.jpg',
    },
    {
      title: 'Chambres Froides de Conservation Fruits & Poissons (80m³)',
      client: 'AgroCam Industries SA',
      location: 'Zone Industrielle Bassa, Douala',
      domain: 'Froid Industriel',
      category: 'froid',
      specs: 'Double compresseur Bitzer semi-hermétique, fluide écologique R449A, télésurveillance connectée',
      outcome: 'Zéro rupture de chaîne de froid sur 12 mois, maintien strict à -18°C et +2°C.',
      savings: 'Pertes de denrées réduites à 0%',
      image: '/src/assets/images/service_cooling_hvac_1792438627774.jpg',
    },
    {
      title: 'Refonte Câblage Cat6A & Baie 42U Haute Disponibilité',
      client: 'Cabinet Juridique & Financier',
      location: 'Bonanjo, Douala',
      domain: 'Génie Informatique',
      category: 'reseaux',
      specs: '96 prises réseau blindées, switchs PoE manageable Cisco, onduleur Eaton 6kVA online',
      outcome: 'Débit Gigabit certifié sur l’ensemble des postes, bascule onduleur en 0 milliseconde.',
      savings: 'Disponibilité du système : 99.99%',
      image: '/src/assets/images/service_it_networks_1792438627961.jpg',
    },
    {
      title: 'Kit Solaire Hybride Résidentiel 10kVA',
      client: 'Résidence Privée (Villa)',
      location: 'Quartier Bastos, Yaoundé',
      domain: 'Solaire & Électrique',
      category: 'solaire',
      specs: '16 panneaux 500W, onduleur hybride 10kW, 2 batteries lithium 48V 100Ah',
      outcome: 'Alimentation continue pour 4 climatiseurs, forage d’eau et sécurité périmétrique.',
      savings: 'Économie mensuelle : ~280 000 XAF',
      image: '/src/assets/images/service_electrical_power_1792438627390.jpg',
    },
    {
      title: 'Dalles Techniques & Ombrière Solaire Métallique (24 Véhicules)',
      client: 'Centre Commercial & Bureaux',
      location: 'Akwa Nord, Douala',
      domain: 'BTP & Génie Civil',
      category: 'btp',
      specs: 'Fondations micropieux, charpente métallique galvanisée à chaud C5M, étanchéité drainée',
      outcome: 'Supporte 45kWc de panneaux solaires tout en abritant les véhicules de la clientèle.',
      savings: 'Double usage : parking abrité + centrale solaire',
      image: '/src/assets/images/btp_engineering_gtec_1792482458646.jpg',
    },
  ];

  const filteredProjects = selectedDomain === 'all'
    ? projects
    : projects.filter(p => p.category === selectedDomain);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center mx-auto shadow-md border border-emerald-200">
            <img src="/logo.png" alt="Logo GTEC" className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075B35]">
            Portfolio de Réalisations Certifiées
          </span>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202622]">
            Nos chantiers et installations au Cameroun
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Chaque ouvrage réalisé par GTEC fait l'objet d'un procès-verbal de conformité technique, d'essais en charge et d'un accompagnement continu.
          </p>

          {/* Interactive Filter Controls (compliant with design constitution: functional buttons) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-100 rounded-xl max-w-2xl mx-auto pt-2">
            <button
              onClick={() => setSelectedDomain('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedDomain === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous les Projets ({projects.length})
            </button>
            <button
              onClick={() => setSelectedDomain('solaire')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedDomain === 'solaire'
                  ? 'bg-[#075B35] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solaire & Électricité
            </button>
            <button
              onClick={() => setSelectedDomain('froid')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedDomain === 'froid'
                  ? 'bg-[#075B35] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Froid Industriel
            </button>
            <button
              onClick={() => setSelectedDomain('reseaux')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedDomain === 'reseaux'
                  ? 'bg-[#075B35] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Réseaux IT
            </button>
            <button
              onClick={() => setSelectedDomain('btp')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedDomain === 'btp'
                  ? 'bg-[#075B35] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              BTP & Génie Civil
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Projects Grid with Staggered Scroll Animation */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((p, idx) => (
          <StaggerItem key={idx}>
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full group">
              <div className="h-64 overflow-hidden relative">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-[#063D2A]/90 backdrop-blur-md text-[#69B536] text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40">
                  {p.domain}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-[#69B536]" />
                    <span>{p.location}</span>
                  </div>
                  <span className="font-mono text-emerald-300 font-semibold">{p.client}</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <h3 className="font-['Space_Grotesk'] font-bold text-xl text-[#202622] group-hover:text-[#075B35] transition-colors leading-snug">
                    {p.title}
                  </h3>

                  <div className="bg-[#F6F8F5] p-3.5 rounded-xl text-xs space-y-1.5 border border-slate-200/80">
                    <div className="font-bold text-slate-800">Spécifications techniques :</div>
                    <div className="text-slate-600 font-mono text-[11px] leading-relaxed">{p.specs}</div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-slate-700 pt-1">
                    <CheckCircle className="w-4 h-4 text-[#69B536] shrink-0 mt-0.5" />
                    <span><strong>Résultat :</strong> {p.outcome}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-[#075B35]">
                    {p.savings}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Procès-verbal de réception validé</span>
                  <button
                    onClick={() => onNavigate('/demande-devis')}
                    className="px-4 py-2 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Projet similaire ? Demander devis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Trust Bottom Banner */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="bg-gradient-to-r from-[#042519] to-[#075B35] rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-['Space_Grotesk'] text-xl font-bold">
              Vous avez un site à auditer à Douala, Yaoundé ou en région ?
            </h4>
            <p className="text-xs text-emerald-100">
              Nos ingénieurs se déplacent sur site avec leurs instruments de mesure pour un audit de faisabilité.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-3.5 bg-[#69B536] text-slate-950 hover:bg-[#5ea72f] rounded-xl font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer"
          >
            Planifier une visite de site
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
};
