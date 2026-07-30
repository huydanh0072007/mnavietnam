'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Loader2 } from 'lucide-react';

import { MasterDataItem } from '@/lib/master-data-store';

export function KyGuiClient({ categories }: { categories: MasterDataItem[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);

      const res = await fetch('/api/leads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
      } else {
        alert(data.errors?.join('\n') || 'Đã có lỗi xảy ra.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      {/* Hero */}
      <section className="bg-[#0A1628] pt-40 pb-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Ký gửi / Hợp tác dự án
          </h1>
          <p className="text-[#E8E6E1] text-lg max-w-2xl mx-auto opacity-90">
            Kết nối dự án của bạn với mạng lưới hơn 200 nhà đầu tư uy tín. Chúng tôi đảm bảo bảo mật thông tin tuyệt đối.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm relative">
              
              {/* Success Modal Overlay */}
              {isSuccess && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-[#1A1A2E] mb-4">Gửi thông tin thành công</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Cảm ơn bạn đã tin tưởng MNA International. Chuyên viên của chúng tôi sẽ liên hệ với bạn trong vòng 24h làm việc để trao đổi chi tiết.
                  </p>
                  <Button size="lg" onClick={() => setIsSuccess(false)}>
                    Gửi dự án khác
                  </Button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Thông tin liên hệ */}
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1A1A2E] border-b border-gray-100 pb-4 mb-6">
                    1. Thông tin liên hệ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                      <input type="text" name="full_name" required className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder="Nhập họ và tên" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chức vụ</label>
                      <input type="text" name="role_title" className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder="VD: Giám đốc đầu tư" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị / Công ty *</label>
                      <input type="text" name="organization" required className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder="Tên công ty" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                      <input type="tel" name="phone" required className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder="Số điện thoại liên hệ" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input type="email" name="email" required className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder="Địa chỉ email" />
                    </div>
                  </div>
                </div>

                {/* Thông tin dự án */}
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1A1A2E] border-b border-gray-100 pb-4 mb-6">
                    2. Sơ bộ về dự án
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tên / Vị trí dự án *</label>
                      <input type="text" name="project_name_location" required className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder="VD: Khu dân cư tại Quận 2, TP.HCM" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức giao dịch mong muốn</label>
                      <select name="preferred_deal_type" className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]">
                        <option value="">Chọn hình thức...</option>
                        {categories.filter(c => c.category === 'deal_type').map(c => (
                          <option key={c.key} value={c.key}>{c.label}</option>
                        ))}
                        <option value="other">Chưa xác định / Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quy mô ước tính</label>
                      <input type="text" name="estimated_scale" className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder="VD: 5ha, 1000 tỷ VNĐ" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả thêm / Yêu cầu đặc biệt</label>
                      <textarea name="message" rows={4} className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder="Chia sẻ thêm về hiện trạng pháp lý, tiến độ, hoặc các yêu cầu bảo mật..."></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tài liệu đính kèm (Teaser/Profile nếu có)</label>
                      <input type="file" name="attachment" className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-md p-2" />
                      {/* Hidden field to explicitly state lead_type if not using multipart check */}
                      <input type="hidden" name="lead_type" value="submission" />
                      <p className="text-xs text-gray-500 mt-2">Định dạng hỗ trợ: PDF, DOCX, PPTX (Tối đa 10MB)</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Đang xử lý hồ sơ...
                      </span>
                    ) : (
                      'Gửi thông tin dự án'
                    )}
                  </Button>
                  <div className="flex items-start gap-3 mt-6">
                    <input type="checkbox" required id="consent" className="mt-1 w-4 h-4 text-[#C4A35A] border-gray-300 rounded focus:ring-[#C4A35A]" />
                    <label htmlFor="consent" className="text-sm text-gray-600">
                      Tôi đồng ý với <Link href="/dieu-khoan-su-dung" className="text-blue-600 hover:underline">Điều khoản sử dụng</Link> và <Link href="/chinh-sach-bao-mat" className="text-blue-600 hover:underline">Chính sách Bảo vệ Dữ liệu Cá nhân theo Luật số 91/2025/QH15</Link>. Chúng tôi cam kết bảo mật tuyệt đối thông tin dự án.
                    </label>
                  </div>
                </div>
              </form>
            </div>
        </div>
      </section>
    </div>
  );
}
