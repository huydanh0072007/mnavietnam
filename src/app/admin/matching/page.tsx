'use client';

import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Network, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function MatchingPage() {
  return (
    <div className="flex-1 pb-16 bg-gray-50 min-h-screen">
      <AdminHeader 
        title="Khớp lệnh (Matching) Nhà đầu tư & Dự án" 
        subtitle="Hệ thống phân tích và đề xuất dự án tự động dựa trên Khẩu vị đầu tư" 
      />

      <main className="px-8 py-8 space-y-6 max-w-7xl">
        
        {/* Intro Banner */}
        <div className="bg-gradient-to-r from-[#0A1628] to-[#1a2f4c] text-white p-6 rounded-xl flex items-start gap-4 shadow-md">
          <div className="bg-white/10 p-3 rounded-lg shrink-0">
            <Sparkles className="w-8 h-8 text-[#C4A35A]" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-serif text-[#C4A35A]">AI Smart Matching</h3>
            <p className="text-sm text-gray-300 mt-1 max-w-3xl leading-relaxed">
              Tính năng Khớp lệnh sẽ tự động quét danh sách Nhà đầu tư (Leads) và đề xuất các dự án phù hợp dựa trên các tiêu chí: Loại giao dịch (M&A / JV), Quy mô vốn, Loại hình dự án (Nghỉ dưỡng, Thương mại), và Tỉnh thành quan tâm.
            </p>
          </div>
        </div>

        {/* Coming Soon Module */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
          <Network className="w-16 h-16 text-gray-300 mb-4" />
          <h4 className="text-gray-900 font-bold font-serif text-lg mb-2">Module Đang được Phát triển</h4>
          <p className="text-gray-500 text-sm max-w-md mb-6">
            Thuật toán phân tích khẩu vị đầu tư và hệ thống gửi thư chào (Teaser) tự động hàng loạt đang được kỹ sư xây dựng. Tính năng này sẽ sớm ra mắt trong bản cập nhật kế tiếp.
          </p>
          <Button variant="secondary" className="border-gray-300 text-gray-700 font-medium">
            Xem Tài liệu Hướng dẫn
          </Button>
        </div>

      </main>
    </div>
  );
}
