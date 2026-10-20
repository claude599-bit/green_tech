// Simulation de WebSocket temps réel pour la plateforme GTEC Cameroun
// Simule une connexion bi-directionnelle WSS (wss://realtime.gtec.cm/ws/v1)
// pour les notifications clients et le suivi télémétrique GPS des techniciens.

export type WebSocketStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

export interface RealtimeEventPayload {
  type:
    | 'technician_en_route'
    | 'technician_arrived'
    | 'intervention_in_progress'
    | 'intervention_completed'
    | 'quote_ready'
    | 'technician_location'
    | 'system_alert';
  requestId?: string;
  requestReference?: string;
  clientId?: string;
  clientName?: string;
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  city?: string;
  locationName?: string;
  statusLabel?: string;
  etaMinutes?: number;
  distanceKm?: number;
  speedKmH?: number;
  lat?: number;
  lng?: number;
  title: string;
  message: string;
  timestamp: string;
  severity?: 'info' | 'success' | 'warning' | 'alert';
}

export type WebSocketEventListener = (payload: RealtimeEventPayload) => void;
export type WebSocketStatusListener = (status: WebSocketStatus, latencyMs: number) => void;

class MockWebSocketService {
  private status: WebSocketStatus = 'connected';
  private latencyMs: number = 24;
  private listeners: Set<WebSocketEventListener> = new Set();
  private statusListeners: Set<WebSocketStatusListener> = new Set();
  private audioEnabled: boolean = true;
  private soundCtx: AudioContext | null = null;
  private heartbeatTimer: any = null;

  constructor() {
    this.startHeartbeat();
  }

  // Initialisation du contexte Web Audio pour carillon doux
  private playNotificationChime() {
    if (!this.audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.soundCtx) {
        this.soundCtx = new AudioCtx();
      }
      if (this.soundCtx.state === 'suspended') {
        this.soundCtx.resume();
      }

      const now = this.soundCtx.currentTime;
      const osc = this.soundCtx.createOscillator();
      const gain = this.soundCtx.createGain();

      osc.type = 'sine';
      // Arpège subtil moderne (Do5 -> Sol5)
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.soundCtx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio autoplay policy peut bloquer si aucune interaction utilisateur préalable
    }
  }

  public setAudioEnabled(enabled: boolean) {
    this.audioEnabled = enabled;
  }

  public isAudioEnabled(): boolean {
    return this.audioEnabled;
  }

  private startHeartbeat() {
    if (typeof window === 'undefined') return;
    this.heartbeatTimer = setInterval(() => {
      // Fluctuation naturelle de latence réseau (18ms - 38ms)
      this.latencyMs = Math.floor(18 + Math.random() * 20);
      this.notifyStatusListeners();
    }, 8000);
  }

  public getStatus(): { status: WebSocketStatus; latencyMs: number } {
    return { status: this.status, latencyMs: this.latencyMs };
  }

  public subscribe(listener: WebSocketEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeStatus(listener: WebSocketStatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status, this.latencyMs);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private notifyStatusListeners() {
    this.statusListeners.forEach((l) => l(this.status, this.latencyMs));
  }

  // Émission d'un événement vers tous les abonnés (Navbar, Dashboards, Map)
  public emit(payload: RealtimeEventPayload) {
    // Si c'est un événement client (hors simple mise à jour GPS haute fréquence), jouer le son
    if (payload.type !== 'technician_location') {
      this.playNotificationChime();

      // Sauvegarde dans le stockage local pour persistance
      try {
        const storedKey = 'gtec_live_notifications';
        const existing = JSON.parse(localStorage.getItem(storedKey) || '[]');
        const updated = [
          {
            id: `ws-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            ...payload,
            read: false,
          },
          ...existing,
        ].slice(0, 30);
        localStorage.setItem(storedKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (err) {
        console.error('Erreur listener WebSocket', err);
      }
    });
  }

  // ================= SCÉNARIOS DE SIMULATION POUR TEST ================= //

  /**
   * Simule : "Technicien en route vers le site client"
   */
  public simulateTechnicianEnRoute(options?: {
    requestId?: string;
    reference?: string;
    technicianName?: string;
    technicianPhone?: string;
    clientName?: string;
    city?: string;
    etaMinutes?: number;
  }) {
    const ref = options?.reference || 'GTEC-2026-004';
    const tech = options?.technicianName || 'Ibrahim Ndop';
    const phone = options?.technicianPhone || '+237 671 23 45 67';
    const eta = options?.etaMinutes || 14;
    const city = options?.city || 'Yaoundé Bastos';

    this.emit({
      type: 'technician_en_route',
      requestId: options?.requestId || 'req-4',
      requestReference: ref,
      technicianName: tech,
      technicianPhone: phone,
      clientName: options?.clientName || 'Dr. Paul Biya Jr',
      city,
      locationName: city,
      statusLabel: 'Technicien en route',
      etaMinutes: eta,
      distanceKm: 3.8,
      speedKmH: 42,
      severity: 'info',
      title: `🚗 Technicien en route vers votre site (${ref})`,
      message: `${tech} a pris en charge votre mission et se déplace vers ${city}. Arrivée estimée dans ~${eta} minutes.`,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Simule : "Technicien arrivé sur site d'intervention"
   */
  public simulateTechnicianArrived(options?: {
    requestId?: string;
    reference?: string;
    technicianName?: string;
    locationName?: string;
  }) {
    const ref = options?.reference || 'GTEC-2026-004';
    const tech = options?.technicianName || 'Ibrahim Ndop';
    const loc = options?.locationName || 'Bastos Résidentiel, Yaoundé';

    this.emit({
      type: 'technician_arrived',
      requestId: options?.requestId || 'req-4',
      requestReference: ref,
      technicianName: tech,
      locationName: loc,
      statusLabel: 'Arrivé sur site',
      severity: 'info',
      title: `📍 Technicien arrivé sur place (${ref})`,
      message: `${tech} est bien arrivé à destination (${loc}) et commence l'inspection technique des équipements.`,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Simule : "Intervention terminée avec succès"
   */
  public simulateInterventionCompleted(options?: {
    requestId?: string;
    reference?: string;
    technicianName?: string;
    serviceName?: string;
  }) {
    const ref = options?.reference || 'GTEC-2026-002';
    const tech = options?.technicianName || "Samuel Eto'o Mbarga";
    const service = options?.serviceName || 'Installation photovoltaïque 15 kVA';

    this.emit({
      type: 'intervention_completed',
      requestId: options?.requestId || 'req-2',
      requestReference: ref,
      technicianName: tech,
      statusLabel: 'Intervention terminée',
      severity: 'success',
      title: `✅ Intervention technique terminée (${ref})`,
      message: `La maintenance pour "${service}" a été réalisée avec succès par ${tech}. Le compte-rendu technique est disponible.`,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Simule : "Nouveau devis chiffré disponible"
   */
  public simulateQuoteReady(options?: {
    reference?: string;
    amountFcfa?: number;
  }) {
    const ref = options?.reference || 'GTEC-2026-001';
    const amount = options?.amountFcfa || 185000;

    this.emit({
      type: 'quote_ready',
      requestReference: ref,
      statusLabel: 'Devis disponible',
      severity: 'info',
      title: `📄 Nouveau devis chiffré GTEC (${ref})`,
      message: `Votre devis d'un montant de ${amount.toLocaleString('fr-FR')} FCFA TTC est prêt pour examen et validation en ligne.`,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Lance un scénario complet automatisé en accéléré pour démonstration live
   */
  public runFullLiveScenario(onStep?: (stepName: string) => void) {
    if (onStep) onStep('Départ du technicien...');
    this.simulateTechnicianEnRoute();

    setTimeout(() => {
      if (onStep) onStep('Arrivée sur site...');
      this.simulateTechnicianArrived();
    }, 4000);

    setTimeout(() => {
      if (onStep) onStep('Diagnostic & travaux...');
      this.emit({
        type: 'intervention_in_progress',
        requestReference: 'GTEC-2026-004',
        technicianName: 'Ibrahim Ndop',
        statusLabel: 'Travaux en cours',
        severity: 'info',
        title: '⚡ Travaux en cours sur vos installations',
        message: "L'équilibrage des phases et le remplacement des disjoncteurs différentiels sont en cours.",
        timestamp: new Date().toISOString(),
      });
    }, 8000);

    setTimeout(() => {
      if (onStep) onStep('Intervention clôturée !');
      this.simulateInterventionCompleted();
    }, 12000);
  }
}

export const mockWebSocket = new MockWebSocketService();
