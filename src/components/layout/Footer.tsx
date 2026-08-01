'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useSettings } from '@/lib/contexts/SettingsContext';

export const Footer = ({ lang = 'vi', dict }: { lang?: string; dict?: any }) => {
  const { settings, isLoading } = useSettings();

  const projectsUrl = lang === 'en' ? '/en/projects' : `/${lang}/danh-muc`;
  const submitUrl = lang === 'en' ? '/en/submit' : `/${lang}/ky-gui`;
  const aboutUrl = lang === 'en' ? '/en/about' : `/${lang}/gioi-thieu`;

  if (!dict) return null;

  return (
    <footer className="bg-[#0A1628] border-t border-[#1e2f47] pt-16 pb-8 text-[#E8E6E1]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Col 1 */}
          <div>
            <Link href={`/${lang}`} className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                <Image src="/logo.jpg" alt="M$A International Logo" width={40} height={40} className="object-cover" />
              </div>
              <span className="text-xl font-bold text-white font-serif tracking-wider">
                M$A <span className="text-[#C4A35A]">International</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {dict.footer.description}
              <br/><br/>
              <strong className="text-[#C4A35A] font-serif font-medium tracking-wide">{dict.footer.slogan}</strong>
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6 uppercase tracking-wider text-sm">{dict.footer.quickLinks}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href={projectsUrl} className="hover:text-[#C4A35A] transition-colors">{dict.navigation.projects}</Link></li>
              <li><Link href={submitUrl} className="hover:text-[#C4A35A] transition-colors">{dict.navigation.submit}</Link></li>
              <li><Link href={aboutUrl} className="hover:text-[#C4A35A] transition-colors">{dict.navigation.about}</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6 uppercase tracking-wider text-sm">{dict.footer.services}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href={`${projectsUrl}?deal_type=buyout`} className="hover:text-[#C4A35A] transition-colors">{dict.footer.service_buyout}</Link></li>
              <li><Link href={`${projectsUrl}?deal_type=joint_venture`} className="hover:text-[#C4A35A] transition-colors">{dict.footer.service_jv}</Link></li>
              <li><a href="#" className="hover:text-[#C4A35A] transition-colors">{dict.footer.service_eval}</a></li>
              <li><a href="#" className="hover:text-[#C4A35A] transition-colors">{dict.footer.service_legal}</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6 uppercase tracking-wider text-sm">{dict.footer.contact}</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-[#C4A35A] mt-1">📍</span>
                <span>{dict.footer.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#C4A35A]">📞</span>
                {isLoading ? (
                  <span className="w-24 h-4 bg-gray-800 animate-pulse rounded"></span>
                ) : (
                  <a href={`tel:${settings?.phone?.replace(/\s+/g, '') || ''}`} className="hover:text-white transition-colors">{settings?.phone}</a>
                )}
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#C4A35A]">✉️</span>
                {isLoading ? (
                  <span className="w-32 h-4 bg-gray-800 animate-pulse rounded"></span>
                ) : (
                  <a href={`mailto:${settings?.email || ''}`} className="hover:text-white transition-colors">{settings?.email}</a>
                )}
              </li>
              <li className="pt-2">
                <div className="flex gap-3">
                  <a href={settings?.facebook_url || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#1a2f4c] flex items-center justify-center hover:bg-[#C4A35A] hover:text-[#0A1628] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href={settings?.zalo_url || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#1a2f4c] flex items-center justify-center hover:bg-[#C4A35A] hover:text-[#0A1628] transition-colors text-[10px] font-bold font-sans">
                    Zalo
                  </a>
                  <a href={settings?.linkedin_url || '#'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#1a2f4c] flex items-center justify-center hover:bg-[#C4A35A] hover:text-[#0A1628] transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1e2f47] flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} M$A International. {dict.footer.rights}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href={`/${lang}/dieu-khoan-su-dung`} className="hover:text-white transition-colors">{dict.footer.terms}</Link>
            <Link href={`/${lang}/chinh-sach-bao-mat`} className="hover:text-white transition-colors">{dict.footer.privacy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
