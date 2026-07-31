'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Lock, FileText, CheckCircle2, ShieldCheck, Download, Mail, PenTool } from 'lucide-react';

type Step = 'locked' | 'identity' | 'otp' | 'signing' | 'unlocked';

export const DataRoomUnlock = ({ projectTitle, dict, lang }: { projectTitle: string, dict?: any, lang?: string }) => {
  const [step, setStep] = useState<Step>('locked');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', org: '', email: '', cccd: '' });
  const [pdpdConsent, setPdpdConsent] = useState(false);
  const [otp, setOtp] = useState('');
  
  // Canvas for signature
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Check if user already signed NDA for this project
    const unlockedStr = localStorage.getItem(`vdr_unlocked_${projectTitle}`);
    if (unlockedStr) {
      setStep('unlocked');
    }
  }, [projectTitle]);

  // Set up canvas context
  useEffect(() => {
    if (step === 'signing' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#C4A35A'; // Gold signature
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [step]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')?.closePath();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdpdConsent) {
      alert(dict?.data_room?.pdpd_alert || "Vui lòng đồng ý với Chính sách Bảo vệ Dữ liệu Cá nhân.");
      return;
    }
    setIsLoading(true);
    // Simulate sending OTP to email
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      if (otp.length === 6) {
        setStep('signing');
      } else {
        alert(dict?.data_room?.invalid_otp || "Mã OTP không hợp lệ.");
      }
    }, 1000);
  };

  const handleSignNDA = async () => {
    setIsLoading(true);
    try {
      const canvas = canvasRef.current;
      const signature_base64 = canvas ? canvas.toDataURL('image/png') : '';
      
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lead_type: 'interest',
          full_name: formData.name,
          organization: formData.org,
          email: formData.email,
          cccd: formData.cccd,
          project_title: projectTitle,
          signature_base64
        })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem(`vdr_unlocked_${projectTitle}`, 'true');
        if (data.lead_id) {
          localStorage.setItem(`vdr_lead_id_${projectTitle}`, data.lead_id);
        }
        setStep('unlocked');
      } else {
        alert(data.errors?.join('\n') || dict?.data_room?.error_general || 'Đã có lỗi xảy ra.');
      }
    } catch (error) {
      console.error('Submit NDA error:', error);
      alert(dict?.data_room?.error_sign || 'Không thể mã hóa chữ ký. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    const leadId = localStorage.getItem(`vdr_lead_id_${projectTitle}`);
    if (leadId) {
      try {
        await fetch('/api/leads/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead_id: leadId,
            action: `Tải xuống tài liệu: ${fileName}`,
            file_url: '#'
          })
        });
      } catch (e) {
        console.error('Audit log failed', e);
      }
    }
    // Logic thực tế để tải file ở đây
  };

  return (
    <div className="bg-[#1A1A2E] text-white p-6 rounded-xl shadow-lg border border-[#C4A35A]/30 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C4A35A]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {step === 'locked' && (
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 bg-[#C4A35A]/20 rounded-full flex items-center justify-center mb-2">
              <Lock className="w-8 h-8 text-[#C4A35A]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#C4A35A]">{dict?.data_room?.title || 'Virtual Data Room'}</h3>
            <p className="text-sm text-gray-300">
              {dict?.data_room?.locked_desc || 'Đây là dự án bảo mật. Vui lòng định danh và ký Thỏa thuận Bảo mật (NDA) điện tử để truy cập Hồ sơ thông tin chi tiết (IM), Pháp lý, và Mô hình tài chính.'}
            </p>
            <Button onClick={() => setStep('identity')} className="w-full mt-4 font-bold shadow-lg shadow-[#C4A35A]/20">
              {dict?.data_room?.request_access || 'Yêu cầu Truy cập'}
            </Button>
          </motion.div>
        )}

        {step === 'identity' && (
          <motion.form
            key="identity"
            onSubmit={handleIdentitySubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-[#C4A35A]" />
              <h3 className="text-lg font-serif font-bold text-[#C4A35A]">{dict?.data_room?.identity_title || 'Định danh Nhà đầu tư'}</h3>
            </div>
            
            <div className="space-y-3">
              <input required type="text" placeholder={dict?.data_room?.name || "Họ và Tên"} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C4A35A]" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="text" placeholder={dict?.data_room?.org || "Đơn vị công tác"} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C4A35A]" 
                value={formData.org} onChange={e => setFormData({...formData, org: e.target.value})} />
              <input required type="email" placeholder={dict?.data_room?.email || "Email doanh nghiệp"} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C4A35A]" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required type="text" placeholder={dict?.data_room?.id_number || "Số CCCD / Hộ chiếu"} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C4A35A]" 
                value={formData.cccd} onChange={e => setFormData({...formData, cccd: e.target.value})} />
            </div>

            {/* PDPD Consent - Luật Dữ liệu 2025/2026 */}
            <label className="flex items-start gap-2 mt-2 cursor-pointer group">
              <input type="checkbox" required className="mt-1 accent-[#C4A35A]" checked={pdpdConsent} onChange={e => setPdpdConsent(e.target.checked)} />
              <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                {dict?.data_room?.pdpd_consent || 'Tôi đồng ý với Chính sách Bảo vệ Dữ liệu Cá nhân theo Luật số 91/2025/QH15. Dữ liệu của tôi chỉ được sử dụng cho mục đích đánh giá cơ hội đầu tư và tôi có quyền yêu cầu xóa bất kỳ lúc nào.'}
              </span>
            </label>
            
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setStep('locked')} className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10" disabled={isLoading}>
                {dict?.data_room?.cancel || 'Hủy'}
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (dict?.data_room?.submitting || 'Đang gửi...') : (dict?.data_room?.continue || 'Tiếp tục')}
              </Button>
            </div>
          </motion.form>
        )}

        {step === 'otp' && (
          <motion.form
            key="otp"
            onSubmit={handleVerifyOtp}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col space-y-4 text-center"
          >
            <div className="w-16 h-16 bg-[#C4A35A]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Mail className="w-8 h-8 text-[#C4A35A]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#C4A35A]">{dict?.data_room?.otp_title || 'Xác thực Email'}</h3>
            <p className="text-sm text-gray-300">
              {dict?.data_room?.otp_desc || 'Vui lòng nhập mã OTP 6 số vừa được gửi đến'} <strong>{formData.email || 'email của bạn'}</strong>.
            </p>
            
            <input 
              required 
              type="text" 
              maxLength={6}
              placeholder="000000" 
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-3 text-2xl tracking-[0.5em] text-center font-mono text-white focus:outline-none focus:border-[#C4A35A]" 
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
            />
            
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setStep('identity')} className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10" disabled={isLoading}>
                {dict?.data_room?.back || 'Quay lại'}
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (dict?.data_room?.verifying || 'Đang xác thực...') : (dict?.data_room?.verify || 'Xác thực')}
              </Button>
            </div>
          </motion.form>
        )}

        {step === 'signing' && (
          <motion.div
            key="signing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <PenTool className="w-6 h-6 text-[#C4A35A]" />
              <h3 className="text-lg font-serif font-bold text-[#C4A35A]">{dict?.data_room?.sign_title || 'Ký NDA Điện tử'}</h3>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-xs text-gray-300 h-32 overflow-y-auto custom-scrollbar border border-white/10">
              <p className="mb-2 text-center text-sm text-white"><strong>{dict?.data_room?.nda_text_1 || 'THỎA THUẬN BẢO MẬT BÊN NHẬN THÔNG TIN'}</strong></p>
              <p className="mb-2"><strong>{dict?.data_room?.nda_text_2 || 'Dự án:'}</strong> {projectTitle}</p>
              <p className="mb-2"><strong>{dict?.data_room?.nda_text_3 || 'Đại diện:'}</strong> {formData.name}, CCCD: {formData.cccd}</p>
              <p>{dict?.data_room?.nda_text_4 || 'Bằng việc ký tên dưới đây, Bên Nhận cam kết không tiết lộ...'}</p>
              <p className="mt-2 text-gray-400">{dict?.data_room?.ip_access || 'IP truy cập:'} {typeof window !== 'undefined' ? '12.34.56.78' : '...'}</p>
            </div>
            
            {/* Signature Canvas */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">{dict?.data_room?.sign_here || 'Vui lòng ký tên vào ô bên dưới:'}</span>
                <button onClick={clearSignature} className="text-xs text-[#C4A35A] hover:underline">{dict?.data_room?.clear_sign || 'Xóa chữ ký'}</button>
              </div>
              <canvas
                ref={canvasRef}
                width={300}
                height={120}
                className="w-full bg-[#0F1D2F] border border-dashed border-white/20 rounded-md cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setStep('otp')} className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10" disabled={isLoading}>
                {dict?.data_room?.back || 'Quay lại'}
              </Button>
              <Button onClick={handleSignNDA} className="flex-1 shadow-lg shadow-[#C4A35A]/20" disabled={isLoading}>
                {isLoading ? (dict?.data_room?.signing || 'Đang mã hóa...') : (dict?.data_room?.complete_sign || 'Hoàn tất Ký')}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'unlocked' && (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-serif font-bold text-green-400">{dict?.data_room?.unlocked_title || 'Đã mở khóa Data Room'}</h3>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg text-xs text-green-200 mb-2">
              {dict?.data_room?.unlocked_desc || 'Tài liệu hiển thị dưới đây đã được mã hóa tự động và đóng dấu mờ (watermark) theo thông tin định danh của bạn.'}
            </div>

            <div className="space-y-2">
              <a href="#" onClick={() => handleDownload('Information Memorandum.pdf')} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#C4A35A]" />
                  <span className="text-sm font-medium">Information Memorandum.pdf</span>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" onClick={() => handleDownload('Ho_so_phap_ly_Full.zip')} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#C4A35A]" />
                  <span className="text-sm font-medium">Ho_so_phap_ly_Full.zip</span>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
              <a href="#" onClick={() => handleDownload('Financial_Model.xlsx')} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium">Financial_Model.xlsx</span>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
