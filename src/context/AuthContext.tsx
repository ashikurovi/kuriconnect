'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, UserRole } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message?: string; user?: AuthUser }>;
  register: (data: {
    name: string;
    phone: string;
    nid: string;
    email?: string;
    password: string;
    role?: UserRole;
    jela?: string;
    upazila?: string;
    union?: string;
    gram?: string;
  }) => Promise<{ success: boolean; message?: string; user?: AuthUser }>;
  updateProfile: (data: {
    name: string;
    phone: string;
    nid?: string;
    email?: string;
    jela?: string;
    upazila?: string;
    union?: string;
    gram?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<{ success: boolean; message?: string; user?: AuthUser }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from /api/auth/me or localStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('kc_user', JSON.stringify(data.user));
        } else {
          const cached = localStorage.getItem('kc_user');
          if (cached) {
            setUser(JSON.parse(cached));
          }
        }
      } catch {
        const cached = localStorage.getItem('kc_user');
        if (cached) {
          setUser(JSON.parse(cached));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('kc_user', JSON.stringify(data.user));
        return { success: true, message: data.message, user: data.user };
      }
      return { success: false, message: data.message || 'লগইন ব্যর্থ হয়েছে।' };
    } catch {
      return { success: false, message: 'সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে।' };
    }
  };

  const register = async (data: {
    name: string;
    phone: string;
    nid: string;
    email?: string;
    password: string;
    role?: UserRole;
    jela?: string;
    upazila?: string;
    union?: string;
    gram?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success && resData.user) {
        setUser(resData.user);
        localStorage.setItem('kc_user', JSON.stringify(resData.user));
        return { success: true, message: resData.message, user: resData.user };
      }
      return { success: false, message: resData.message || 'নিবন্ধন সম্পন্ন করা যায়নি।' };
    } catch {
      return { success: false, message: 'সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে।' };
    }
  };

  const updateProfile = async (data: {
    name: string;
    phone: string;
    nid?: string;
    email?: string;
    jela?: string;
    upazila?: string;
    union?: string;
    gram?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId: user?.id })
      });
      const resData = await res.json();
      if (resData.success && resData.user) {
        setUser(resData.user);
        localStorage.setItem('kc_user', JSON.stringify(resData.user));
        return { success: true, message: resData.message, user: resData.user };
      }
      return { success: false, message: resData.message || 'প্রোফাইল আপডেট করা যায়নি।' };
    } catch {
      return { success: false, message: 'সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে।' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setUser(null);
      localStorage.removeItem('kc_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

