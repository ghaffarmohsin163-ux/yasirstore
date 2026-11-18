import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SmartphoneModel } from '../types';
import { SmartphoneCard } from './SmartphoneCard';

interface BestDealsSectionProps {
  phones: SmartphoneModel[];
  wishlistIds: string[];
  onToggleWishlist: (phoneId: string) => void;
  onSelectPhone: (phone: SmartphoneModel) => void;
  onQuickAdd: (phone: SmartphoneModel) => void;
  onViewAll: () => void;
}

export const BestDealsSection: React.FC<BestDealsSectionProps> = ({
  phones,
  wishlistIds,
  onToggleWishlist,
  onSelectPhone,
  onQuickAdd,
  onViewAll,
}) => {
  return (
    <section id="best-deals" className="bg-[#090C12] py-10 sm:py-12 border-y border-white/10 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight">
              Best Deals
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Top smartphone offers. Limited time savings on popular models.
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#60A5FA] hover:text-blue-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {phones.map((phone) => (
            <SmartphoneCard
              key={phone.id}
              phone={phone}
              isWishlisted={wishlistIds.includes(phone.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectPhone={onSelectPhone}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
