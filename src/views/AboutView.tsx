import React from 'react';
import { ShieldCheck, Award, Users, Lightbulb, Check, Sparkles, Target, Compass, HardHat, PhoneCall } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem, AnimatedCounter } from '../components/animations/ScrollAnimation';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-white p-2 flex items-center justify-center mx-auto shadow-md border border-emerald-200">
            <img src="/logo.png" alt="Logo GTEC" className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075B35]">
            À Propos de GTEC Cameroun
          </span>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202622]">
            L'ingénierie au service de la transition énergétique camerounaise
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Green Tech Energy Cameroon (GTEC) réunit des ingénieurs diplômés et techniciens chevronnés du génie électrique, thermique, numérique et civil pour apporter des solutions fiables, pérennes et durables aux entreprises et résidents du Cameroun.
          </p>
        </div>
      </ScrollReveal>

      {/* Numerical Achievements Bar */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="bg-[#042519] text-white rounded-3xl p-8 border border-emerald-900 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="font-['IBM_Plex_Mono'] font-extrabold text-2xl sm:text-3xl text-[#69B536] tabular-nums">
              +<AnimatedCounter target={185} duration={1500} />
            </div>
            <div className="text-xs text-emerald-200/80">Projets livrés & conformes</div>
          </div>
          <div className="space-y-1">
            <div className="font-['IBM_Plex_Mono'] font-extrabold text-2xl sm:text-3xl text-[#69B536] tabular-nums">
              <AnimatedCounter target={2800} duration={1500} /> kWc
            </div>
            <div className="text-xs text-emerald-200/80">Capacité solaire totale</div>
          </div>
          <div className="space-y-1">
            <div className="font-['IBM_Plex_Mono'] font-extrabold text-2xl sm:text-3xl text-[#69B536] tabular-nums">
              <AnimatedCounter target={24} duration={1200} />
            </div>
            <div className="text-xs text-emerald-200/80">Techniciens certifiés mobiles</div>
          </div>
          <div className="space-y-1">
            <div className="font-['IBM_Plex_Mono'] font-extrabold text-2xl sm:text-3xl text-[#69B536] tabular-nums">
              <AnimatedCounter target={100} duration={1400} />%
            </div>
            <div className="text-xs text-emerald-200/80">Traçabilité & PV numériques</div>
          </div>
        </div>
      </ScrollReveal>

      {/* Values & Pillars with Staggered Scroll Reveal */}
      <div className="space-y-6">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#075B35]">
              Nos Fondations
            </span>
            <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#202622] mt-1">
              Trois piliers d'excellence technique
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StaggerItem>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 shadow-xs hover:shadow-lg transition-all h-full">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#075B35] flex items-center justify-center">
                <Award className="w-6 h-6 text-[#075B35]" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-xl text-slate-900">
                Rigueur & Normes Internationales
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Toutes nos installations respectent les normes NF C 15-100 (basse tension), CEI 61215 (photovoltaïque) et les règles de sécurité frigorifique les plus strictes. Pas d'improvisation ni de bricolage.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold pt-2 border-t border-slate-100">
                Garantie décennale & PV de réception
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 shadow-xs hover:shadow-lg transition-all h-full">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#075B35] flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-[#075B35]" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-xl text-slate-900">
                Innovation & Tropicalisation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Nous sélectionnons des équipements spécialement traités contre la corrosion saline (Douala/Kribi) et les fortes amplitudes thermiques pour garantir une durabilité maximale aux onduleurs et compresseurs.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold pt-2 border-t border-slate-100">
                Onduleurs étanches IP65 & traitement C5M
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 shadow-xs hover:shadow-lg transition-all h-full">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#075B35] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#075B35]" />
              </div>
              <h3 className="font-['Space_Grotesk'] font-bold text-xl text-slate-900">
                Techniciens Agréés & Géolocalisés
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Chaque technicien intégrant notre réseau passe un processus d'évaluation technique rigoureux par l'administration GTEC. Notre système de géolocalisation assure un suivi transparent en temps réel lors des déplacements.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold pt-2 border-t border-slate-100">
                Supervision télémétrique GPS en direct
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* Corporate Commitments */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="bg-gradient-to-br from-[#063D2A] to-[#042519] text-white rounded-3xl p-8 sm:p-12 space-y-8 border border-emerald-700/50 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#69B536]">
              Charte de Confiance GTEC
            </span>
            <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-white">
              Nos engagements formels pour nos clients & partenaires
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-emerald-100">
            <div className="flex items-start gap-3 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80">
              <Check className="w-5 h-5 text-[#69B536] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Devis clairs en Francs CFA (XAF)</span>
                <span>Chiffrage exhaustif sans frais cachés, délais fermes d'approvisionnement et validation préalable.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80">
              <Check className="w-5 h-5 text-[#69B536] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Pièces d'origine certifiée constructeur</span>
                <span>Partenariat direct avec les fabricants de référence (Victron Energy, Schneider Electric, Bitzer, Danfoss, Legrand).</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80">
              <Check className="w-5 h-5 text-[#69B536] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Rapports & PV d'intervention dématérialisés</span>
                <span>Accès instantané à l'historique complet de maintenance, photos avant/après et mesures sur votre espace client.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/80">
              <Check className="w-5 h-5 text-[#69B536] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block mb-0.5">Astreinte 24/7 pour les installations critiques</span>
                <span>Garantie de temps d'intervention sous 2h pour les chambres froides hospitalières et les banques de données.</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
