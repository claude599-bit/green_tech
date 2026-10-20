import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Database, User, ServiceRequest, Quote, InterventionReport, Notification, AuditLog, resolveGpsCoordinates } from './server/db.js';
import { generateGtecResponse } from './server/gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// In-memory session store (token -> userId)
const sessions = new Map<string, string>();

// Seed default sessions for ease of testing
sessions.set('token-admin', 'usr-admin-1');
sessions.set('token-client-1', 'usr-client-1');
sessions.set('token-client-2', 'usr-client-2');
sessions.set('token-tech-1', 'usr-tech-1');
sessions.set('token-tech-2', 'usr-tech-2');
sessions.set('token-tech-3', 'usr-tech-3');
sessions.set('token-tech-pending', 'usr-tech-pending');

// Helper to authenticate user from token or header
function getAuthenticatedUser(req: Request): User | null {
  const token =
    req.cookies?.gtec_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null) ||
    (req.headers['x-gtec-token'] as string);

  if (token && sessions.has(token)) {
    const userId = sessions.get(token)!;
    const db = Database.get();
    return db.users.find((u) => u.id === userId) || null;
  }

  // Fallback support for direct user header during development test switcher
  const directUserId = req.headers['x-user-id'] as string;
  if (directUserId) {
    const db = Database.get();
    return db.users.find((u) => u.id === directUserId) || null;
  }

  return null;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Non authentifié. Veuillez vous connecter.' });
  }
  (req as any).user = user;
  next();
}

function requireRole(allowedRoles: ('client' | 'technicien' | 'admin')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as User;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Accès refusé pour ce profil.' });
    }
    next();
  };
}

function logAudit(userId: string, userName: string, userRole: string, action: string, details: string) {
  const db = Database.get();
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    userRole,
    action,
    details,
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 200) db.auditLogs.pop();
  Database.save();
}

function sendNotification(userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert', link?: string) {
  const db = Database.get();
  const notif: Notification = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    title,
    message,
    type,
    link,
    read: false,
    createdAt: new Date().toISOString(),
  };
  db.notifications.unshift(notif);
  Database.save();
}

// ----------------- AUTH ROUTES ----------------- //

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.json({ authenticated: false, user: null });
  }
  const { passwordHash, ...safeUser } = user;
  return res.json({ authenticated: true, user: safeUser });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Veuillez saisir votre email et mot de passe.' });
  }

  const db = Database.get();
  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Identifiants invalides. Veuillez vérifier vos accès.' });
  }

  const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  sessions.set(token, user.id);

  res.cookie('gtec_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  logAudit(user.id, user.name, user.role, 'LOGIN', `Connexion réussie de ${user.name}`);

  const { passwordHash, ...safeUser } = user;
  return res.json({ success: true, token, user: safeUser });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { role, name, email, phone, password, clientType, companyName, city, skills, experienceYears, zones } = req.body;

  if (!name || !email || !password || !phone || !role) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires.' });
  }

  const db = Database.get();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Cette adresse e-mail est déjà associée à un compte.' });
  }

  const newId = `usr-${role}-${Date.now()}`;
  const initialStatus = role === 'technicien' ? 'en_attente_validation' : 'actif';

  const newUser: User = {
    id: newId,
    email: email.trim().toLowerCase(),
    passwordHash: password,
    role,
    name: name.trim(),
    phone: phone.trim(),
    city: city || 'Douala',
    clientType: role === 'client' ? clientType || 'particulier' : undefined,
    companyName: companyName ? companyName.trim() : undefined,
    status: initialStatus,
    skills: role === 'technicien' ? skills || [] : undefined,
    experienceYears: role === 'technicien' ? Number(experienceYears) || 1 : undefined,
    zones: role === 'technicien' ? zones || ['Douala'] : undefined,
    availability: role === 'technicien' ? 'disponible' : undefined,
    rating: role === 'technicien' ? 5.0 : undefined,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  Database.save();

  const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  sessions.set(token, newUser.id);

  res.cookie('gtec_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  logAudit(newUser.id, newUser.name, newUser.role, 'REGISTER', `Création de compte ${role} : ${newUser.name}`);

  if (role === 'technicien') {
    // Notify admin of new technician registration requiring validation
    const admins = db.users.filter((u) => u.role === 'admin');
    admins.forEach((adm) => {
      sendNotification(
        adm.id,
        'Nouveau technicien en attente de validation',
        `Le technicien ${newUser.name} s'est inscrit avec les compétences : ${(newUser.skills || []).join(', ')}.`,
        'warning',
        '/admin'
      );
    });
  }

  const { passwordHash, ...safeUser } = newUser;
  return res.json({ success: true, token, user: safeUser });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = req.cookies?.gtec_token || req.headers.authorization?.slice(7);
  if (token) sessions.delete(token);
  res.clearCookie('gtec_token');
  return res.json({ success: true });
});

// Demo account switcher endpoint for verification
app.get('/api/auth/demo-users', (_req: Request, res: Response) => {
  const db = Database.get();
  const demoUsers = db.users.map(({ passwordHash, ...u }) => u);
  return res.json({ demoUsers });
});

app.post('/api/auth/switch-demo', (req: Request, res: Response) => {
  const { userId } = req.body;
  const db = Database.get();
  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'Profil de démonstration introuvable.' });
  }

  const token = `token-demo-${user.id}`;
  sessions.set(token, user.id);

  res.cookie('gtec_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  logAudit(user.id, user.name, user.role, 'DEMO_SWITCH', `Bascule vers le profil de test : ${user.name}`);

  const { passwordHash, ...safeUser } = user;
  return res.json({ success: true, token, user: safeUser });
});

// ----------------- SERVICE CATEGORIES ----------------- //

app.get('/api/services', (_req: Request, res: Response) => {
  const db = Database.get();
  return res.json({ services: db.serviceCategories });
});

// ----------------- SERVICE REQUESTS ROUTES ----------------- //

app.get('/api/requests', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const db = Database.get();

  let requests: ServiceRequest[] = [];

  if (user.role === 'admin') {
    requests = db.serviceRequests;
  } else if (user.role === 'client') {
    requests = db.serviceRequests.filter((r) => r.clientId === user.id);
  } else if (user.role === 'technicien') {
    requests = db.serviceRequests.filter((r) => r.assignedTechnicianId === user.id);
  }

  // Sort descending by creation date
  requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return res.json({ requests });
});

app.get('/api/requests/:id', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const db = Database.get();
  const request = db.serviceRequests.find((r) => r.id === req.params.id || r.reference === req.params.id);

  if (!request) {
    return res.status(404).json({ error: 'Demande introuvable.' });
  }

  // Security check: client can only see their own, tech only their assigned
  if (user.role === 'client' && request.clientId !== user.id) {
    return res.status(403).json({ error: 'Accès interdit à ce dossier.' });
  }
  if (user.role === 'technicien' && request.assignedTechnicianId !== user.id) {
    return res.status(403).json({ error: 'Accès interdit à cette mission.' });
  }

  return res.json({ request });
});

app.post('/api/requests', requireAuth, requireRole(['client', 'admin']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const db = Database.get();

  const {
    categoryId,
    title,
    description,
    serviceType,
    urgency,
    city,
    district,
    preferredDate,
    preferredContact,
  } = req.body;

  if (!categoryId || !title || !description || !city) {
    return res.status(400).json({ error: 'Veuillez compléter toutes les informations requises.' });
  }

  const category = db.serviceCategories.find((c) => c.id === categoryId || c.slug === categoryId);
  const categoryTitle = category ? category.title : 'Service Technique GTEC';

  const refNumber = Math.floor(100 + Math.random() * 900);
  const prefix = categoryId.includes('solar') ? 'E' : categoryId.includes('hvac') ? 'F' : categoryId.includes('it') ? 'I' : 'C';
  const reference = `GTEC-2026-${prefix}${refNumber}`;

  const now = new Date().toISOString();

  const newRequest: ServiceRequest = {
    id: `req-${Date.now()}`,
    reference,
    clientId: user.id,
    clientName: user.name,
    clientPhone: user.phone,
    clientEmail: user.email,
    clientType: user.clientType || 'particulier',
    companyName: user.companyName,
    categoryId: category ? category.id : categoryId,
    categoryTitle,
    title: title.trim(),
    description: description.trim(),
    serviceType: serviceType || 'depannage',
    urgency: urgency || 'normale',
    city: city.trim(),
    district: (district || '').trim(),
    coordinates: resolveGpsCoordinates(city, district),
    preferredDate,
    preferredContact: preferredContact || 'telephone',
    status: 'nouvelle',
    history: [
      {
        status: 'nouvelle',
        timestamp: now,
        authorId: user.id,
        authorName: user.name,
        authorRole: user.role,
        comment: 'Demande enregistrée dans la plateforme GTEC',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  db.serviceRequests.unshift(newRequest);
  Database.save();

  logAudit(user.id, user.name, user.role, 'CREATE_REQUEST', `Nouvelle demande de service ${reference} : ${title}`);

  // Notify admins
  const admins = db.users.filter((u) => u.role === 'admin');
  admins.forEach((adm) => {
    sendNotification(
      adm.id,
      `Nouvelle demande reçue (${reference})`,
      `${user.name} a déposé une demande pour "${title}" à ${city}.`,
      urgency === 'critique' ? 'alert' : 'info',
      '/admin'
    );
  });

  return res.status(201).json({ success: true, request: newRequest });
});

// Admin qualifies or changes status
app.patch('/api/requests/:id/status', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const db = Database.get();
  const request = db.serviceRequests.find((r) => r.id === req.params.id);

  if (!request) {
    return res.status(404).json({ error: 'Demande introuvable.' });
  }

  const { status, comment } = req.body;

  // Verify permissions
  if (user.role === 'client' && status !== 'annulee') {
    return res.status(403).json({ error: 'Un client ne peut que solliciter une annulation.' });
  }

  const now = new Date().toISOString();
  request.status = status;
  request.updatedAt = now;
  request.history.push({
    status,
    timestamp: now,
    authorId: user.id,
    authorName: user.name,
    authorRole: user.role,
    comment: comment || `Mise à jour du statut vers ${status}`,
  });

  Database.save();
  logAudit(user.id, user.name, user.role, 'UPDATE_STATUS', `Demande ${request.reference} changée vers ${status}`);

  // Notify client
  sendNotification(
    request.clientId,
    `Mise à jour dossier ${request.reference}`,
    `Le statut de votre demande est désormais : ${status}.`,
    'info',
    '/client'
  );

  return res.json({ success: true, request });
});

// Admin assigns technician to a request
app.post('/api/requests/:id/assign', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const db = Database.get();
  const request = db.serviceRequests.find((r) => r.id === req.params.id);

  if (!request) {
    return res.status(404).json({ error: 'Demande introuvable.' });
  }

  const { technicianId, scheduledDate, scheduledTimeSlot, adminNotes } = req.body;
  const technician = db.users.find((u) => u.id === technicianId && u.role === 'technicien');

  if (!technician) {
    return res.status(400).json({ error: 'Technicien introuvable.' });
  }

  if (technician.status !== 'actif') {
    return res.status(400).json({
      error: 'Ce technicien n’est pas validé par GTEC. Impossible de lui attribuer une mission.',
    });
  }

  const now = new Date().toISOString();
  request.assignedTechnicianId = technician.id;
  request.assignedTechnicianName = technician.name;
  request.assignedTechnicianPhone = technician.phone;
  request.scheduledDate = scheduledDate || request.scheduledDate;
  request.scheduledTimeSlot = scheduledTimeSlot || 'Matinée';
  request.internalAdminNotes = adminNotes || request.internalAdminNotes;
  request.status = 'technicien_attribue';
  request.updatedAt = now;

  request.history.push({
    status: 'technicien_attribue',
    timestamp: now,
    authorId: user.id,
    authorName: user.name,
    authorRole: 'admin',
    comment: `Mission assignée au technicien ${technician.name}`,
  });

  Database.save();

  logAudit(user.id, user.name, 'admin', 'ASSIGN_TECHNICIAN', `Attribution de ${request.reference} à ${technician.name}`);

  // Notify technician
  sendNotification(
    technician.id,
    `Nouvelle mission attribuée (${request.reference})`,
    `GTEC vous a assigné l'intervention "${request.title}" à ${request.city} (${request.district}). Veuillez confirmer votre acceptation.`,
    'warning',
    '/technicien'
  );

  return res.json({ success: true, request });
});

// Technician responds to assignment (accept or decline with reason)
app.post('/api/requests/:id/technician-response', requireAuth, requireRole(['technicien']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const db = Database.get();
  const request = db.serviceRequests.find((r) => r.id === req.params.id);

  if (!request || request.assignedTechnicianId !== user.id) {
    return res.status(403).json({ error: 'Vous n’êtes pas assigné à cette mission.' });
  }

  const { accepted, reason } = req.body;
  const now = new Date().toISOString();

  if (accepted) {
    request.status = 'mission_acceptee';
    request.history.push({
      status: 'mission_acceptee',
      timestamp: now,
      authorId: user.id,
      authorName: user.name,
      authorRole: 'technicien',
      comment: 'Mission confirmée et acceptée par le technicien',
    });

    sendNotification(
      request.clientId,
      `Intervention confirmée (${request.reference})`,
      `Le technicien GTEC ${user.name} a confirmé votre mission. Créneau prévu : ${request.scheduledDate || 'Sous 24h'}.`,
      'success',
      '/client'
    );
  } else {
    // Declined - alert admin for reattribution!
    request.status = 'a_qualifier';
    request.declineReason = reason || 'Indisponibilité imprévue';
    const oldTechName = request.assignedTechnicianName;
    request.assignedTechnicianId = undefined;
    request.assignedTechnicianName = undefined;
    request.assignedTechnicianPhone = undefined;

    request.history.push({
      status: 'a_qualifier',
      timestamp: now,
      authorId: user.id,
      authorName: user.name,
      authorRole: 'technicien',
      comment: `Mission déclinée par ${oldTechName}. Motif : ${reason || 'Non précisé'}. Réattribution requise.`,
    });

    // Notify admins of decline
    const admins = db.users.filter((u) => u.role === 'admin');
    admins.forEach((adm) => {
      sendNotification(
        adm.id,
        `Alerte Réattribution (${request.reference})`,
        `Le technicien ${user.name} a décliné la mission. Motif : "${reason || 'Indisponible'}". Veuillez réattribuer un autre technicien.`,
        'alert',
        '/admin'
      );
    });
  }

  request.updatedAt = now;
  Database.save();

  logAudit(
    user.id,
    user.name,
    'technicien',
    accepted ? 'ACCEPT_MISSION' : 'DECLINE_MISSION',
    `${user.name} a ${accepted ? 'accepté' : 'décliné'} la mission ${request.reference}`
  );

  return res.json({ success: true, request });
});

// Technician submits intervention report
app.post('/api/requests/:id/report', requireAuth, requireRole(['technicien']), (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const db = Database.get();
  const request = db.serviceRequests.find((r) => r.id === req.params.id);

  if (!request || request.assignedTechnicianId !== user.id) {
    return res.status(403).json({ error: 'Non autorisé à clôturer ce dossier.' });
  }

  const { workDescription, partsReplaced, hoursSpent, recommendations, safetyComplianceChecked } = req.body;

  if (!workDescription) {
    return res.status(400).json({ error: 'Veuillez détailler les travaux exécutés.' });
  }

  const now = new Date().toISOString();
  const report: InterventionReport = {
    id: `rep-${Date.now()}`,
    requestId: request.id,
    requestReference: request.reference,
    technicianId: user.id,
    technicianName: user.name,
    dateCompleted: new Date().toISOString().split('T')[0],
    workDescription: workDescription.trim(),
    partsReplaced: (partsReplaced || 'Aucune pièce remplacée').trim(),
    hoursSpent: Number(hoursSpent) || 2,
    recommendations: (recommendations || 'Entretien périodique recommandé').trim(),
    safetyComplianceChecked: Boolean(safetyComplianceChecked),
    validatedByAdmin: false,
    createdAt: now,
  };

  db.interventionReports.push(report);

  request.status = 'terminee';
  request.updatedAt = now;
  request.history.push({
    status: 'terminee',
    timestamp: now,
    authorId: user.id,
    authorName: user.name,
    authorRole: 'technicien',
    comment: `Intervention achevée et rapport de fin de travaux enregistré par ${user.name}`,
  });

  Database.save();

  logAudit(user.id, user.name, 'technicien', 'SUBMIT_REPORT', `Rapport soumis pour ${request.reference}`);

  // Notify client and admin
  sendNotification(
    request.clientId,
    `Intervention terminée (${request.reference})`,
    `Le technicien GTEC a terminé les travaux sur votre site. Le compte rendu est disponible dans votre espace client.`,
    'success',
    '/client'
  );

  const admins = db.users.filter((u) => u.role === 'admin');
  admins.forEach((adm) => {
    sendNotification(
      adm.id,
      `Rapport soumis (${request.reference})`,
      `${user.name} a finalisé l'intervention pour ${request.clientName}.`,
      'info',
      '/admin'
    );
  });

  return res.json({ success: true, report, request });
});

// ----------------- TECHNICIANS MANAGEMENT (ADMIN) ----------------- //

app.get('/api/technicians', requireAuth, (req: Request, res: Response) => {
  const db = Database.get();
  const technicians = db.users
    .filter((u) => u.role === 'technicien')
    .map(({ passwordHash, ...safe }) => {
      // Calculate real active missions count
      const activeMissions = db.serviceRequests.filter(
        (r) => r.assignedTechnicianId === safe.id && ['technicien_attribue', 'mission_acceptee', 'planifiee', 'en_cours'].includes(r.status)
      ).length;
      return { ...safe, activeMissions };
    });

  return res.json({ technicians });
});

app.patch('/api/technicians/:id/status', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const admin = (req as any).user as User;
  const db = Database.get();
  const tech = db.users.find((u) => u.id === req.params.id && u.role === 'technicien');

  if (!tech) {
    return res.status(404).json({ error: 'Technicien introuvable.' });
  }

  const { status } = req.body;
  if (!['actif', 'en_attente_validation', 'suspendu', 'rejete'].includes(status)) {
    return res.status(400).json({ error: 'Statut invalide.' });
  }

  tech.status = status;
  Database.save();

  logAudit(admin.id, admin.name, 'admin', 'VALIDATE_TECHNICIAN', `Statut du technicien ${tech.name} mis à jour : ${status}`);

  sendNotification(
    tech.id,
    'Mise à jour de votre statut professionnel GTEC',
    status === 'actif'
      ? 'Félicitations ! Votre profil technicien a été vérifié et validé par GTEC. Vous êtes maintenant éligible pour recevoir des missions.'
      : `Votre profil technicien a été mis à jour avec le statut : ${status}.`,
    status === 'actif' ? 'success' : 'warning',
    '/technicien'
  );

  return res.json({ success: true, technician: tech });
});

// ----------------- QUOTES ROUTES ----------------- //

app.get('/api/quotes', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const db = Database.get();

  let quotes: Quote[] = [];
  if (user.role === 'admin') {
    quotes = db.quotes;
  } else if (user.role === 'client') {
    quotes = db.quotes.filter((q) => q.clientId === user.id);
  } else {
    // Technicians only see quotes for requests assigned to them
    const techReqIds = db.serviceRequests.filter((r) => r.assignedTechnicianId === user.id).map((r) => r.id);
    quotes = db.quotes.filter((q) => techReqIds.includes(q.requestId));
  }

  return res.json({ quotes });
});

app.post('/api/quotes', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const admin = (req as any).user as User;
  const db = Database.get();
  const { requestId, title, items, validUntil } = req.body;

  const request = db.serviceRequests.find((r) => r.id === requestId);
  if (!request) {
    return res.status(404).json({ error: 'Demande introuvable.' });
  }

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Veuillez saisir au moins une ligne de devis.' });
  }

  let subtotal = 0;
  const formattedItems = items.map((it: any, index: number) => {
    const qty = Number(it.quantity) || 1;
    const price = Number(it.unitPrice) || 0;
    const total = qty * price;
    subtotal += total;
    return {
      id: `qi-${Date.now()}-${index}`,
      description: it.description || 'Prestation technique',
      quantity: qty,
      unitPrice: price,
      totalPrice: total,
    };
  });

  const taxRate = 0.1925;
  const taxAmount = Math.round(subtotal * taxRate);
  const totalAmount = subtotal + taxAmount;

  const quote: Quote = {
    id: `q-${Date.now()}`,
    requestId: request.id,
    requestReference: request.reference,
    clientId: request.clientId,
    title: title || `Devis Chiffré ${request.reference}`,
    items: formattedItems,
    subtotal,
    taxRate,
    taxAmount,
    totalAmount,
    currency: 'FCFA',
    validUntil: validUntil || '2026-12-31',
    status: 'envoye',
    createdAt: new Date().toISOString(),
  };

  db.quotes.unshift(quote);
  Database.save();

  logAudit(admin.id, admin.name, 'admin', 'CREATE_QUOTE', `Création du devis chiffré ${quote.id} pour ${request.reference}`);

  sendNotification(
    request.clientId,
    `Devis chiffré disponible (${request.reference})`,
    `GTEC a émis votre devis d'un montant de ${totalAmount.toLocaleString('fr-FR')} FCFA TTC. Vous pouvez l'examiner et le valider.`,
    'info',
    '/client'
  );

  return res.status(201).json({ success: true, quote });
});

app.patch('/api/quotes/:id/status', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const db = Database.get();
  const quote = db.quotes.find((q) => q.id === req.params.id);

  if (!quote) {
    return res.status(404).json({ error: 'Devis introuvable.' });
  }

  if (user.role === 'client' && quote.clientId !== user.id) {
    return res.status(403).json({ error: 'Non autorisé à modifier ce devis.' });
  }

  const { status } = req.body;
  if (!['accepte', 'refuse'].includes(status)) {
    return res.status(400).json({ error: 'Statut de validation invalide.' });
  }

  quote.status = status;
  if (status === 'accepte') {
    quote.acceptedAt = new Date().toISOString();
  }
  Database.save();

  logAudit(user.id, user.name, user.role, 'UPDATE_QUOTE_STATUS', `Devis ${quote.id} marqué comme ${status}`);

  // Notify admins
  const admins = db.users.filter((u) => u.role === 'admin');
  admins.forEach((adm) => {
    sendNotification(
      adm.id,
      `Réponse client au devis (${quote.requestReference})`,
      `${user.name} a ${status === 'accepte' ? 'APPROUVÉ' : 'REFUSÉ'} le devis de ${quote.totalAmount.toLocaleString('fr-FR')} FCFA.`,
      status === 'accepte' ? 'success' : 'alert',
      '/admin'
    );
  });

  return res.json({ success: true, quote });
});

// ----------------- NOTIFICATIONS ROUTES ----------------- //

app.get('/api/notifications', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const db = Database.get();
  const notifications = db.notifications.filter((n) => n.userId === user.id);
  const unreadCount = notifications.filter((n) => !n.read).length;
  return res.json({ notifications, unreadCount });
});

app.patch('/api/notifications/:id/read', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const db = Database.get();
  const notif = db.notifications.find((n) => n.id === req.params.id && n.userId === user.id);
  if (notif) {
    notif.read = true;
    Database.save();
  }
  return res.json({ success: true });
});

app.post('/api/notifications/mark-all-read', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const db = Database.get();
  db.notifications.forEach((n) => {
    if (n.userId === user.id) n.read = true;
  });
  Database.save();
  return res.json({ success: true });
});

// ----------------- AUDIT LOGS (ADMIN ONLY) ----------------- //

app.get('/api/audit-logs', requireAuth, requireRole(['admin']), (_req: Request, res: Response) => {
  const db = Database.get();
  return res.json({ auditLogs: db.auditLogs });
});

// ----------------- GEMINI COPILOTE & DIAGNOSTIC ----------------- //

app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { messages, mode } = req.body;
  const user = getAuthenticatedUser(req);

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Historique de conversation requis.' });
  }

  try {
    const result = await generateGtecResponse({
      messages,
      mode: mode || 'general',
      userContext: user ? { role: user.role, name: user.name } : undefined,
    });
    return res.json(result);
  } catch (err: any) {
    console.error('Server error during Gemini query:', err);
    return res.status(500).json({ error: 'Erreur lors de l’analyse par l’assistant intelligent.' });
  }
});

// ----------------- VITE MIDDLEWARE OR STATIC PRODUCTION ----------------- //

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`GTEC Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start GTEC server:', err);
});
