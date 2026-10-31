'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

interface SiteLayoutWrapperProps {
  children: React.ReactNode;
}

export default function SiteLayoutWrapper({ children }: SiteLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // If in admin panel, omit the public TopBar, Navbar, and Footer to give admin its own layout
  if (isAdmin) {
    return (
      <AuthProvider>
        <div className="min-h-screen flex flex-col">{children}</div>
      </AuthProvider>
    );
  }

  // Public website shell
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

