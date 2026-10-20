/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoSwitcherBar } from './components/DemoSwitcherBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GeminiAssistantModal } from './components/GeminiAssistantModal';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';

import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { RealisationsView } from './views/RealisationsView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';

import { ClientDashboard } from './views/client/ClientDashboard';
import { TechnicianDashboard } from './views/technician/TechnicianDashboard';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { ShieldAlert } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('/');
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Sync with browser URL / history for natural navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentView(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (view: string) => {
    setCurrentView(view);
    window.history.pushState({}, '', view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAssistant = () => setAssistantOpen(true);
  const handleCloseAssistant = () => setAssistantOpen(false);

  // Route protection guard
  const renderCurrentView = () => {
    if (loading) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#075B35]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#69B536] animate-ping" />
            <span>Chargement sécurisé de la plateforme GTEC...</span>
          </div>
        </div>
      );
    }

    // Public Views
    if (currentView === '/') {
      return <HomeView onNavigate={navigate} onOpenAssistant={handleOpenAssistant} />;
    }
    if (currentView === '/services') {
      return <ServicesView onNavigate={navigate} />;
    }
    if (currentView === '/realisations') {
      return <RealisationsView onNavigate={navigate} />;
    }
    if (currentView === '/a-propos') {
      return <AboutView />;
    }
    if (currentView === '/contact') {
      return <ContactView />;
    }
    if (currentView === '/connexion') {
      return <LoginView onNavigate={navigate} />;
    }
    if (currentView === '/inscription') {
      return <RegisterView onNavigate={navigate} />;
    }
    if (currentView === '/demande-devis') {
      if (!user) {
        return (
          <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
              Déposer une Demande de Service
            </h2>
            <p className="text-xs text-slate-600">
              Pour assurer le suivi personnalisé et la traçabilité de votre dossier, veuillez vous connecter ou créer un compte client.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/connexion')}
                className="px-4 py-2 border border-[#075B35] text-[#075B35] rounded-lg text-xs font-semibold hover:bg-emerald-50"
              >
                Se connecter
              </button>
              <button
                onClick={() => navigate('/inscription')}
                className="px-4 py-2 bg-[#075B35] text-white rounded-lg text-xs font-semibold hover:bg-[#063D2A]"
              >
                Créer un compte
              </button>
            </div>
          </div>
        );
      }
      return <ClientDashboard onOpenAssistant={handleOpenAssistant} />;
    }

    // Protected Role Views
    if (currentView.startsWith('/client')) {
      if (!user) return <LoginView onNavigate={navigate} />;
      if (user.role !== 'client' && user.role !== 'admin') {
        return (
          <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
            <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
              Accès Réservé aux Clients
            </h2>
            <p className="text-xs text-slate-600">
              Vous êtes actuellement connecté en tant que <strong>{user.role}</strong>. Veuillez basculer vers un profil client pour accéder à cet espace.
            </p>
          </div>
        );
      }
      return <ClientDashboard onOpenAssistant={handleOpenAssistant} />;
    }

    if (currentView.startsWith('/technicien')) {
      if (!user) return <LoginView onNavigate={navigate} />;
      if (user.role !== 'technicien' && user.role !== 'admin') {
        return (
          <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
            <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
              Accès Réservé aux Techniciens
            </h2>
            <p className="text-xs text-slate-600">
              Cet espace est strictement réservé aux techniciens de terrain habilités par GTEC.
            </p>
          </div>
        );
      }
      return <TechnicianDashboard onOpenAssistant={handleOpenAssistant} />;
    }

    if (currentView.startsWith('/admin')) {
      if (!user) return <LoginView onNavigate={navigate} />;
      if (user.role !== 'admin') {
        return (
          <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
            <ShieldAlert className="w-10 h-10 text-red-600 mx-auto" />
            <h2 className="font-['Space_Grotesk'] text-xl font-bold text-slate-900">
              Accès Refusé : Administration GTEC
            </h2>
            <p className="text-xs text-slate-600">
              Seuls les administrateurs et superviseurs de Green Tech Energy Cameroon ont l'autorisation d'accéder à la tour de contrôle.
            </p>
          </div>
        );
      }
      return <AdminDashboard onOpenAssistant={handleOpenAssistant} />;
    }

    // Legal & Privacy Pages
    if (currentView === '/confidentialite' || currentView === '/mentions-legales') {
      return (
        <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-xs text-slate-700 leading-relaxed">
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-slate-900">
            {currentView === '/confidentialite' ? 'Politique de Confidentialité' : 'Mentions Légales & Réglementation'}
          </h1>
          <p>
            <strong>Éditeur :</strong> Green Tech Energy Cameroon (GTEC) SARL. Siège social : Douala / Yaoundé, Cameroun. Téléphone officiel : +237 6 55 54 76 49. Courriel : contact@greentech-cm.com.
          </p>
          <p>
            <strong>Protection des données :</strong> Les données collectées (nom, téléphone, adresse d’intervention, schémas techniques) sont strictement réservées à l’exécution des contrats de service GTEC et ne font l’objet d’aucune cession à des tiers.
          </p>
          <p>
            <strong>Engagements environnementaux :</strong> Conformément aux orientations écologiques de GTEC, tous les déchets de chantiers (panneaux hors d’usage, batteries usagées, fluides frigorigènes) font l’objet d’un traitement en filière spécialisée et agréée au Cameroun.
          </p>
        </div>
      );
    }

    return <HomeView onNavigate={navigate} onOpenAssistant={handleOpenAssistant} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F1] text-[#202622]">
      {/* Test & Demo Switcher Bar */}
      <DemoSwitcherBar onNavigate={navigate} />

      {/* Main Top Navigation */}
      <Navbar currentView={currentView} onNavigate={navigate} onOpenAssistant={handleOpenAssistant} />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Copilote IA Modal */}
      <GeminiAssistantModal isOpen={assistantOpen} onClose={handleCloseAssistant} />

      {/* PWA In-App Install Prompt Banner (Android, iOS, PC) */}
      <PWAInstallBanner />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
