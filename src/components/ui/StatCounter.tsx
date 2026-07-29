'use client';
import React, { useEffect, useState, useRef } from 'react';

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({ value, label, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();
          
          const updateCount = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeOutQuart
            const easeOut = 1 - Math.pow(1 - progress, 4);
            
            setCount(Math.floor(easeOut * value));
            
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              setCount(value);
            }
          };
          
          requestAnimationFrame(updateCount);
          if (elementRef.current) observer.unobserve(elementRef.current);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value]);

  return (
    <div ref={elementRef} className="text-center p-6 bg-[#0F1D2F] rounded-lg border border-[#1e2f47]">
      <div className="text-4xl md:text-5xl font-serif font-bold text-[#C4A35A] mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[#E8E6E1] text-sm md:text-base font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};
