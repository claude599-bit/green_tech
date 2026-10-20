import React from 'react';
import { Zap, Snowflake, Server, Building2, Check, ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/animations/ScrollAnimation';

interface ServicesViewProps {
  onNavigate: (view: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center mx-auto shadow-md border border-emerald-200">
            <img src="/logo.png" alt="Logo GTEC" className="w-full h-full object-contain" />
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#075B35]">
            <Award className="w-4 h-4 text-[#69B536]" />
            <span>Catalogue d'Ingénierie & Maintenance Spécialisée</span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202622]">
            Services techniques & énergies renouvelables
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            GTEC mobilise des ingénieurs diplômés et techniciens certifiés pour concevoir, installer, auditer et dépanner vos infrastructures critiques partout au Cameroun.
          </p>
        </div>
      </ScrollReveal>

      {/* Service 1: Solar & Electrical */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group">
          <div className="lg:col-span-5 relative h-72 lg:h-auto overflow-hidden">
            <img
              src="/src/assets/images/service_electrical_power_1792438627390.jpg"
              alt="Armoire électrique et solaire GTEC"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-[#063D2A]/90 backdrop-blur-xs text-white p-2.5 rounded-xl">
              <Zap className="w-5 h-5 text-[#69B536]" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs text-white flex items-center justify-between">
              <span className="font-mono text-emerald-300">Norme NF C 15-100</span>
              <span className="font-mono text-[#69B536] font-bold">Autonomie 24/7</span>
            </div>
          </div>
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#075B35] uppercase tracking-wide">
                <span>01 · Solaire & Énergie</span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#202622]">
                Génie Électrique & Solaire Photovoltaïque
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Études d'ensoleillement et dimensionnement sur mesure de centrales solaires avec stockage lithium (LiFePO4). Pose d'onduleurs hybrides de 3kVA à 250kVA, synchronisation avec groupes électrogènes, protection parafoudre tropicalisée et armoires TGBT.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 pt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Kits solaires hybrides résidentiels (3 à 15kVA)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Centrales industrielles en autoconsommation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Armoires TGBT & inverseurs automatiques</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Audits d'harmoniques & compensation réactive</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4 text-[#075B35]" />
                <span>Dépannage d'urgence sous 2h à Douala et Yaoundé</span>
              </div>
              <button
                onClick={() => onNavigate('/demande-devis')}
                className="px-5 py-3 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer self-start sm:self-auto"
              >
                <span>Demander un devis pour ce service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Service 2: HVAC & Cold Storage */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group">
          <div className="lg:col-span-5 relative h-72 lg:h-auto lg:order-last overflow-hidden">
            <img
              src="/src/assets/images/service_cooling_hvac_1792438627774.jpg"
              alt="Centrale frigorifique industrielle GTEC"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-[#063D2A]/90 backdrop-blur-xs text-white p-2.5 rounded-xl">
              <Snowflake className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs text-white flex items-center justify-between">
              <span className="font-mono text-cyan-300">-25°C à +4°C</span>
              <span className="font-mono text-[#69B536] font-bold">Bitzer & Danfoss</span>
            </div>
          </div>
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#075B35] uppercase tracking-wide">
                <span>02 · Thermique & Froid</span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#202622]">
                Froid Industriel & Climatisation Haute Efficacité
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Installation et maintenance de chambres froides positives et négatives destinées à l'agro-industrie, aux supermarchés et aux cliniques. Remplacement de compresseurs, détection de fuites, recharge de fluides écologiques et contrats de maintenance préventive 24/7.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 pt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Chambres froides 20m³ à 350m³ modulaires</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Groupes split & climatisation VRV/VRF tertiaire</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Régulation électronique & alertes connectées</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Astreinte dépannage frigorifique d'urgence 24h/24</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#075B35]" />
                <span>Garantie chaîne du froid & pièces d'origine certifiées</span>
              </div>
              <button
                onClick={() => onNavigate('/demande-devis')}
                className="px-5 py-3 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer self-start sm:self-auto"
              >
                <span>Demander un devis pour ce service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Service 3: IT & Networks */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group">
          <div className="lg:col-span-5 relative h-72 lg:h-auto overflow-hidden">
            <img
              src="/src/assets/images/service_it_networks_1792438627961.jpg"
              alt="Baie réseau et serveurs informatiques GTEC"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-[#063D2A]/90 backdrop-blur-xs text-white p-2.5 rounded-xl">
              <Server className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs text-white flex items-center justify-between">
              <span className="font-mono text-emerald-300">Recette Fluke Cat6A</span>
              <span className="font-mono text-[#69B536] font-bold">Fibre 10G</span>
            </div>
          </div>
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#075B35] uppercase tracking-wide">
                <span>03 · Numérique & Sécurité</span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#202622]">
                Génie Informatique, Télécoms & Réseaux
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Déploiement de câblage structuré certifié Cat6A/Cat7 et fibre optique monomode/multimode. Montage et brassage de baies serveurs, mise en place de réseaux Wi-Fi professionnels haute densité et sécurisation des alimentations par onduleurs industriels.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 pt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Baies 19 pouces (12U à 42U) thermo-régulées</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Tirage & fusion fibre optique avec réflectomètre</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Vidéosurveillance IP IA & contrôle d'accès</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Onduleurs Online double conversion 1kVA à 40kVA</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4 text-[#075B35]" />
                <span>Certification formelle par banc de test Fluke</span>
              </div>
              <button
                onClick={() => onNavigate('/demande-devis')}
                className="px-5 py-3 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer self-start sm:self-auto"
              >
                <span>Demander un devis pour ce service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Service 4: Civil Engineering & BTP with Real Generated Photo */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group">
          <div className="lg:col-span-5 relative h-72 lg:h-auto lg:order-last overflow-hidden">
            <img
              src="/src/assets/images/btp_engineering_gtec_1792482458646.jpg"
              alt="Chantier génie civil et BTP GTEC Cameroun"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-[#063D2A]/90 backdrop-blur-xs text-white p-2.5 rounded-xl">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs text-white flex items-center justify-between">
              <span className="font-mono text-amber-300">Béton Armé 350kg/m³</span>
              <span className="font-mono text-[#69B536] font-bold">Décennale</span>
            </div>
          </div>
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#075B35] uppercase tracking-wide">
                <span>04 · BTP & Infrastructures</span>
              </div>
              <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#202622]">
                Génie Civil & BTP Durable
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Fondations pour mâts et ombrières photovoltaïques, réhabilitation thermique de toitures pour réduire la facture de climatisation, locaux techniques coupe-feu et dalles vibrées pour groupes électrogènes de forte puissance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 pt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Fondations spéciales ombrières solaires de parking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Isolation sous-toiture & étanchéité tropicale</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Locaux serveurs & salles onduleurs sécurisées</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#69B536] shrink-0" />
                  <span>Dalles techniques avec amortisseurs de vibration</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#075B35]" />
                <span>Calculs certifiés par bureau d'études structure</span>
              </div>
              <button
                onClick={() => onNavigate('/demande-devis')}
                className="px-5 py-3 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer self-start sm:self-auto"
              >
                <span>Demander un devis pour ce service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
