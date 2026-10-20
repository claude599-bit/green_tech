import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, ShieldCheck, MessageSquare } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/animations/ScrollAnimation';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Douala',
    subject: 'Demande de devis solaire',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-white p-2 flex items-center justify-center mx-auto shadow-md border border-emerald-200">
            <img src="/logo.png" alt="Logo GTEC" className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075B35]">
            Assistance & Coordonnées
          </span>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#202622]">
            Contacter Green Tech Energy Cameroon
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Nos coordinateurs d'intervention et ingénieurs d'études sont disponibles du lundi au samedi de 07h30 à 18h30. Permanence astreinte 24h/24 pour contrats industriels.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards with Staggered Scroll Animations */}
        <div className="lg:col-span-5 space-y-4">
          <ScrollReveal direction="right" delay={0.15}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#075B35] flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] font-bold text-sm text-slate-900">Téléphone Direct & WhatsApp</h3>
                  <a href="tel:+237655547649" className="text-base font-bold text-[#075B35] hover:underline font-mono">
                    +237 6 55 54 76 49
                  </a>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ligne directe pour les urgences techniques, planification de visites de site et vérification de la disponibilité des équipes.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/237655547649"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#075B35]" />
                  <span>Démarrer une discussion WhatsApp</span>
                </a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.25}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#075B35] flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] font-bold text-sm text-slate-900">Courriel Professionnel</h3>
                  <a href="mailto:contact@greentech-cm.com" className="text-sm font-semibold text-[#075B35] hover:underline">
                    contact@greentech-cm.com
                  </a>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Réponse garantie sous 4 heures ouvrées pour dossiers d'appels d'offres et demandes de dimensionnement complexes.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.35}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#075B35] flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] font-bold text-sm text-slate-900">Bureaux & Ateliers Techniques</h3>
                  <span className="text-xs font-semibold text-slate-700">Douala & Yaoundé, Cameroun</span>
                </div>
              </div>
              <div className="text-xs text-slate-600 space-y-1.5 pt-1 border-t border-slate-100">
                <p>• <strong>Douala :</strong> Boulevard de la Liberté, Akwa & Base Logistique Bassa</p>
                <p>• <strong>Yaoundé :</strong> Quartier Bastos (proximité ambassades) & Atelier Nsam</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Form with Scroll Animation */}
        <div className="lg:col-span-7">
          <ScrollReveal direction="left" delay={0.2}>
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-lg">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#075B35] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-[#69B536]" />
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900">
                    Message transmis avec succès
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Votre demande a été attribuée à notre pôle technique de <strong>{formData.city}</strong>. Un ingénieur GTEC prendra contact avec vous sous 4 heures ouvrées.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        city: 'Douala',
                        subject: 'Demande de devis solaire',
                        message: '',
                      });
                    }}
                    className="px-5 py-2.5 bg-[#075B35] text-white rounded-xl text-xs font-semibold hover:bg-[#063D2A] transition-colors cursor-pointer"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-['Space_Grotesk'] font-bold text-xl text-slate-900">
                      Formulaire de contact direct
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Remplissez vos coordonnées pour être rappelé par un technicien ou un chargé de clientèle.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Nom complet ou Entreprise *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Dr. Kouam / Entreprise ABC"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#075B35] focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Courriel professionnel *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nom@domaine.cm"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#075B35] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Téléphone (WhatsApp)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+237 6..."
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#075B35] focus:border-transparent font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Ville du site d'intervention</label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#075B35] bg-white cursor-pointer"
                      >
                        <option value="Douala">Douala (Littoral)</option>
                        <option value="Yaoundé">Yaoundé (Centre)</option>
                        <option value="Kribi">Kribi (Sud)</option>
                        <option value="Bafoussam">Bafoussam (Ouest)</option>
                        <option value="Garoua">Garoua / Maroua (Grand Nord)</option>
                        <option value="Autre">Autre localité au Cameroun</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Type de besoin technique</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#075B35] bg-white cursor-pointer"
                    >
                      <option value="Demande de devis solaire">Centrale Solaire & Onduleurs Hybrides</option>
                      <option value="Froid industriel / Climatisation">Chambre Froide ou Climatisation Industrielle</option>
                      <option value="Réseaux & Courants Faibles">Câblage Baie Serveur & Réseau Informatique</option>
                      <option value="BTP & Dalle technique">Génie Civil & Dalles pour Groupes Électrogènes</option>
                      <option value="Dépannage d'urgence 24h">Urgence panne électrique ou rupture froid</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Détails de votre demande *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Décrivez vos équipements actuels, les problèmes rencontrés ou la puissance souhaitée..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#075B35] focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-[#075B35]" />
                      <span>Réponse sous 4h ouvrées</span>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#075B35] hover:bg-[#063D2A] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <span>Transmettre mon message</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};
