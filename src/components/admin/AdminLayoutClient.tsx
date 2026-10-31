'use client';

import React, { Suspense } from 'react';
import { AdminProvider, useAdmin } from './AdminContext';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

function AdminContentShell({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, quickAlert } = useAdmin();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        }`}
      >
        {/* Admin Navbar */}
        <AdminNavbar />

        {/* Global Toast Alert */}
        {quickAlert && (
          <div className="px-4 sm:px-6 pt-3 animate-in fade-in">
            <div
              className={`p-3 rounded-lg border flex items-center justify-between text-xs font-medium shadow-2xs ${
                quickAlert.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : quickAlert.type === 'info'
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {quickAlert.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : quickAlert.type === 'info' ? (
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{quickAlert.message}</span>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center text-sm">লোড হচ্ছে...</div>}>
      <AdminProvider>
        <AdminContentShell>{children}</AdminContentShell>
      </AdminProvider>
    </Suspense>
  );
}
