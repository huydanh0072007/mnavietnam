'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  LogOut,
  ExternalLink,
  Building2,
  ShieldAlert,
  Network,
  Menu,
  X
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  // If on login page, don't render sidebar
  if (pathname === '/admin/login') return null;

  const navItems = [
    {
      label: 'Tổng quan',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Quản lý Dự án',
      href: '/admin/du-an',
      icon: FolderKanban,
      exact: false,
    },
    {
      label: 'Quản lý Master Data',
      href: '/admin/master-data',
      icon: Settings,
      exact: false,
    },
    {
      label: 'Quản lý Lead',
      href: '/admin/leads',
      icon: Users,
      exact: false,
    },
    {
      label: 'Cài đặt Thông báo',
      href: '/admin/cai-dat',
      icon: Settings,
      exact: false,
    },
    {
      label: 'Quản lý VDR',
      href: '/admin/vdr',
      icon: ShieldAlert,
      exact: false,
    },
    // {
    //   label: 'Khớp lệnh (Matching)',
    //   href: '/admin/matching',
    //   icon: Network,
    //   exact: false,
    // },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Proceed to login page even if API call fails
    }
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg border backdrop-blur-md transition-all duration-300 md:hidden shadow-md ${
          isOpen 
            ? 'bg-[#0A1628] text-white border-white/10' 
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
        }`}
        aria-label="Toggle admin menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-[#0A1628]/60 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-[#0A1628] text-white flex flex-col h-full border-r border-[#1E2D42] z-45 transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1E2D42]">
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
              <Image src="/logo.jpg" alt="M$A International Logo" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <div className="font-serif font-bold text-lg text-white tracking-wide">M$A INTERNATIONAL</div>
              <div className="text-xs text-[#C4A35A] font-medium tracking-wider uppercase">CMS Control Center</div>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#C4A35A] text-[#0A1628] font-semibold shadow-md'
                    : 'text-gray-300 hover:bg-[#1E2D42] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#0A1628]' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Quick Actions */}
        <div className="p-4 border-t border-[#1E2D42] space-y-2">
          <Link
            href="/"
            target="_blank"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-[#1E2D42] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C4A35A]" />
              Xem Website công khai
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}
