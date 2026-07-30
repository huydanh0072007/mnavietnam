'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

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

  // Login page layout
  if (pathname === '/admin/login') {
    return (
      <html lang="vi">
        <body className="antialiased">
          <div className="min-h-screen bg-[#0A1628]">{children}</div>
        </body>
      </html>
    );
  }

  // Loading auth check
  if (isAuthenticated === null) {
    return (
      <html lang="vi">
        <body className="antialiased">
          <div className="min-h-screen bg-[#0A1628] flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#C4A35A] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-400 font-medium">Đang xác thực hệ thống CMS...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <html lang="vi">
      <body className="antialiased">
        <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
