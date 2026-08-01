'use client';

import React from 'react';
import { Bell, ShieldCheck, UserCheck, ChevronDown, User, Lock, LogOut, X } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<'none' | 'profile' | 'password'>('none');

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-5 flex items-center justify-between sticky top-0 z-20 max-md:pl-16">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        {/* Quick notification indicator */}
        <div className="relative cursor-pointer p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-5 h-5" />
        </div>

        {/* User Info Badge (Clickable) */}
        <div className="relative border-l border-gray-200 pl-6">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#0A1628] text-[#C4A35A] font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
              SA
            </div>
            <div className="text-left hidden md:block">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                Quản trị viên
                <ShieldCheck className="w-4 h-4 text-[#C4A35A]" />
              </div>
              <div className="text-xs text-gray-500">Super Admin</div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <p className="text-sm font-semibold text-gray-900">Quản trị viên</p>
                <p className="text-xs text-gray-500 truncate">admin@mnainternational.com</p>
              </div>
              <div className="p-1">
                <button 
                  onClick={() => { setModalType('profile'); setIsDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C4A35A] rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  Thông tin tài khoản
                </button>
                <button 
                  onClick={() => { setModalType('password'); setIsDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C4A35A] rounded-lg transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  Đổi mật khẩu
                </button>
              </div>
              <div className="p-1 border-t border-gray-100">
                <button 
                  onClick={async () => {
                    try {
                      await fetch('/api/auth/logout', { method: 'POST' });
                    } catch (error) {
                      console.error('Logout error:', error);
                    } finally {
                      window.location.href = '/admin/login';
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modalType !== 'none' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center animate-fadeIn p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-serif font-bold text-lg text-gray-900">
                {modalType === 'profile' ? 'Cập nhật Thông tin cá nhân' : 'Đổi mật khẩu'}
              </h3>
              <button 
                onClick={() => setModalType('none')}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {modalType === 'profile' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Tên hiển thị</label>
                    <input type="text" defaultValue="Quản trị viên" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Email</label>
                    <input type="email" defaultValue="admin@mnainternational.com" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Chức vụ</label>
                    <input type="text" defaultValue="Super Admin" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Mật khẩu hiện tại</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Mật khẩu mới</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Xác nhận mật khẩu mới</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setModalType('none')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={() => {
                  alert('Lưu thành công!');
                  setModalType('none');
                }}
                className="px-4 py-2 text-sm font-bold text-[#0A1628] bg-[#C4A35A] hover:bg-[#b09048] rounded-lg transition-colors shadow-sm"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
