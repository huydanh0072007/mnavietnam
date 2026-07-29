'use client';

import React from 'react';

interface GlowButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`relative inline-block group ${className}`}>
      {/* Animated glow ring — always visible, intensifies on hover */}
      <div
        className="absolute -inset-2 rounded-xl blur-lg"
        style={{
          background: 'rgba(196, 163, 90, 0.35)',
          animation: 'glowPulse 2.5s ease-in-out infinite',
        }}
      />
      {/* Second glow layer for more intensity */}
      <div
        className="absolute -inset-2 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{
          background: 'rgba(212, 175, 55, 0.8)', // Rich Gold
        }}
      />
      {/* Button content - Added z-10 to prevent glow from covering text */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
