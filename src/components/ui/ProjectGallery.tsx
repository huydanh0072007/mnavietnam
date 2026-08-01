'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400">
        No image available
      </div>
    );
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-[#0F1D2F] border border-white/5 group shadow-lg">
        <Image
          src={images[activeIndex]}
          alt={`${title} - Image ${activeIndex + 1}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          priority
        />
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-[#0A1628]/10 group-hover:bg-[#0A1628]/30 transition-colors duration-300" />
        
        {/* Zoom Lightbox Trigger Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-4 right-4 bg-[#0A1628]/80 hover:bg-[#C4A35A] text-white hover:text-[#0A1628] p-3 rounded-lg backdrop-blur-md transition-all duration-300 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 shadow-lg border border-white/10"
          aria-label="Zoom image"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Navigation Arrows for Main Image (if multiple images exist) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#0A1628]/60 hover:bg-[#C4A35A] text-white hover:text-[#0A1628] p-2.5 rounded-lg backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md border border-white/5"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#0A1628]/60 hover:bg-[#C4A35A] text-white hover:text-[#0A1628] p-2.5 rounded-lg backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md border border-white/5"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-20 md:h-24 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                idx === activeIndex 
                  ? 'border-[#C4A35A] opacity-100 scale-[0.98] shadow-md' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A1628]/95 backdrop-blur-md animate-fadeIn">
          {/* Close Area */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-[#C4A35A] text-white hover:text-[#0A1628] p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg border border-white/10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Lightbox Content */}
          <div className="relative max-w-[90vw] max-h-[80vh] w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full max-h-[75vh] rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src={images[activeIndex]}
                alt={`${title} - Zoomed Image ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            
            {/* Caption Info */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium tracking-wide bg-[#0A1628]/60 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          </div>

          {/* Lightbox Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#C4A35A] text-white hover:text-[#0A1628] p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg border border-white/10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#C4A35A] text-white hover:text-[#0A1628] p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg border border-white/10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
