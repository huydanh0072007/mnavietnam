'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface DonutSegment {
  label: string;
  value: number; // Percentage 0-100
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  title?: string;
  subtitle?: string;
  size?: number;
  strokeWidth?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  subtitle,
  size = 200,
  strokeWidth = 24,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  let currentOffset = 0;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div style={{ width: size, height: size }} className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center drop-shadow-xl"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1a273b"
            strokeWidth={strokeWidth}
          />
          {/* Foreground segments */}
          {mounted &&
            data.map((segment, index) => {
              const segmentLength = (segment.value / 100) * circumference;
              const strokeDasharray = `${segmentLength} ${circumference}`;
              
              // Cần offset ngược chiều kim đồng hồ do SVG vẽ
              const strokeDashoffset = -currentOffset;
              currentOffset += segmentLength;

              return (
                <motion.circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={circumference} // Trạng thái ban đầu: trống
                  whileInView={{ strokeDashoffset: strokeDashoffset }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.15 }}
                  strokeLinecap="round"
                />
              );
            })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {title && <div className="text-2xl font-playfair font-bold text-white">{title}</div>}
            {subtitle && <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{subtitle}</div>}
          </motion.div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {data.map((segment, index) => (
          <motion.div 
            key={index} 
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <span
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-sm font-medium text-gray-300">
              {segment.label} <span className="text-white ml-1 font-bold">{segment.value}%</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
