import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PROMO_LINEUP_IMAGE } from '../data/products';

interface PromoBannerSectionProps {
  onShopDeals: () => void;
}

export const PromoBannerSection: React.FC<PromoBannerSectionProps> = ({ onShopDeals }) => {
  return (
    <section className="bg-[#05070B] py-6">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#020E30] via-[#062778] to-[#0052D4] text-white min-h-[240px] sm:min-h-[270px] flex items-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/15">
          {/* Background Studio Smartphone Lineup */}
          <img
            src={PROMO_LINEUP_IMAGE}
            alt="Selected Flagship Smartphones Lineup"
            className="absolute inset-0 w-full h-full object-cover object-right opacity-90"
            referrerPolicy="no-referrer"
          />

          {/* Contrast Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020E30]/95 via-[#052063]/80 to-transparent pointer-events-none" />

          <div className="relative z-10 w-full px-6 sm:px-12 py-10 grid grid-cols-1 md:grid-cols-12 items-center gap-6">
            <div className="md:col-span-6 space-y-2.5">
              <span className="text-xs font-semibold tracking-wider uppercase text-blue-300 block">
                Limited Time Offer
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Up to 30% Off
              </h2>
              <p className="text-sm sm:text-base text-blue-100">
                On Selected Flagship &amp; 5G Smartphones
              </p>
              <div className="pt-2">
                <button
                  onClick={onShopDeals}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#0F172A] hover:bg-blue-50 text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <span>Shop Deals</span>
                  <ArrowRight className="w-4 h-4 text-[#0066FF]" />
                </button>
              </div>
            </div>

            <div className="hidden md:flex md:col-span-6 justify-end items-end pr-4">
              <div className="text-right">
                <p className="text-lg font-medium text-blue-100/90 italic tracking-wide">
                  Better. Faster. Smarter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
