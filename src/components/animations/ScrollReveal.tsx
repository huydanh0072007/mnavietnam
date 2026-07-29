'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animation direction: 'up' | 'down' | 'left' | 'right' | 'fade' */
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  /** Delay in milliseconds */
  delay?: number;
  /** Duration in milliseconds */
  duration?: number;
  /** Distance to travel in pixels */
  distance?: number;
  /** IntersectionObserver threshold (0-1) */
  threshold?: number;
  /** Whether to animate only once */
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 900,
  distance = 60,
  threshold = 0.1,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Ensure component has mounted and painted with initial (hidden) state
  // before we start observing — prevents "flash" where animation is missed
  useEffect(() => {
    // Wait 1 frame to ensure the hidden state has been painted
    const raf = requestAnimationFrame(() => {
      setHasMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add a small delay to ensure the hidden state is painted first
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -80px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once, hasMounted]);

  const getInitialTransform = (): string => {
    switch (direction) {
      case 'up': return `translateY(${distance}px)`;
      case 'down': return `translateY(-${distance}px)`;
      case 'left': return `translateX(${distance}px)`;
      case 'right': return `translateX(-${distance}px)`;
      case 'fade': return 'translateY(0)';
      default: return `translateY(${distance}px)`;
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) translateX(0)' : getInitialTransform(),
        transition: isVisible
          ? `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
          : 'none', // No transition on initial state to prevent "reverse" animation
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};
