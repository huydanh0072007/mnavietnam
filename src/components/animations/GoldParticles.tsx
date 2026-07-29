'use client';

import React, { useEffect, useState } from 'react';

interface GoldParticlesProps {
  /** Number of particles */
  count?: number;
  /** Container className */
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export const GoldParticles: React.FC<GoldParticlesProps> = ({
  count = 35,
  className = '',
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2, // Bigger: 2-6px (was 1-4px)
      opacity: Math.random() * 0.6 + 0.2, // Brighter: 0.2-0.8 (was 0.1-0.6)
      duration: Math.random() * 8 + 6, // Faster: 6-14s (was 10-25s)
      delay: Math.random() * -10,
    }));
    setParticles(generated);
  }, [count]);

  if (particles.length === 0) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, rgba(196,163,90,${p.opacity}) 0%, rgba(196,163,90,${p.opacity * 0.3}) 60%, transparent 100%)`,
            boxShadow: `0 0 ${p.size * 4}px ${p.size}px rgba(196,163,90,${p.opacity * 0.5})`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};
