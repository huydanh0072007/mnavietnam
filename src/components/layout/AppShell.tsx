'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SettingsProvider } from '@/lib/contexts/SettingsContext';


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <SettingsProvider>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </SettingsProvider>
  );
}
