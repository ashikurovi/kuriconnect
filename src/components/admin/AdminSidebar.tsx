'use client';

import React from 'react';
import Link from 'next/link';
import { useAdmin, AdminTab } from './AdminContext';
import {
  LayoutDashboard,
  Newspaper,
  AlertTriangle,
  HeartHandshake,
  ShieldAlert,
  Hospital,
  ShieldCheck,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  X,
  FileQuestion,
  Heart
} from 'lucide-react';

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      {
        id: 'overview',
        label: 'ড্যাশবোর্ড',
        icon: LayoutDashboard,
      },
      {
        id: 'news',
        label: 'সংবাদ',
        icon: Newspaper,
      },
      {
        id: 'reports',
        label: 'নাগরিক রিপোর্ট',
        icon: AlertTriangle,
        badge: '৩',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      },
      {
        id: 'donors',
        label: 'রক্তদাতা',
        icon: HeartHandshake,
      },
      {
        id: 'blood_requests',
        label: 'রক্তের আবেদন',
        icon: Heart,
      },
      {
        id: 'lost_found',
        label: 'হারানো বিজ্ঞপ্তি',
        icon: FileQuestion,
      },
      {
        id: 'scams',
        label: 'প্রতারণা',
        icon: ShieldAlert,
      },
    ],
  },
  {
    title: 'ডিরেক্টরি',
    items: [
      {
        id: 'facilities',
        label: 'হাসপাতাল',
        icon: Hospital,
      },
      {
        id: 'police',
        label: 'পুলিশ ও থানা',
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: 'সিস্টেম',
    items: [
      {
        id: 'roles',
        label: 'পারমিশন',
        icon: Users,
      },
      {
        id: 'logs',
        label: 'লগস',
        icon: FileText,
      },
      {
        id: 'settings',
        label: 'সেটিংস',
        icon: Settings,
      },
    ],
  },
];

export default function AdminSidebar() {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useAdmin();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0b131f] text-slate-200 border-r border-slate-800 transition-all duration-300 ease-in-out select-none
          ${isSidebarCollapsed ? 'lg:w-16' : 'lg:w-60'}
          ${isMobileSidebarOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand / Header */}
        <div className="h-14 flex items-center justify-between px-3.5 border-b border-slate-800/80 bg-[#070e17]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-bold text-sm text-white tracking-wide truncate">
                KuriConnect
              </span>
            )}
          </div>

          {/* Close button for Mobile */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-md lg:hidden"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title={isSidebarCollapsed ? 'প্রসারিত করুন' : 'গুটিয়ে নিন'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-0.5">
              {!isSidebarCollapsed && section.title && (
                <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {section.title}
                </div>
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group relative
                        ${
                          isActive
                            ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        }
                        ${isSidebarCollapsed ? 'justify-center' : ''}`}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                        }`}
                      />

                      {!isSidebarCollapsed && (
                        <>
                          <span className="truncate flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : item.badgeColor || 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}

                      {/* Tooltip on collapsed state */}
                      {isSidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700">
                          {item.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-2.5 border-t border-slate-800/80 bg-[#070e17]">
          <Link
            href="/"
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title="ওয়েবসাইটে যান"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {!isSidebarCollapsed && <span className="truncate">ওয়েবসাইটে যান</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
