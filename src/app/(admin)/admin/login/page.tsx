'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/admin');
      } else if (response.status === 429) {
        setError(data.error || 'Quá nhiều lần thử. Vui lòng đợi.');
      } else {
        setError(data.error || 'Tài khoản hoặc mật khẩu không chính xác');
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-dark-surface border border-[#1E2D42] rounded-xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 mx-auto mb-4 shadow-lg shadow-gold/20">
            <Image src="/logo.jpg" alt="M$A International Logo" width={56} height={56} className="object-cover" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-white tracking-wide">M$A INTERNATIONAL</h1>
          <p className="text-xs text-gold uppercase tracking-widest mt-1 font-semibold">Bảng điều khiển Quản trị</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Email Quản trị
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mnainternational.com"
                autoComplete="email"
                className="w-full bg-navy border border-[#1E2D42] rounded-lg py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-navy border border-[#1E2D42] rounded-lg py-3 pl-11 pr-12 text-white text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-[#b09048] text-navy font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-gold/20 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Đang xác thực...</span>
            ) : (
              <>
                <span>Đăng nhập CMS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#1E2D42] text-center text-xs text-gray-500">
          <div className="flex items-center justify-center gap-1 mb-1 text-gray-400">
            <ShieldCheck className="w-4 h-4 text-gold" />
            Hệ thống bảo mật nội bộ M$A International
          </div>
          <span>Liên hệ quản trị viên để nhận thông tin đăng nhập</span>
        </div>
      </div>
    </div>
  );
}
