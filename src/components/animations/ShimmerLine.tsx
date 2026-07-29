'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ShimmerLineProps {
  className?: string;
  /** Width of the line (CSS value) */
  width?: string;
  /** Height/thickness of the line (CSS value) */
  height?: string;
}

export const ShimmerLine: React.FC<ShimmerLineProps> = ({
  className = '',
  width = '8rem',
  height = '4px',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative mx-auto overflow-hidden rounded-full ${className}`}
      style={{ width, height }}
    >
      {/* Base gold line — scales in from center */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #a38541, #C4A35A, #d4b96a, #C4A35A, #a38541)',
          transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'center',
          transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Shimmer sweep effect */}
      {isVisible && (
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s ease-in-out 1s infinite',
          }}
        />
      )}
    </div>
  );
};
