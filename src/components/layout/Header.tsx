'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '../ui/Button';

export const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHomepage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Danh mục', href: '/danh-muc' },
    { name: 'Ký gửi dự án', href: '/ky-gui' },
    { name: 'Giới thiệu', href: '/gioi-thieu' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomepage ? 'bg-[#0A1628]/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 z-50">
          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
            <Image src="/logo.jpg" alt="M$A International Logo" width={40} height={40} className="object-cover" priority />
          </div>
          <span className="text-xl font-bold text-white font-serif tracking-wider">
            Vietnam<span className="text-[#C4A35A]">.com</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className="text-white hover:text-[#C4A35A] transition-colors text-sm font-medium uppercase tracking-wide"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 ml-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/danh-muc?deal_type=buyout">Chuyển nhượng</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/danh-muc?deal_type=joint_venture">Hợp tác đầu tư</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden z-50 text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-[#0A1628] z-40 flex flex-col pt-24 px-6">
            <ul className="flex flex-col gap-6 text-xl">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-white block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-4 mt-10">
              <Button variant="secondary" className="w-full border-[#C4A35A] text-[#C4A35A] hover:bg-[#C4A35A] hover:text-[#1A1A2E]" asChild onClick={() => setIsMobileMenuOpen(false)}>
                <Link href="/danh-muc?deal_type=buyout">Chuyển nhượng</Link>
              </Button>
              <Button variant="primary" className="w-full" asChild onClick={() => setIsMobileMenuOpen(false)}>
                <Link href="/danh-muc?deal_type=joint_venture">Hợp tác đầu tư</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
