export type UserRole = 'client' | 'technicien' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone: string;
  clientType?: 'particulier' | 'entreprise';
  companyName?: string;
  city?: string;
  status: 'actif' | 'en_attente_validation' | 'suspendu' | 'rejete';
  skills?: string[];
  experienceYears?: number;
  zones?: string[];
  availability?: 'disponible' | 'en_intervention' | 'indisponible';
  rating?: number;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  skillsRequired: string[];
}

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  comment?: string;
}

export interface ServiceRequest {
  id: string;
  reference: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientType: 'particulier' | 'entreprise';
  companyName?: string;
  categoryId: string;
  categoryTitle: string;
  title: string;
  description: string;
  serviceType: 'depannage' | 'installation' | 'maintenance' | 'audit_etude';
  urgency: 'critique' | 'haute' | 'normale' | 'planifiee';
  city: string;
  district: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  preferredDate?: string;
  preferredContact: 'telephone' | 'whatsapp' | 'email';
  status:
    | 'nouvelle'
    | 'a_qualifier'
    | 'qualifiee'
    | 'technicien_attribue'
    | 'mission_acceptee'
    | 'planifiee'
    | 'en_cours'
    | 'rapport_soumis'
    | 'validee_gtec'
    | 'terminee'
    | 'refusee'
    | 'annulee';
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  assignedTechnicianPhone?: string;
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  declineReason?: string;
  internalAdminNotes?: string;
  history: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  requestId: string;
  requestReference: string;
  clientId: string;
  title: string;
  items: QuoteItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  validUntil: string;
  status: 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire';
  createdAt: string;
  acceptedAt?: string;
}

export interface InterventionReport {
  id: string;
  requestId: string;
  requestReference: string;
  technicianId: string;
  technicianName: string;
  dateCompleted: string;
  workDescription: string;
  partsReplaced: string;
  hoursSpent: number;
  recommendations: string;
  safetyComplianceChecked: boolean;
  validatedByAdmin: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
}
