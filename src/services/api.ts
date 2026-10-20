import { User, ServiceRequest, Quote, Notification, AuditLog, ServiceCategory } from '../types';

const TOKEN_KEY = 'gtec_auth_token';
const USER_KEY = 'gtec_cached_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-gtec-token'] = token;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Erreur serveur (${response.status})`);
  }

  return data as T;
}

export const api = {
  // Auth
  async getMe(): Promise<{ authenticated: boolean; user: User | null }> {
    return request('/api/auth/me');
  },
  async login(email: string, password: string): Promise<{ success: boolean; token: string; user: User }> {
    const res = await request<{ success: boolean; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    setStoredUser(res.user);
    return res;
  },
  async register(payload: any): Promise<{ success: boolean; token: string; user: User }> {
    const res = await request<{ success: boolean; token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setStoredToken(res.token);
    setStoredUser(res.user);
    return res;
  },
  async logout(): Promise<void> {
    await request('/api/auth/logout', { method: 'POST' });
    setStoredToken(null);
    setStoredUser(null);
  },
  async getDemoUsers(): Promise<{ demoUsers: User[] }> {
    return request('/api/auth/demo-users');
  },
  async switchDemoUser(userId: string): Promise<{ success: boolean; token: string; user: User }> {
    const res = await request<{ success: boolean; token: string; user: User }>('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    setStoredToken(res.token);
    setStoredUser(res.user);
    return res;
  },

  // Services
  async getServices(): Promise<{ services: ServiceCategory[] }> {
    return request('/api/services');
  },

  // Requests
  async getRequests(): Promise<{ requests: ServiceRequest[] }> {
    return request('/api/requests');
  },
  async getRequest(id: string): Promise<{ request: ServiceRequest }> {
    return request(`/api/requests/${id}`);
  },
  async createRequest(payload: Partial<ServiceRequest>): Promise<{ success: boolean; request: ServiceRequest }> {
    return request('/api/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async updateRequestStatus(id: string, status: string, comment?: string): Promise<{ success: boolean; request: ServiceRequest }> {
    return request(`/api/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    });
  },
  async assignTechnician(
    id: string,
    payload: { technicianId: string; scheduledDate?: string; scheduledTimeSlot?: string; adminNotes?: string }
  ): Promise<{ success: boolean; request: ServiceRequest }> {
    return request(`/api/requests/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async technicianResponse(id: string, accepted: boolean, reason?: string): Promise<{ success: boolean; request: ServiceRequest }> {
    return request(`/api/requests/${id}/technician-response`, {
      method: 'POST',
      body: JSON.stringify({ accepted, reason }),
    });
  },
  async submitReport(id: string, payload: any): Promise<{ success: boolean; request: ServiceRequest }> {
    return request(`/api/requests/${id}/report`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Technicians (Admin)
  async getTechnicians(): Promise<{ technicians: (User & { activeMissions: number })[] }> {
    return request('/api/technicians');
  },
  async updateTechnicianStatus(id: string, status: string): Promise<{ success: boolean; technician: User }> {
    return request(`/api/technicians/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Quotes
  async getQuotes(): Promise<{ quotes: Quote[] }> {
    return request('/api/quotes');
  },
  async createQuote(payload: any): Promise<{ success: boolean; quote: Quote }> {
    return request('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  async updateQuoteStatus(id: string, status: 'accepte' | 'refuse'): Promise<{ success: boolean; quote: Quote }> {
    return request(`/api/quotes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: Notification[]; unreadCount: number }> {
    return request('/api/notifications');
  },
  async markNotificationRead(id: string): Promise<void> {
    await request(`/api/notifications/${id}/read`, { method: 'PATCH' });
  },
  async markAllNotificationsRead(): Promise<void> {
    await request('/api/notifications/mark-all-read', { method: 'POST' });
  },

  // Audit
  async getAuditLogs(): Promise<{ auditLogs: AuditLog[] }> {
    return request('/api/audit-logs');
  },

  // Gemini AI Chat
  async chatWithGemini(
    messages: { role: 'user' | 'model'; text: string }[],
    mode: 'fast' | 'general' | 'deep_thinking' = 'general'
  ): Promise<{ text: string; modelUsed: string; thinkingApplied: boolean }> {
    return request('/api/gemini/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, mode }),
    });
  },
};
