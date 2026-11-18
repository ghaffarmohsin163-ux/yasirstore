import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES, SMARTPHONES } from '../data/products';
import { SmartphoneModel } from '../types';

interface HeroSectionProps {
  onSelectPhone: (phone: SmartphoneModel) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectPhone }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = HERO_SLIDES[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const handleCtaClick = () => {
    const matched = SMARTPHONES.find((p) => p.id === slide.productId) || SMARTPHONES[1];
    onSelectPhone(matched);
  };

  const handleExploreLineup = () => {
    const el = document.getElementById('shop-by-brand');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="bg-[#05070B] pt-4 sm:pt-6 pb-4">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#020B24] via-[#051F61] to-[#0052D4] text-white min-h-[430px] sm:min-h-[500px] flex items-center shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/15">
          {/* Background Studio Hero Photography */}
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover object-right opacity-90 transition-opacity duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Measured Left Gradient Scrim for 4.5:1+ WCAG Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020B24]/95 via-[#031442]/80 to-transparent pointer-events-none" />

          {/* Foreground Content */}
          <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-block text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-[#60A5FA]">
                {slide.kicker}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.08] text-white text-balance">
                {slide.title}
              </h1>

              <p className="text-lg sm:text-xl font-semibold text-blue-100 tracking-tight">
                {slide.subtitle}
              </p>

              <p className="text-sm sm:text-[15px] text-slate-300 max-w-md leading-relaxed">
                {slide.description}
              </p>

              <p className="text-xs text-blue-200/85 font-medium pt-0.5">
                PTA Approved · 1-Year Official Warranty · Free Nationwide Delivery
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCtaClick}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0066FF] hover:bg-[#1A75FF] text-white text-sm font-semibold shadow-lg shadow-blue-950/40 transition-all duration-150 active:scale-98 cursor-pointer whitespace-nowrap"
                >
                  <span>{slide.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleExploreLineup}
                  className="inline-flex items-center px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/20 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  Explore 47 Models
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Controls: Pagination Dots Left & Arrows Right */}
          <div className="absolute bottom-5 left-6 sm:left-12 lg:left-16 right-6 sm:right-12 flex items-center justify-between z-10">
            <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
              {HERO_SLIDES.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`View slide ${idx + 1}: ${item.title}`}
                  aria-selected={idx === activeIndex}
                  className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                    idx === activeIndex ? 'w-7 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous flagship slide"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next flagship slide"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
