import React from 'react';
import { BRANDS, STORE_CONFIG } from '../data/products';
import { SmartphoneBrand } from '../types';
import { YasirMobileLogoIcon } from './Navbar';
import { buildGeneralInquiryUrl } from '../utils/whatsapp';

interface FooterProps {
  onSelectBrand: (brand: SmartphoneBrand) => void;
  onOpenTrackOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectBrand, onOpenTrackOrder }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090C12] border-t border-white/10 pt-12 pb-8 text-slate-400">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-white/10">
          {/* Column 1: Brand Summary */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#0066FF] text-white flex items-center justify-center">
                <YasirMobileLogoIcon className="w-4 h-4" />
              </span>
              <span className="font-bold text-base text-white">Yasir Mobile Store</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {STORE_CONFIG.shortTagline} Verified smartphones from top global brands in DHA Phase 6, Lahore.
            </p>
            <a
              href={buildGeneralInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#60A5FA] hover:text-blue-300 font-mono transition-colors"
            >
              <span>WhatsApp: {STORE_CONFIG.phoneDisplay}</span>
            </a>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollTo('hero')} className="hover:text-[#60A5FA] transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('popular-smartphones')} className="hover:text-[#60A5FA] transition-colors cursor-pointer">
                  Shop
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('shop-by-brand')} className="hover:text-[#60A5FA] transition-colors cursor-pointer">
                  Brands
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('about-us')} className="hover:text-[#60A5FA] transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('visit-us')} className="hover:text-[#60A5FA] transition-colors cursor-pointer">
                  Visit Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Smartphone Companies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Companies</h4>
            <ul className="space-y-2 text-xs">
              {BRANDS.map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => {
                      onSelectBrand(b.name);
                      scrollTo('shop-by-brand');
                    }}
                    className="hover:text-[#60A5FA] transition-colors cursor-pointer"
                  >
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Service</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={buildGeneralInquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#60A5FA] transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
              <li>
                <button onClick={onOpenTrackOrder} className="hover:text-[#60A5FA] transition-colors cursor-pointer">
                  Track Order
                </button>
              </li>
              <li className="text-slate-400">Nationwide Shipping</li>
              <li className="text-slate-400">7-Day Replacement</li>
            </ul>
          </div>

          {/* Column 5: Payment Methods */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Payment Methods</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-200">
              <span className="px-2 py-1 rounded border border-white/10 bg-[#111622]">VISA</span>
              <span className="px-2 py-1 rounded border border-white/10 bg-[#111622]">Mastercard</span>
              <span className="px-2 py-1 rounded border border-white/10 bg-[#111622]">EasyPaisa</span>
              <span className="px-2 py-1 rounded border border-white/10 bg-[#111622]">COD</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {STORE_CONFIG.careHours}
            </p>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Yasir Mobile Store. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>{STORE_CONFIG.address}</span>
          </div>
        </div>

        {/* Subtle Portfolio Credit */}
        <p className="mt-4 pt-4 border-t border-white/5 text-center text-[11px] text-slate-500">
          Demo E-Commerce Concept Developed by Yasir | Portfolio Project
        </p>
      </div>
    </footer>
  );
};
