'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Loader2 } from 'lucide-react';

import { MasterDataItem } from '@/lib/master-data-store';

export function KyGuiClient({ categories, dict, lang }: { categories: MasterDataItem[], dict: any, lang?: string }) {
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
        alert(data.errors?.join('\n') || dict.submit.error_occurred);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(dict.submit.error_occurred);
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
            {dict.submit.title}
          </h1>
          <p className="text-[#E8E6E1] text-lg max-w-2xl mx-auto opacity-90">
            {dict.submit.desc}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-[#0F1D2F] border border-gray-800 p-8 md:p-12 rounded-lg shadow-xl relative">
              
              {/* Success Modal Overlay */}
              {isSuccess && (
                <div className="absolute inset-0 z-50 bg-[#0F1D2F]/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-[#1a2e4a] rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-white mb-4">{dict.submit.success_title}</h2>
                  <p className="text-gray-300 mb-8 max-w-md mx-auto">
                    {dict.submit.success_desc}
                  </p>
                  <Button size="lg" onClick={() => setIsSuccess(false)}>
                    {dict.submit.success_btn}
                  </Button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Thông tin liên hệ */}
                <div>
                  <h3 className="text-xl font-serif font-bold text-white border-b border-gray-800 pb-4 mb-6">
                    1. {dict.submit.contact_info}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{dict.submit.form_name} *</label>
                      <input type="text" name="full_name" required className="w-full bg-[#0A1628] text-white placeholder:text-gray-400 border border-gray-700 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder={dict.submit.form_name_placeholder} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{dict.submit.form_role}</label>
                      <input type="text" name="role_title" className="w-full bg-[#0A1628] text-white placeholder:text-gray-400 border border-gray-700 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder={dict.submit.form_role_placeholder} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{dict.submit.form_company} *</label>
                      <input type="text" name="organization" required className="w-full bg-[#0A1628] text-white placeholder:text-gray-400 border border-gray-700 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder={dict.submit.form_company_placeholder} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{dict.submit.form_phone} *</label>
                      <input type="tel" name="phone" required className="w-full bg-[#0A1628] text-white placeholder:text-gray-400 border border-gray-700 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder={dict.submit.form_phone_placeholder} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">{dict.submit.form_email} *</label>
                      <input type="email" name="email" required className="w-full bg-[#0A1628] text-white placeholder:text-gray-400 border border-gray-700 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder={dict.submit.form_email_placeholder} />
                    </div>
                  </div>
                </div>

                {/* Thông tin dự án */}
                <div>
                  <h3 className="text-xl font-serif font-bold text-white border-b border-gray-800 pb-4 mb-6">
                    2. {dict.submit.project_info}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">{dict.submit.form_project_name}</label>
                      <input type="text" name="project_name_location" required className="w-full bg-[#0A1628] text-white placeholder:text-gray-400 border border-gray-700 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder={dict.submit.form_project_name_placeholder} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{dict.submit.form_deal_type}</label>
                      <select name="preferred_deal_type" className="w-full bg-[#0A1628] text-white border border-gray-700 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]">
                        <option value="" className="bg-[#0A1628] text-white">{dict.submit.form_deal_type_select}</option>
                        {categories.filter(c => c.category === 'deal_type').map(c => (
                          <option key={c.key} value={c.key} className="bg-[#0A1628] text-white">{(lang === 'en' && c.label_en) ? c.label_en : c.label}</option>
                        ))}
                        <option value="other" className="bg-[#0A1628] text-white">{dict.submit.form_deal_type_other}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{dict.submit.form_scale}</label>
                      <input type="text" name="estimated_scale" className="w-full bg-[#0A1628] text-white placeholder:text-gray-400 border border-gray-700 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder={dict.submit.form_scale_placeholder} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">{dict.submit.form_message}</label>
                      <textarea name="message" rows={4} className="w-full bg-[#0A1628] text-white placeholder:text-gray-400 border border-gray-700 rounded-md p-3 focus:ring-[#C4A35A] focus:border-[#C4A35A]" placeholder={dict.submit.form_message_placeholder}></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">{dict.submit.form_attachment}</label>
                      <input type="file" name="attachment" className="w-full bg-[#0A1628] text-white border border-gray-700 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#C4A35A] file:text-[#0A1628] hover:file:bg-[#a38541] cursor-pointer" />
                      {/* Hidden field to explicitly state lead_type if not using multipart check */}
                      <input type="hidden" name="lead_type" value="submission" />
                      <p className="text-xs text-gray-400 mt-2">{dict.submit.form_attachment_desc}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" size="lg" className="w-full md:w-auto text-[#0A1628] font-bold" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {dict.submit.form_submitting}
                      </span>
                    ) : (
                      dict.submit.form_submit_btn
                    )}
                  </Button>
                  <div className="flex items-start gap-3 mt-6">
                    <input type="checkbox" required id="consent" className="mt-1 w-4 h-4 text-[#C4A35A] bg-[#0A1628] border-gray-700 rounded focus:ring-[#C4A35A]" />
                    <label htmlFor="consent" className="text-sm text-gray-300">
                      {dict.submit.form_consent} <Link href={`/${lang}/dieu-khoan-su-dung`} className="text-[#C4A35A] hover:underline">{dict.submit.form_consent_terms}</Link> {dict.submit.form_consent_and} <Link href={`/${lang}/chinh-sach-bao-mat`} className="text-[#C4A35A] hover:underline">{dict.submit.form_consent_privacy}</Link>{dict.submit.form_consent_commit}
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
