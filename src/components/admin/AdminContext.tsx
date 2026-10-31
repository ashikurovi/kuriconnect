'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export type AdminTab =
  | 'overview'
  | 'news'
  | 'reports'
  | 'donors'
  | 'blood_requests'
  | 'lost_found'
  | 'scams'
  | 'facilities'
  | 'police'
  | 'roles'
  | 'logs'
  | 'settings';

interface AdminContextType {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapse: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadNotificationsCount: number;
  setUnreadNotificationsCount: React.Dispatch<React.SetStateAction<number>>;
  quickAlert: { message: string; type: 'success' | 'error' | 'info' } | null;
  triggerAlert: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const VALID_TABS: AdminTab[] = [
  'overview',
  'news',
  'reports',
  'donors',
  'blood_requests',
  'lost_found',
  'scams',
  'facilities',
  'police',
  'roles',
  'logs',
  'settings',
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [internalTab, setInternalTab] = useState<AdminTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(3);
  const [quickAlert, setQuickAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Derive activeTab from URL searchParams or fallback to internalTab
  const activeTab = useMemo(() => {
    const tabParam = searchParams.get('tab') as AdminTab | null;
    if (tabParam && VALID_TABS.includes(tabParam)) {
      return tabParam;
    }
    return internalTab;
  }, [searchParams, internalTab]);

  const setActiveTab = (tab: AdminTab) => {
    setInternalTab(tab);
    router.replace(`/admin?tab=${tab}`, { scroll: false });
    setIsMobileSidebarOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const triggerAlert = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setQuickAlert({ message, type });
    setTimeout(() => {
      setQuickAlert(null);
    }, 3500);
  };

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebarCollapse,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
        searchQuery,
        setSearchQuery,
        unreadNotificationsCount,
        setUnreadNotificationsCount,
        quickAlert,
        triggerAlert,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
