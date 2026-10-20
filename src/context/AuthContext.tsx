import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Notification } from '../types';
import { api, getStoredUser, setStoredUser, setStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  demoUsers: User[];
  notifications: Notification[];
  unreadCount: number;
  login: (email: string, pass: string) => Promise<User>;
  register: (payload: any) => Promise<User>;
  logout: () => Promise<void>;
  switchDemoUser: (userId: string) => Promise<User>;
  refreshUser: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.getMe();
      if (res.authenticated && res.user) {
        setUser(res.user);
        setStoredUser(res.user);
      } else {
        const cached = getStoredUser();
        if (cached) {
          setUser(cached);
        } else {
          setUser(null);
          setStoredUser(null);
          setStoredToken(null);
        }
      }
    } catch {
      // offline / local fallback
      const cached = getStoredUser();
      if (cached) setUser(cached);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (e) {
      console.warn('Could not refresh notifications', e);
    }
  }, [user]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await refreshUser();
      try {
        const demoRes = await api.getDemoUsers();
        setDemoUsers(demoRes.demoUsers || []);
      } catch (e) {
        console.warn('Could not fetch demo users', e);
      }
      setLoading(false);
    };
    init();
  }, [refreshUser]);

  useEffect(() => {
    if (user) {
      refreshNotifications();
      const interval = setInterval(refreshNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user, refreshNotifications]);

  const login = async (email: string, pass: string): Promise<User> => {
    const res = await api.login(email, pass);
    setUser(res.user);
    refreshNotifications();
    return res.user;
  };

  const register = async (payload: any): Promise<User> => {
    const res = await api.register(payload);
    setUser(res.user);
    refreshNotifications();
    return res.user;
  };

  const logout = async (): Promise<void> => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
  };

  const switchDemoUser = async (userId: string): Promise<User> => {
    const res = await api.switchDemoUser(userId);
    setUser(res.user);
    refreshNotifications();
    return res.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoUsers,
        notifications,
        unreadCount,
        login,
        register,
        logout,
        switchDemoUser,
        refreshUser,
        refreshNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
