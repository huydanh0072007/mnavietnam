'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { 
  Mail, 
  Send, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Bell, 
  Bot, 
  Key,
  Globe,
  BrainCircuit,
  Phone,
  Link as LinkIcon,
  User
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [notificationEmail, setNotificationEmail] = useState('admin@mnainternational.com, legal@mnainternational.com');
  const [telegramToken, setTelegramToken] = useState('7123456789:AAFxXxxxxXxxxxXxxxxXxxxxXxxxx');
  const [telegramChatId, setTelegramChatId] = useState('-100123456789');
  const [enableEmailNotif, setEnableEmailNotif] = useState(true);
  const [enableTelegramNotif, setEnableTelegramNotif] = useState(true);
  const [enableTurnstile, setEnableTurnstile] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Settings
  const [phone, setPhone] = useState('090 123 4567');
  const [email, setEmail] = useState('contact@mnainternational.com');
  const [zaloUrl, setZaloUrl] = useState('https://zalo.me/');
  const [facebookUrl, setFacebookUrl] = useState('https://facebook.com/');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/');
  const [heroTitle, setHeroTitle] = useState('CỔNG THÔNG TIN DỰ ÁN M&A<br/>HÀNG ĐẦU VIỆT NAM');
  const [heroSubtitle, setHeroSubtitle] = useState('Nền tảng kết nối Độc quyền giữa các Chủ đầu tư uy tín và Mạng lưới Nhà đầu tư Quốc tế.');
  const [aiProvider, setAiProvider] = useState('google');
  const [aiApiKey, setAiApiKey] = useState('');
  const [aiModel, setAiModel] = useState('gemini-1.5-pro');
  
  // About Page Settings
  const [aboutHeroTitle, setAboutHeroTitle] = useState('');
  const [aboutHeroSubtitle, setAboutHeroSubtitle] = useState('');
  const [aboutVisionTitle, setAboutVisionTitle] = useState('');
  const [aboutVisionDesc1, setAboutVisionDesc1] = useState('');
  const [aboutVisionDesc2, setAboutVisionDesc2] = useState('');

  // SMTP Settings
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFromName, setSmtpFromName] = useState('MNA International');
  const [smtpFromEmail, setSmtpFromEmail] = useState('noreply@mnainternational.com');
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  useEffect(() => {
    fetch('/api/settings', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if(data) {
          setPhone(data.phone || '090 123 4567');
          setEmail(data.email || 'contact@mnainternational.com');
          setZaloUrl(data.zalo_url || 'https://zalo.me/');
          setFacebookUrl(data.facebook_url || 'https://facebook.com/');
          setLinkedinUrl(data.linkedin_url || 'https://linkedin.com/');
          setHeroTitle(data.hero_title || 'CỔNG THÔNG TIN DỰ ÁN M&A<br/>HÀNG ĐẦU VIỆT NAM');
          setHeroSubtitle(data.hero_subtitle || 'Nền tảng kết nối Độc quyền giữa các Chủ đầu tư uy tín và Mạng lưới Nhà đầu tư Quốc tế.');
          setAiProvider(data.ai_provider || 'google');
          setAiApiKey(data.ai_api_key || '');
          setAiModel(data.ai_model || 'gemini-1.5-pro');
          setAboutHeroTitle(data.about_hero_title || '');
          setAboutHeroSubtitle(data.about_hero_subtitle || '');
          setAboutVisionTitle(data.about_vision_title || '');
          setAboutVisionDesc1(data.about_vision_desc_1 || '');
          setAboutVisionDesc2(data.about_vision_desc_2 || '');
          setSmtpHost(data.smtp_host || '');
          setSmtpPort(data.smtp_port || 587);
          setSmtpSecure(data.smtp_secure || false);
          setSmtpUser(data.smtp_user || '');
          setSmtpPass(data.smtp_pass || '');
          setSmtpFromName(data.smtp_from_name || 'MNA International');
          setSmtpFromEmail(data.smtp_from_email || 'noreply@mnainternational.com');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching settings:', err);
        setIsLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf-protection': '1'
        },
        body: JSON.stringify({
          phone,
          email,
          zalo_url: zaloUrl,
          facebook_url: facebookUrl,
          linkedin_url: linkedinUrl,
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          ai_provider: aiProvider,
          ai_api_key: aiApiKey,
          ai_model: aiModel,
          about_hero_title: aboutHeroTitle,
          about_hero_subtitle: aboutHeroSubtitle,
          about_vision_title: aboutVisionTitle,
          about_vision_desc_1: aboutVisionDesc1,
          about_vision_desc_2: aboutVisionDesc2,
          smtp_host: smtpHost,
          smtp_port: smtpPort,
          smtp_secure: smtpSecure,
          smtp_user: smtpUser,
          smtp_pass: smtpPass,
          smtp_from_name: smtpFromName,
          smtp_from_email: smtpFromEmail
        })
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch(err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu.');
    }
  };

  const handleTestEmail = async () => {
    if (!smtpUser || !smtpPass || !smtpHost) {
      alert('Vui lòng điền đầy đủ Host, User và Password trước khi test.');
      return;
    }
    
    // Test usually wants an email to receive the test. We can use the admin's notification email or ask.
    const testEmail = window.prompt("Nhập địa chỉ email để nhận email thử nghiệm:", smtpUser);
    if (!testEmail) return;

    setIsTestingEmail(true);
    try {
      const res = await fetch('/api/settings/test-email', {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf-protection': '1'
        },
        body: JSON.stringify({ email: testEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Đã gửi email thử nghiệm thành công! Vui lòng kiểm tra hộp thư (kể cả mục Spam).');
      } else {
        alert(data.error || 'Lỗi cấu hình SMTP. Vui lòng kiểm tra lại mật khẩu ứng dụng và cổng.');
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi gọi API gửi email.');
    } finally {
      setIsTestingEmail(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 flex-1">Đang tải cấu hình...</div>;
  }

  return (
    <div className="flex-1 pb-16">
      <AdminHeader 
        title="Cài đặt Hệ thống & Dữ liệu động" 
        subtitle="Cấu hình thông tin Website, API Trí tuệ Nhân tạo và Kênh thông báo" 
      />

      <main className="px-8 py-8 max-w-4xl space-y-8">
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Đã lưu toàn bộ cấu hình hệ thống thành công! Giao diện Frontend đã được cập nhật.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">

          {/* Dynamic Info Section */}
          <div className="bg-white p-6 rounded-xl border border-[#C4A35A]/30 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2.5 bg-[#C4A35A]/10 text-[#C4A35A] rounded-lg">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-serif">Thông tin Website & Mạng Xã Hội</h2>
                <p className="text-xs text-gray-500">Các thay đổi tại đây sẽ được cập nhật lập tức trên Trang chủ và Footer</p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                    Hotline (Click-to-call)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                    Email Liên hệ (Click-to-mail)
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3"/> Zalo URL
                  </label>
                  <input
                    type="url"
                    value={zaloUrl}
                    onChange={(e) => setZaloUrl(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3"/> Facebook URL
                  </label>
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3"/> LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5 mt-2">
                  Tiêu đề Chính (Hero Title) <span className="text-gray-400 normal-case ml-1">- Dùng &lt;br/&gt; để xuống dòng</span>
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-serif text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                  Đoạn mô tả phụ (Hero Subtitle)
                </label>
                <textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                />
              </div>
            </div>
          </div>

          {/* About Page Config */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-serif">Nội dung Trang Giới Thiệu</h2>
                <p className="text-xs text-gray-500">Cấu hình các đoạn văn bản hiển thị trên trang Về chúng tôi</p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                  Tiêu đề Hero
                </label>
                <input
                  type="text"
                  value={aboutHeroTitle}
                  onChange={(e) => setAboutHeroTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-serif text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                  Đoạn mô tả Hero
                </label>
                <textarea
                  value={aboutHeroSubtitle}
                  onChange={(e) => setAboutHeroSubtitle(e.target.value)}
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                />
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                  Tiêu đề Tầm nhìn & Sứ mệnh
                </label>
                <input
                  type="text"
                  value={aboutVisionTitle}
                  onChange={(e) => setAboutVisionTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-serif text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                  Nội dung Tầm nhìn (Đoạn 1)
                </label>
                <textarea
                  value={aboutVisionDesc1}
                  onChange={(e) => setAboutVisionDesc1(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                  Nội dung Tầm nhìn (Đoạn 2)
                </label>
                <textarea
                  value={aboutVisionDesc2}
                  onChange={(e) => setAboutVisionDesc2(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                />
              </div>
            </div>
          </div>

          {/* AI Core Config (HIDDEN TEMPORARILY) */}
          <div className="hidden bg-gradient-to-r from-[#0A1628] to-[#1a2f4c] p-6 rounded-xl border border-gray-800 shadow-sm space-y-5 text-white">
            <div className="flex items-center gap-3 border-b border-gray-700/50 pb-4">
              <div className="p-2.5 bg-white/10 text-[#C4A35A] rounded-lg">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-serif text-[#C4A35A]">Trí tuệ Nhân tạo (AI Core)</h2>
                <p className="text-xs text-gray-300">Cấu hình API để phục vụ Bot tư vấn và thuật toán Khớp lệnh AI</p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                    1. Nhà cung cấp (Provider)
                  </label>
                  <select
                    value={aiProvider}
                    onChange={(e) => {
                      setAiProvider(e.target.value);
                      // Auto-select first model of new provider
                      if (e.target.value === 'google') setAiModel('gemini-1.5-pro');
                      if (e.target.value === 'openai') setAiModel('gpt-4o');
                      if (e.target.value === 'anthropic') setAiModel('claude-3-5-sonnet');
                      if (e.target.value === 'mistral') setAiModel('mistral-large-2407');
                      if (e.target.value === 'groq') setAiModel('llama-3.1-70b-versatile');
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C4A35A]"
                  >
                    <option value="google">Google AI</option>
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="mistral">Mistral AI</option>
                    <option value="groq">Groq (Meta Llama)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5">
                    2. AI Model
                  </label>
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C4A35A]"
                  >
                    {aiProvider === 'google' && (
                      <>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Khuyên dùng)</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Nhanh)</option>
                        <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
                      </>
                    )}
                    {aiProvider === 'openai' && (
                      <>
                        <option value="gpt-4o">GPT-4o (Khuyên dùng)</option>
                        <option value="gpt-4o-mini">GPT-4o Mini (Nhanh)</option>
                        <option value="o1-preview">o1-preview (Suy luận sâu)</option>
                        <option value="o1-mini">o1-mini (Code/Toán)</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      </>
                    )}
                    {aiProvider === 'anthropic' && (
                      <>
                        <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Khuyên dùng)</option>
                        <option value="claude-3-opus">Claude 3 Opus (Mạnh nhất)</option>
                        <option value="claude-3-5-haiku">Claude 3.5 Haiku (Nhanh)</option>
                      </>
                    )}
                    {aiProvider === 'mistral' && (
                      <>
                        <option value="mistral-large-2407">Mistral Large 2 (Khuyên dùng)</option>
                        <option value="mistral-nemo">Mistral Nemo (Nhanh)</option>
                        <option value="open-mixtral-8x22b">Mixtral 8x22B</option>
                      </>
                    )}
                    {aiProvider === 'groq' && (
                      <>
                        <option value="llama-3.1-70b-versatile">Llama 3.1 70B (Khuyên dùng)</option>
                        <option value="llama-3.1-8b-instant">Llama 3.1 8B (Nhanh)</option>
                        <option value="llama3-70b-8192">Llama 3 70B</option>
                        <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase mb-1.5 flex gap-2 items-center">
                    <Key className="w-3 h-3" /> 3. API Key
                  </label>
                  <input
                    type="password"
                    value={aiApiKey}
                    onChange={(e) => setAiApiKey(e.target.value)}
                    placeholder="••••••••••••••••••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SMTP Configuration Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                <Send className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900 font-serif">Máy chủ Gửi Email (SMTP)</h2>
                <p className="text-xs text-gray-500">Cấu hình kết nối đến dịch vụ Email (Gmail, Microsoft 365, Zoho...) để gửi thông báo tự động.</p>
              </div>
              <button
                type="button"
                onClick={handleTestEmail}
                disabled={isTestingEmail}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
              >
                {isTestingEmail ? <Bot className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isTestingEmail ? 'Đang gửi...' : 'Gửi Test Email'}
              </button>
            </div>

            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(parseInt(e.target.value))}
                    placeholder="587"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smtpSecure}
                      onChange={(e) => setSmtpSecure(e.target.checked)}
                      className="w-5 h-5 text-[#C4A35A] rounded focus:ring-[#C4A35A]"
                    />
                    <span className="text-sm font-semibold text-gray-700">Bật SSL/TLS (Secure)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5 flex items-center gap-2">
                    <User className="w-4 h-4" /> SMTP Username (Email)
                  </label>
                  <input
                    type="text"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5 flex items-center gap-2">
                    <Key className="w-4 h-4" /> Mật khẩu Ứng dụng (App Password)
                  </label>
                  <input
                    type="password"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="Nhập mật khẩu nếu muốn đổi"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Lưu ý: Đối với Gmail, bạn phải dùng "Mật khẩu Ứng dụng" thay vì mật khẩu thường.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                    Tên người gửi (From Name)
                  </label>
                  <input
                    type="text"
                    value={smtpFromName}
                    onChange={(e) => setSmtpFromName(e.target.value)}
                    placeholder="MNA International"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                    Email gửi đi (From Email)
                  </label>
                  <input
                    type="text"
                    value={smtpFromEmail}
                    onChange={(e) => setSmtpFromEmail(e.target.value)}
                    placeholder="noreply@mnainternational.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Email Notification Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 font-serif">Thông báo qua Email</h2>
                  <p className="text-xs text-gray-500">Gửi mail tự động cho Admin ngay khi có Lead mới</p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={enableEmailNotif}
                onChange={(e) => setEnableEmailNotif(e.target.checked)}
                className="w-5 h-5 text-[#C4A35A] rounded focus:ring-[#C4A35A] cursor-pointer"
              />
            </div>

            {enableEmailNotif && (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">
                    Danh sách Email Nhận
                  </label>
                  <input
                    type="text"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#C4A35A]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-[#C4A35A] hover:bg-[#b09048] text-[#0A1628] font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg text-sm"
            >
              <Save className="w-4 h-4" />
              Lưu toàn bộ Cấu hình
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
