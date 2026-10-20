import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Snowflake,
  Server,
  Building2,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  Activity,
  Sun,
  BatteryCharging,
  Gauge,
  Clock,
  MapPin,
  TrendingUp,
  Cpu,
  ChevronRight,
  Shield,
  Layers,
  Wrench,
  Check,
} from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem, AnimatedCounter } from '../components/animations/ScrollAnimation';
import { motion } from 'motion/react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenAssistant: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenAssistant }) => {
  // Quick Solar / Energy Simulator State
  const [profileType, setProfileType] = useState<'residentiel' | 'commercial' | 'industriel'>('residentiel');
  const [monthlyBill, setMonthlyBill] = useState<number>(250000); // in XAF

  // Real-time calculated estimates based on Cameroon solar irradiance (~4.5 - 5.2 kWh/m²/day)
  const calculateEstimates = () => {
    let kwp = 0;
    let batteryKwh = 0;
    let monthlySavings = 0;
    let paybackYears = 0;
    let autonomyRate = 0;

    if (profileType === 'residentiel') {
      kwp = Math.max(3, Math.round((monthlyBill / 35000) * 10) / 10);
      batteryKwh = Math.round(kwp * 2.2);
      monthlySavings = Math.round(monthlyBill * 0.78);
      paybackYears = 3.4;
      autonomyRate = 88;
    } else if (profileType === 'commercial') {
      kwp = Math.max(10, Math.round((monthlyBill / 30000) * 10) / 10);
      batteryKwh = Math.round(kwp * 1.8);
      monthlySavings = Math.round(monthlyBill * 0.82);
      paybackYears = 2.9;
      autonomyRate = 92;
    } else {
      kwp = Math.max(30, Math.round((monthlyBill / 28000) * 10) / 10);
      batteryKwh = Math.round(kwp * 1.5);
      monthlySavings = Math.round(monthlyBill * 0.85);
      paybackYears = 2.5;
      autonomyRate = 95;
    }

    return { kwp, batteryKwh, monthlySavings, paybackYears, autonomyRate };
  };

  const estimates = calculateEstimates();

  // Active regional node selector for Cameroon Coverage
  const [selectedRegion, setSelectedRegion] = useState<'douala' | 'yaounde' | 'kribi' | 'bafoussam' | 'garoua'>('douala');

  const regionData = {
    douala: {
      name: 'Littoral · Douala & Périphérie',
      hub: 'Direction Régionale Akwa & Base Logistique Bassa',
      activeSites: 94,
      teams: 8,
      leadTime: '< 1h30',
      irradiance: '4.7 kWh/m²/j',
      humidity: '88% tropicale (matériel anti-corrosion marine C5M)',
    },
    yaounde: {
      name: 'Centre · Yaoundé & Sièges',
      hub: 'Bureau Technique Bastos & Antenne Nsam',
      activeSites: 62,
      teams: 5,
      leadTime: '< 1h45',
      irradiance: '4.9 kWh/m²/j',
      humidity: '76% (protection contre les surtensions orageuses)',
    },
    kribi: {
      name: 'Sud · Kribi & Complexe Portuaire',
      hub: 'Antenne Industrielle Zone Portuaire',
      activeSites: 18,
      teams: 2,
      leadTime: '< 2h30',
      irradiance: '5.1 kWh/m²/j',
      humidity: '92% saline (onduleurs étanches IP65 certifiés)',
    },
    bafoussam: {
      name: 'Ouest · Bafoussam & Hauts-Plateaux',
      hub: 'Équipe Mobile Intervention Agro-industrielle',
      activeSites: 14,
      teams: 2,
      leadTime: '< 3h',
      irradiance: '5.3 kWh/m²/j',
      humidity: 'Tempéré d’altitude (protection foudre renforcée)',
    },
    garoua: {
      name: 'Nord & Grand Nord · Garoua & Maroua',
      hub: 'Délégation Projets Solaires Sahéliens',
      activeSites: 11,
      teams: 2,
      leadTime: '< 4h',
      irradiance: '6.2 kWh/m²/j (potentiel solaire maximal)',
      humidity: 'Aride & forte chaleur (panneaux à haut coefficient thermique)',
    },
  };

  return (
    <div className="space-y-14 sm:space-y-20 lg:space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION: Luxury Dark Forest Engineering */}
      <section className="relative bg-gradient-to-b from-[#042519] via-[#063D2A] to-[#042519] text-white pt-6 pb-12 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-28 border-b border-emerald-900/60 overflow-hidden">
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#69B536]/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#69b536_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              {/* Brand kicker with official logo */}
              <ScrollReveal direction="down" delay={0.1}>
                <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-[11px] sm:text-xs font-medium shadow-inner max-w-full">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-white p-0.5 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                    <img src="/logo.png" alt="GTEC Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-semibold tracking-wide truncate">Green Tech Energy Cameroon</span>
                  <span className="text-emerald-400/60 hidden sm:inline">·</span>
                  <span className="text-emerald-300 hidden sm:inline">Génie Énergétique</span>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.2}>
                <h1 className="font-['Space_Grotesk'] text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight sm:leading-[1.12]">
                  Innover aujourd'hui, <br />
                  <span className="bg-gradient-to-r from-[#69B536] via-[#8ae64c] to-[#69B536] bg-clip-text text-transparent">
                    construire un Cameroun durable
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.3}>
                <p className="text-sm sm:text-base lg:text-lg text-emerald-100/90 max-w-2xl leading-relaxed font-normal">
                  Plateforme d'ingénierie et de maintenance industrielle au Cameroun. Nous concevons, installons et supervisons en continu vos centrales solaires hybrides, armoires électriques TGBT, chambres froides et réseaux informatiques critiques.
                </p>
              </ScrollReveal>

              {/* Action Buttons */}
              <ScrollReveal direction="up" delay={0.4}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
                  <button
                    onClick={() => onNavigate('/demande-devis')}
                    className="w-full sm:w-auto px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 bg-[#69B536] hover:bg-[#5ea72f] active:scale-[0.98] rounded-xl transition-all shadow-lg shadow-[#69B536]/20 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Demander un Devis ou Dépannage</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={onOpenAssistant}
                    className="w-full sm:w-auto px-4 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-emerald-100 hover:text-white bg-[#075B35]/90 hover:bg-[#075B35] border border-emerald-500/40 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-[#69B536]" />
                    <span>Copilote IA : Dimensionnement</span>
                  </button>
                </div>
              </ScrollReveal>

              {/* Trust Indicators with Animated Numbers */}
              <ScrollReveal direction="up" delay={0.5}>
                <div className="pt-4 sm:pt-6 border-t border-emerald-800/60 grid grid-cols-3 gap-2 sm:gap-4 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-['IBM_Plex_Mono'] font-bold text-base sm:text-xl lg:text-2xl text-white tabular-nums flex items-baseline">
                      +<AnimatedCounter target={185} duration={1600} />
                    </div>
                    <div className="text-emerald-300/80 font-medium text-[10px] sm:text-xs leading-tight">Sites & usines équipés</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-['IBM_Plex_Mono'] font-bold text-base sm:text-xl lg:text-2xl text-white tabular-nums flex items-baseline">
                      <AnimatedCounter target={2.8} decimals={1} duration={1600} /> MWc
                    </div>
                    <div className="text-emerald-300/80 font-medium text-[10px] sm:text-xs leading-tight">Solaire installé au CM</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-['IBM_Plex_Mono'] font-bold text-base sm:text-xl lg:text-2xl text-white tabular-nums flex items-baseline">
                      &lt; <AnimatedCounter target={2} duration={1200} />h
                    </div>
                    <div className="text-emerald-300/80 font-medium text-[10px] sm:text-xs leading-tight">Intervention DLA & YDÉ</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Media Focal Anchor: Interactive Live Telemetry Frame */}
            <div className="lg:col-span-5 relative">
              <ScrollReveal direction="left" delay={0.3}>
                <div className="relative rounded-2xl overflow-hidden border border-emerald-600/50 shadow-2xl bg-emerald-950/50 backdrop-blur-xs group">
                  {/* Photo with zoom effect */}
                  <div className="relative h-[380px] sm:h-[440px] overflow-hidden">
                    <img
                      src="/src/assets/images/hero_solar_clean_energy_1792438626678.jpg"
                      alt="Centrale solaire photovoltaïque industrielle GTEC Cameroun"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#042519] via-[#042519]/40 to-transparent" />
                  </div>

                  {/* Floating Live Telemetry Cards on the image */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="bg-[#042519]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/40 flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-medium text-emerald-200">Supervision GTEC Live</span>
                    </div>

                    <div className="bg-[#042519]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/40 text-xs font-mono text-[#69B536] font-bold">
                      99.8% Disponibilité
                    </div>
                  </div>

                  {/* Bottom Energy Gauge overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-5 space-y-3 bg-gradient-to-t from-[#042519] via-[#042519]/90 to-transparent">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#69B536]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Ingénierie & Normes Tropicalisées (NF C 15-100 / CEI)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-emerald-900/60 p-2 rounded-lg border border-emerald-700/50">
                        <div className="text-emerald-300/70 text-[10px] uppercase font-semibold">Production Solaire du jour</div>
                        <div className="font-mono font-bold text-white text-sm">14.82 MWh</div>
                      </div>
                      <div className="bg-emerald-900/60 p-2 rounded-lg border border-emerald-700/50">
                        <div className="text-emerald-300/70 text-[10px] uppercase font-semibold">CO₂ Évité (Cameroun)</div>
                        <div className="font-mono font-bold text-[#69B536] text-sm">9.4 Tonnes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE SOLAR & ROI CALCULATOR: Premium Engaged Tool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="bg-gradient-to-br from-white to-[#F5F8F4] rounded-3xl border border-emerald-200/80 shadow-xl overflow-hidden">
            <div className="p-6 sm:p-10 lg:p-12 space-y-8">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#075B35]">
                    <Sun className="w-4 h-4 text-[#69B536]" />
                    <span>Simulateur d'Autonomie Énergétique GTEC</span>
                  </div>
                  <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-[#202622]">
                    Estimez votre rentabilité solaire en 30 secondes
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                    Ajustez votre facture d'électricité mensuelle ou votre profil d'activité pour calculer la puissance photovoltaïque requise et vos économies immédiates en Francs CFA.
                  </p>
                </div>

                {/* Profile Selector Buttons */}
                <div className="grid grid-cols-3 sm:flex sm:items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-slate-100 rounded-xl w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setProfileType('residentiel');
                      setMonthlyBill(200000);
                    }}
                    className={`px-2 sm:px-3.5 py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all text-center cursor-pointer truncate ${
                      profileType === 'residentiel'
                        ? 'bg-[#075B35] text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Résidentiel
                  </button>
                  <button
                    onClick={() => {
                      setProfileType('commercial');
                      setMonthlyBill(650000);
                    }}
                    className={`px-2 sm:px-3.5 py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all text-center cursor-pointer truncate ${
                      profileType === 'commercial'
                        ? 'bg-[#075B35] text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Tertiaire
                  </button>
                  <button
                    onClick={() => {
                      setProfileType('industriel');
                      setMonthlyBill(2200000);
                    }}
                    className={`px-2 sm:px-3.5 py-2 text-[10px] sm:text-xs font-semibold rounded-lg transition-all text-center cursor-pointer truncate ${
                      profileType === 'industriel'
                        ? 'bg-[#075B35] text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Industrie
                  </button>
                </div>
              </div>

              {/* Interactive Slider & Result KPIs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                {/* Slider Input */}
                <div className="lg:col-span-5 space-y-5 sm:space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Facture d'électricité mensuelle
                      </label>
                      <span className="font-['IBM_Plex_Mono'] font-extrabold text-base sm:text-lg text-[#075B35]">
                        {monthlyBill.toLocaleString('fr-FR')} XAF
                      </span>
                    </div>

                    <input
                      type="range"
                      min={profileType === 'residentiel' ? 50000 : profileType === 'commercial' ? 250000 : 800000}
                      max={profileType === 'residentiel' ? 600000 : profileType === 'commercial' ? 2000000 : 7000000}
                      step={25000}
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#075B35]"
                    />

                    <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono">
                      <span>{profileType === 'residentiel' ? '50 000 XAF' : profileType === 'commercial' ? '250 000 XAF' : '800 000 XAF'}</span>
                      <span>{profileType === 'residentiel' ? '600 000 XAF' : profileType === 'commercial' ? '2 000 000 XAF' : '7 000 000 XAF'}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/80 p-3.5 sm:p-4 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1.5 sm:space-y-2">
                    <div className="font-bold text-[#075B35] flex items-center gap-1.5 text-xs">
                      <Zap className="w-3.5 h-3.5 text-[#69B536] shrink-0" />
                      <span>Configuration recommandée par GTEC</span>
                    </div>
                    <p className="leading-relaxed text-[11px] sm:text-xs">
                      Kit solaire hybride avec panneaux monocristallins Tier 1, onduleur pur sinus à couplage réseau/groupe et stockage lithium LiFePO4 certifié 6 000 cycles.
                    </p>
                  </div>
                </div>

                {/* Live Output Cards: Symmetrical & Responsive */}
                <div className="lg:col-span-7 flex flex-col gap-3 sm:gap-4">
                  {/* Top 3 KPI metrics */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs space-y-0.5 sm:space-y-1 text-center sm:text-left">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wide block truncate">
                        Puissance
                      </span>
                      <div className="font-['IBM_Plex_Mono'] font-bold text-base sm:text-2xl text-[#202622]">
                        {estimates.kwp} kWc
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-emerald-700 font-medium hidden sm:inline">Panneaux 550W</span>
                    </div>

                    <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs space-y-0.5 sm:space-y-1 text-center sm:text-left">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wide block truncate">
                        Stockage
                      </span>
                      <div className="font-['IBM_Plex_Mono'] font-bold text-base sm:text-2xl text-[#202622]">
                        {estimates.batteryKwh} kWh
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-emerald-700 font-medium hidden sm:inline">Batteries LiFePO4</span>
                    </div>

                    <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs space-y-0.5 sm:space-y-1 text-center sm:text-left">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wide block truncate">
                        Autonomie
                      </span>
                      <div className="font-['IBM_Plex_Mono'] font-bold text-base sm:text-2xl text-[#69B536]">
                        {estimates.autonomyRate}%
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-slate-600 font-medium hidden sm:inline">Relève continue</span>
                    </div>
                  </div>

                  {/* Bottom Row: Economy card & Action Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center">
                    <div className="bg-emerald-900 text-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm space-y-1 sm:col-span-2">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-200 uppercase tracking-wide">
                        Économie Mensuelle Estimée
                      </span>
                      <div className="font-['IBM_Plex_Mono'] font-extrabold text-lg sm:text-2xl lg:text-3xl text-[#69B536]">
                        ~{estimates.monthlySavings.toLocaleString('fr-FR')} XAF / mois
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-emerald-200/80 block">
                        Amortissement estimé en ~{estimates.paybackYears} ans
                      </span>
                    </div>

                    <div className="sm:col-span-1">
                      <button
                        onClick={() => onNavigate('/demande-devis')}
                        className="w-full py-3.5 sm:py-5 px-4 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <span>Valider ce devis</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. 4 CORE DOMAINS: Precision Engineering Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <ScrollReveal direction="right" delay={0.1}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#075B35]">
                Pôles d'Ingénierie GTEC
              </span>
              <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-[#202622] mt-1">
                Quatre expertises critiques pour l'industrie et l'habitat
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={0.2}>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Des normes techniques rigoureuses (NF C 15-100, CEI) adaptées aux contraintes tropicales du Cameroun.
            </p>
          </ScrollReveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Solar & Electrical */}
          <StaggerItem>
            <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/src/assets/images/service_electrical_power_1792438627390.jpg"
                  alt="Génie Électrique & Solaire"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#063D2A]/90 backdrop-blur-xs text-white p-2 rounded-xl">
                  <Zap className="w-4 h-4 text-[#69B536]" />
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#063D2A] text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                  01 · Solaire
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#202622] group-hover:text-[#075B35] transition-colors">
                    Génie Électrique & Solaire
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Centrales solaires hybrides, onduleurs industriels 3kVA à 250kVA, armoires TGBT, compensation réactive et audits d'harmoniques.
                  </p>
                  <ul className="text-[11px] text-slate-500 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#69B536]" />
                      <span>Stockage lithium LiFePO4 haute durée</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#69B536]" />
                      <span>Protection contre foudre et surtensions</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => onNavigate('/services')}
                  className="text-xs font-bold text-[#075B35] hover:text-[#063D2A] flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
                >
                  <span>Consulter les tarifs & fiches</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </StaggerItem>

          {/* Card 2: Froid Industriel & HVAC */}
          <StaggerItem>
            <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/src/assets/images/service_cooling_hvac_1792438627774.jpg"
                  alt="Froid Industriel & Climatisation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#063D2A]/90 backdrop-blur-xs text-white p-2 rounded-xl">
                  <Snowflake className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#063D2A] text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                  02 · Thermique
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#202622] group-hover:text-[#075B35] transition-colors">
                    Froid & Climatisation
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Chambres froides positives (+2°C) et négatives (-25°C), systèmes VRV/DRV tertiaires, compresseurs industriels Bitzer et fluides éco-responsables.
                  </p>
                  <ul className="text-[11px] text-slate-500 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span>Chaîne du froid agroalimentaire</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span>Contrats de maintenance préventive 24/7</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => onNavigate('/services')}
                  className="text-xs font-bold text-[#075B35] hover:text-[#063D2A] flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
                >
                  <span>Consulter les tarifs & fiches</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </StaggerItem>

          {/* Card 3: Réseaux IT & Telecom */}
          <StaggerItem>
            <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/src/assets/images/service_it_networks_1792438627961.jpg"
                  alt="Réseaux Informatiques & Systèmes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#063D2A]/90 backdrop-blur-xs text-white p-2 rounded-xl">
                  <Server className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#063D2A] text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                  03 · Réseaux
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#202622] group-hover:text-[#075B35] transition-colors">
                    Réseaux & Courants Faibles
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Câblage structuré cuivre Cat6A/Cat7 et fibre optique, baies serveurs 42U, vidéosurveillance IP IA, contrôle d'accès biométrique et interphonie.
                  </p>
                  <ul className="text-[11px] text-slate-500 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Certification Fluke Networks Cat6A</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Alimentation secourue par onduleurs Online</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => onNavigate('/services')}
                  className="text-xs font-bold text-[#075B35] hover:text-[#063D2A] flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
                >
                  <span>Consulter les tarifs & fiches</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </StaggerItem>

          {/* Card 4: BTP & Civil Works */}
          <StaggerItem>
            <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/src/assets/images/btp_engineering_gtec_1792482458646.jpg"
                  alt="BTP & Travaux Spécialisés"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#063D2A]/90 backdrop-blur-xs text-white p-2 rounded-xl">
                  <Building2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#063D2A] text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                  04 · Génie Civil
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-['Space_Grotesk'] font-bold text-lg text-[#202622] group-hover:text-[#075B35] transition-colors">
                    BTP & Travaux Spécialisés
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dalles techniques pour groupes électrogènes, structures porteuses ombrières solaires, tranchées VRD et réhabilitation industrielle.
                  </p>
                  <ul className="text-[11px] text-slate-500 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Calculs de descente de charge agréés</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Béton armé dosé à 350kg/m³ hydrofugé</span>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => onNavigate('/services')}
                  className="text-xs font-bold text-[#075B35] hover:text-[#063D2A] flex items-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
                >
                  <span>Consulter les tarifs & fiches</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 4. INTERACTIVE CAMEROON OPERATIONAL HUBS & TELEMETRY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="bg-[#042519] rounded-3xl p-6 sm:p-10 lg:p-12 text-white border border-emerald-900 shadow-2xl relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left description */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#69B536]">
                    <MapPin className="w-4 h-4" />
                    <span>Présence Opérationnelle au Cameroun</span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-white">
                    Un réseau de techniciens mobiles déployés sur 5 régions
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                    Grâce à notre géolocalisation en temps réel et nos bases techniques de Douala et Yaoundé, GTEC garantit une prise en charge rapide des pannes critiques.
                  </p>
                </div>

                {/* Region selector buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {(['douala', 'yaounde', 'kribi', 'bafoussam', 'garoua'] as const).map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        selectedRegion === reg
                          ? 'bg-[#69B536] text-slate-950 shadow-md font-bold'
                          : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                      }`}
                    >
                      {reg.charAt(0).toUpperCase() + reg.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Direct Action */}
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('/contact')}
                    className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 border border-emerald-500/30 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-[#69B536]" />
                    <span>Appeler notre permanence régionale</span>
                  </button>
                </div>
              </div>

              {/* Right Regional Telemetry Details: Mobile Optimized */}
              <div className="lg:col-span-7 bg-emerald-950/70 p-4 sm:p-8 rounded-2xl border border-emerald-800/80 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-800">
                  <div>
                    <h4 className="font-['Space_Grotesk'] font-bold text-base sm:text-lg text-white">
                      {regionData[selectedRegion].name}
                    </h4>
                    <p className="text-xs text-emerald-300 font-mono mt-0.5">
                      {regionData[selectedRegion].hub}
                    </p>
                  </div>
                  <div className="bg-emerald-800/80 px-3 py-1.5 rounded-lg border border-emerald-600/50 self-start sm:self-auto text-left sm:text-right">
                    <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Délai d'intervention</span>
                    <span className="font-mono font-bold text-sm text-[#69B536]">{regionData[selectedRegion].leadTime}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
                  <div className="bg-[#042519] p-3 sm:p-4 rounded-xl border border-emerald-900">
                    <span className="text-[10px] text-emerald-300/80 uppercase font-semibold">Installations Actives</span>
                    <div className="font-mono font-bold text-lg sm:text-xl text-white mt-1">
                      {regionData[selectedRegion].activeSites}
                    </div>
                  </div>

                  <div className="bg-[#042519] p-3 sm:p-4 rounded-xl border border-emerald-900">
                    <span className="text-[10px] text-emerald-300/80 uppercase font-semibold">Équipes Déployées</span>
                    <div className="font-mono font-bold text-lg sm:text-xl text-[#69B536] mt-1">
                      {regionData[selectedRegion].teams} équipes
                    </div>
                  </div>

                  <div className="bg-[#042519] p-3 sm:p-4 rounded-xl border border-emerald-900 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-emerald-300/80 uppercase font-semibold">Ensoleillement Moyen</span>
                    <div className="font-mono font-bold text-lg sm:text-xl text-amber-300 mt-1">
                      {regionData[selectedRegion].irradiance}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-700/40 text-xs text-emerald-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#69B536] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Contraintes d'ingénierie locales : </span>
                    <span>{regionData[selectedRegion].humidity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. GTEC 4-STEP METHODOLOGY: Scroll-triggered numbered sequence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <ScrollReveal direction="up" delay={0.1}>
            <span className="text-xs font-bold uppercase tracking-wider text-[#075B35]">
              Méthodologie & Rigueur
            </span>
            <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-[#202622]">
              Comment se déroule votre projet chez GTEC
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              De l'audit de puissance initial à la maintenance préventive continue, chaque jalon est documenté et validé.
            </p>
          </ScrollReveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggerItem>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative space-y-3 h-full flex flex-col justify-between">
              <div>
                <div className="font-['IBM_Plex_Mono'] font-extrabold text-2xl text-[#075B35]">01.</div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-900 mt-2">
                  Audit Technique & Mesures
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Visite de site par nos ingénieurs, analyse de vos courbes de charge, qualité du réseau ENEO et masques solaires.
                </p>
              </div>
              <div className="text-[11px] font-medium text-emerald-800 pt-2 border-t border-slate-100">
                Rapport d'audit sous 48h
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative space-y-3 h-full flex flex-col justify-between">
              <div>
                <div className="font-['IBM_Plex_Mono'] font-extrabold text-2xl text-[#075B35]">02.</div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-900 mt-2">
                  Dimensionnement & Devis XAF
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Schéma unifilaire, calculs de section de câbles, dimensionnement des batteries et devis détaillé sans frais cachés.
                </p>
              </div>
              <div className="text-[11px] font-medium text-emerald-800 pt-2 border-t border-slate-100">
                Chiffrage transparent en Francs CFA
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative space-y-3 h-full flex flex-col justify-between">
              <div>
                <div className="font-['IBM_Plex_Mono'] font-extrabold text-2xl text-[#075B35]">03.</div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-900 mt-2">
                  Installation & PV de Réception
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Déploiement par techniciens agréés GTEC, tests de mise en charge, étiquetage des armoires et procès-verbal officiel.
                </p>
              </div>
              <div className="text-[11px] font-medium text-emerald-800 pt-2 border-t border-slate-100">
                Garantie décennale & constructeur
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative space-y-3 h-full flex flex-col justify-between">
              <div>
                <div className="font-['IBM_Plex_Mono'] font-extrabold text-2xl text-[#075B35]">04.</div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-slate-900 mt-2">
                  Supervision & SAV 24/7
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Suivi télémétrique des onduleurs et chambres froides, interventions d'astreinte et alertes prédictives en direct.
                </p>
              </div>
              <div className="text-[11px] font-medium text-emerald-800 pt-2 border-t border-slate-100">
                Astreinte 24h/24 pour contrats PRO
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 6. VERIFIABLE CLIENT PROOFS & REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <ScrollReveal direction="up" delay={0.1}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#075B35]">
                Retours d'Expérience
              </span>
              <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-[#202622] mt-1">
                Ils font confiance à l'ingénierie GTEC
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={0.2}>
            <button
              onClick={() => onNavigate('/realisations')}
              className="text-xs font-bold text-[#075B35] hover:text-[#063D2A] flex items-center gap-1.5 cursor-pointer self-start"
            >
              <span>Voir toutes nos réalisations avec photos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </ScrollReveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StaggerItem>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1 text-xs">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "L'installation solaire de 50kVA à Kribi a réduit nos dépenses de carburant groupe de 65%. Les techniciens GTEC interviennent avec un professionnalisme rare au Cameroun."
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#075B35] font-bold flex items-center justify-center text-xs">
                  EK
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Dr. Emmanuel Kouam</div>
                  <div className="text-[11px] text-slate-500">Directeur Complexe Hôtelier & Éco-Lodge · Kribi</div>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1 text-xs">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "Nos chambres froides de 80m³ à Bassa Douala n'ont subi aucune rupture de température depuis 14 mois. Le système de télésurveillance GTEC nous alerte instantanément."
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#075B35] font-bold flex items-center justify-center text-xs">
                  MB
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Mireille Bella</div>
                  <div className="text-[11px] text-slate-500">Directrice des Opérations AgroCam · Douala Bassa</div>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1 text-xs">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "Refonte complète de notre baie serveur et câblage Cat6A à Bonanjo. Bascule onduleur immédiate et débit sans faille. Équipe technique ponctuelle et rigoureuse."
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#075B35] font-bold flex items-center justify-center text-xs">
                  AT
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Alain Tchinda</div>
                  <div className="text-[11px] text-slate-500">Associé Gérant Cabinet Juridique · Douala</div>
                </div>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 7. HIGH-CONVERSION CTA BANNER: Premium Dark Forest */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="bg-gradient-to-r from-[#063D2A] via-[#075B35] to-[#063D2A] rounded-3xl p-8 sm:p-12 text-white border border-emerald-500/40 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#69B536] animate-pulse" />
                <span>Urgence technique ou projet neuf au Cameroun</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                Prêt à sécuriser votre alimentation électrique et vos installations ?
              </h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                Nos coordinateurs techniques vous répondent en direct. Visite de site gratuite pour audits solaires et devis garanti sous 24h ouvrées.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('/demande-devis')}
                className="w-full sm:w-auto px-6 py-4 bg-[#69B536] hover:bg-[#5ea72f] text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Déposer une demande en ligne</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/contact')}
                className="w-full sm:w-auto px-5 py-4 bg-[#042519] hover:bg-[#063D2A] border border-emerald-400/40 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-[#69B536]" />
                <span>+237 6 55 54 76 49</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
