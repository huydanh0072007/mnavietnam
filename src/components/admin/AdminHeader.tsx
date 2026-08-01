'use client';

import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, UserCheck, ChevronDown, User, Lock, LogOut, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  content?: string;
  type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

function formatTimeAgo(dateStr: string) {
  try {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    if (isNaN(diffMs)) return 'Vừa xong';
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Hôm qua';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  } catch {
    return 'Vừa xong';
  }
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<'none' | 'profile' | 'password'>('none');
  
  // Notifications States
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: NotificationItem) => !n.is_read).length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    setIsNotificationsOpen(false);
    if (!notif.is_read) {
      try {
        await fetch('/api/admin/notifications', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: notif.id })
        });
        fetchNotifications();
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-5 flex items-center justify-between sticky top-0 z-20 max-md:pl-16">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        {/* Real notification indicator */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none rounded-lg hover:bg-gray-100"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center border border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn max-h-96 flex flex-col">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <span className="font-serif font-bold text-gray-900 text-sm">Thông báo ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-blue-600 hover:underline font-semibold"
                  >
                    Đọc tất cả
                  </button>
                )}
              </div>
              <div className="divide-y divide-gray-100 overflow-y-auto flex-1 max-h-80">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">Không có thông báo mới</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3 text-left cursor-pointer transition-colors hover:bg-gray-50 flex gap-2.5 items-start ${
                        !notif.is_read ? 'bg-blue-50/40 border-l-2 border-blue-500' : ''
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        notif.type === 'new_lead' ? 'bg-purple-50 text-purple-600' :
                        notif.type === 'vdr_sign' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                      }`}>
                        {notif.type === 'new_lead' ? <UserCheck className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{notif.title}</p>
                        {notif.content && <p className="text-[10px] text-gray-500 truncate">{notif.content}</p>}
                        <p className="text-[9px] text-gray-400">{formatTimeAgo(notif.created_at)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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
