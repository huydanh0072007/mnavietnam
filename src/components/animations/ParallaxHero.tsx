'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface ParallaxHeroProps {
  children: React.ReactNode;
  /** Background image URL */
  imageUrl: string;
  /** Parallax speed factor: 0 = no parallax, 0.5 = half speed (default) */
  speed?: number;
  /** Overlay gradient CSS */
  overlay?: string;
  className?: string;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  children,
  imageUrl,
  speed = 0.4,
  overlay = 'linear-gradient(to bottom, rgba(10,22,40,0.80), rgba(10,22,40,0.55) 50%, rgba(10,22,40,1))',
  className = '',
}) => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (bgRef.current) {
            const scrollY = window.scrollY;
            bgRef.current.style.transform = `translate3d(0, ${scrollY * speed}px, 0) scale(1.1)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <section className={`relative h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Parallax Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 will-change-transform"
        style={{
          transform: 'translate3d(0, 0, 0) scale(1.1)', // Scale up to prevent gap at bottom
        }}
      >
        <Image
          src={imageUrl}
          alt="M$A International Hero Background"
          fill
          priority
          fetchPriority="high"
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: overlay }}
      />

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
};
