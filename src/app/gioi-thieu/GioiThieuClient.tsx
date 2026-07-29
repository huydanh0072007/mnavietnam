'use client';

import React from 'react';
import { useSettings } from '@/lib/contexts/SettingsContext';

export function GioiThieuClient() {
  const { settings, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C4A35A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      {/* Hero */}
      <section className="bg-[#0A1628] pt-40 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 to-[#0A1628]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            {settings.about_hero_title}
          </h1>
          <p className="text-[#E8E6E1] text-lg max-w-2xl mx-auto opacity-90">
            {settings.about_hero_subtitle}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#1A1A2E] mb-6">{settings.about_vision_title}</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>{settings.about_vision_desc_1}</p>
                <p>{settings.about_vision_desc_2}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {settings.about_stats?.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="text-4xl font-serif font-bold text-[#C4A35A] mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-900">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="mb-24">
            <h2 className="text-3xl font-serif font-bold text-[#1A1A2E] mb-12 text-center">Giá trị cốt lõi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {settings.about_values?.map((val) => (
                <div key={val.id} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-[#0A1628] rounded-full flex items-center justify-center text-[#C4A35A] text-xl mb-6">{val.id}</div>
                  <h3 className="text-xl font-serif font-bold text-[#1A1A2E] mb-4">{val.title}</h3>
                  <p className="text-gray-600">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
