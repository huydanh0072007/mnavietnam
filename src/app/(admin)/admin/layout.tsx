'use client';

import '@/app/globals.css';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    // Check auth status via server-side API (httpOnly cookie validation)
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include', // Send cookies
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      } catch {
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Render logic inside stable body
  let content;
  if (pathname === '/admin/login') {
    content = <div className="min-h-screen bg-navy">{children}</div>;
  } else if (isAuthenticated === null) {
    content = (
      <div className="min-h-screen bg-navy flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-medium font-serif">Đang tải CMS...</p>
        </div>
      </div>
    );
  } else if (!isAuthenticated) {
    content = null;
  } else {
    content = (
      <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </div>
    );
  }

  return (
    <html lang="vi">
      <body className="antialiased">
        <Toaster position="top-right" />
        {content}
      </body>
    </html>
  );
}
