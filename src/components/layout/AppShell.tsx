'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SettingsProvider } from '@/lib/contexts/SettingsContext';


export function AppShell({ 
  children, 
  lang, 
  dict 
}: { 
  children: React.ReactNode; 
  lang?: string; 
  dict?: any; 
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <SettingsProvider>
      {lang && dict && <Header lang={lang} dict={dict} />}
      <main className="flex-grow">{children}</main>
      <Footer lang={lang} dict={dict} />
    </SettingsProvider>
  );
}
