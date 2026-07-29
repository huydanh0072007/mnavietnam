'use client';

import React, { useEffect, useRef } from 'react';

interface InteractiveStarsProps {
  className?: string;
  starCount?: number;
}

interface Star {
  x: number;
  y: number;
  baseSize: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  phase: number;
  twinkleSpeed: number;
  color: string;
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  decay: number;
  color: string;
}

export const InteractiveStars: React.FC<InteractiveStarsProps> = ({
  className = '',
  starCount = 120,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const stars: Star[] = [];
    const sparkles: Sparkle[] = [];

    // Resize handler
    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Initialize stars once canvas size is set
      if (stars.length === 0) {
        initStars(rect.width, rect.height);
      }
    };

    // Initialize permanent background stars
    const initStars = (width: number, height: number) => {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        const isGold = Math.random() > 0.75;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseSize: Math.random() * 1.5 + 0.6,
          size: 0,
          baseOpacity: Math.random() * 0.4 + 0.15,
          opacity: 0,
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          color: isGold ? 'rgba(196,163,90,1)' : 'rgba(232,230,225,1)',
        });
      }
    };

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      
      const isInside = 
        newX >= 0 && 
        newY >= 0 && 
        newX <= rect.width && 
        newY <= rect.height;

      if (isInside) {
        mouseRef.current.targetX = newX;
        mouseRef.current.targetY = newY;
        mouseRef.current.active = true;

        // Generate sparkle particles on movement
        if (Math.random() > 0.4) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 0.8 + 0.2;
          sparkles.push({
            x: newX,
            y: newY,
            vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.2,
            vy: Math.sin(angle) * speed - (Math.random() * 0.5 + 0.2), // Float slightly upwards
            size: Math.random() * 3 + 1.5,
            opacity: 1,
            decay: Math.random() * 0.02 + 0.015,
            color: Math.random() > 0.5 ? 'rgba(196, 163, 90, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          });
        }
      } else {
        mouseRef.current.active = false;
        mouseRef.current.targetX = -1000;
        mouseRef.current.targetY = -1000;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse interpolation (ease/damping)
      const mouse = mouseRef.current;
      if (mouse.active) {
        if (mouse.x === -1000) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.15;
          mouse.y += (mouse.targetY - mouse.y) * 0.15;
        }
      } else {
        mouse.x += (-1000 - mouse.x) * 0.1;
        mouse.y += (-1000 - mouse.y) * 0.1;
      }

      const glowRadius = 200;

      // 1. Draw Spotlight Glow around Mouse cursor
      if (mouse.x > -500 && mouse.y > -500) {
        const glowGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        glowGrad.addColorStop(0, 'rgba(196, 163, 90, 0.16)'); // Soft premium gold spotlight glow
        glowGrad.addColorStop(0.3, 'rgba(196, 163, 90, 0.06)');
        glowGrad.addColorStop(1, 'rgba(10, 22, 40, 0)');
        
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw Permanent Background Stars
      stars.forEach((star) => {
        // Natural twinkling calculation
        star.phase += star.twinkleSpeed;
        const twinkle = Math.sin(star.phase) * 0.15;
        
        let targetSize = star.baseSize;
        let targetOpacity = star.baseOpacity + twinkle;
        let isInfluenced = false;

        // Interaction check with mouse spotlight
        if (mouse.x > -500 && mouse.y > -500) {
          const dx = star.x - mouse.x;
          const dby = star.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dby * dby);

          if (dist < glowRadius) {
            const factor = 1 - dist / glowRadius; // 1 at center, 0 at border
            targetSize = star.baseSize + factor * 3.5; // Scale up to 3.5x size
            targetOpacity = Math.min(1.0, star.baseOpacity + factor * 0.7); // Brighten up
            isInfluenced = true;
          }
        }

        // Smooth interpolation of scale & alpha
        star.size += (targetSize - star.size) * 0.12;
        star.opacity += (targetOpacity - star.opacity) * 0.12;

        // Ensure opacity boundaries
        const finalOpacity = Math.max(0.05, Math.min(1.0, star.opacity));

        // Draw star aura if close to cursor
        if (isInfluenced && star.size > 2) {
          ctx.shadowBlur = star.size * 3;
          ctx.shadowColor = 'rgba(196, 163, 90, 0.6)';
        }

        // Color transitions slightly to bright gold near mouse
        ctx.fillStyle = isInfluenced 
          ? `rgba(244, 219, 164, ${finalOpacity})` 
          : star.color.replace('1)', `${finalOpacity})`);

        ctx.beginPath();
        ctx.arc(star.x, star.y, Math.max(0.1, star.size), 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
      });

      // 3. Draw and Update Sparkle Trails
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.opacity -= s.decay;

        if (s.opacity <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        // Draw sparkle star (cross shape or simple star dust)
        ctx.fillStyle = s.color.replace('0.9)', `${s.opacity * 0.8})`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.opacity, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [starCount]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 z-[3] overflow-hidden pointer-events-auto ${className}`}
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
};
