import React, { useState } from 'react';
import { Heart, Star, Smartphone } from 'lucide-react';
import { SmartphoneModel } from '../types';
import { formatPKR } from '../utils/whatsapp';

interface SmartphoneCardProps {
  phone: SmartphoneModel;
  isWishlisted: boolean;
  onToggleWishlist: (phoneId: string) => void;
  onSelectPhone: (phone: SmartphoneModel) => void;
  onQuickAdd: (phone: SmartphoneModel) => void;
}

export const SmartphoneCard: React.FC<SmartphoneCardProps> = ({
  phone,
  isWishlisted,
  onToggleWishlist,
  onSelectPhone,
  onQuickAdd,
}) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeColor = phone.colors[selectedColorIdx] || phone.colors[0];
  const primaryImage = activeColor?.image || phone.images[0]?.url;
  const hoverImage = phone.images[1]?.url;
  const showHoverImage = isHovered && selectedColorIdx === 0 && hoverImage && hoverImage !== primaryImage;

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#111622] rounded-2xl border border-white/10 p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-[#3B82F6]/50 hover:shadow-[0_20px_45px_-15px_rgba(0,102,255,0.22)] group"
    >
      <div>
        {/* Studio Image Showcase Area */}
        <div className="relative bg-[#F4F7FB] rounded-xl aspect-[4/3] mb-3.5 overflow-hidden flex items-center justify-center p-2.5 border border-white/10">
          {/* Single subtle tag: Discount % or Featured label */}
          {phone.discountPercent ? (
            <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-[#EF4444] text-white text-[11px] font-bold tabular-nums shadow-2xs">
              -{phone.discountPercent}%
            </span>
          ) : phone.badgeText ? (
            <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-md bg-[#0066FF] text-white text-[11px] font-semibold shadow-2xs">
              {phone.badgeText}
            </span>
          ) : null}

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(phone.id);
            }}
            aria-label={isWishlisted ? `Remove ${phone.name} from wishlist` : `Save ${phone.name} to wishlist`}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-[#111622]/90 border border-white/15 flex items-center justify-center text-slate-200 hover:text-[#EF4444] transition-colors shadow-sm cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-[#EF4444] text-[#EF4444]' : ''}`}
            />
          </button>

          {/* Clickable Studio Photo with Smooth Secondary-Angle Reveal */}
          <button
            onClick={() => onSelectPhone(phone)}
            className="relative w-full h-full flex items-center justify-center cursor-pointer"
            aria-label={`View specifications for ${phone.name}`}
          >
            {primaryImage ? (
              <>
                <img
                  src={primaryImage}
                  alt={`${phone.name} - ${activeColor?.name || phone.defaultColor}`}
                  className={`w-full h-full object-contain rounded-lg transition-all duration-300 ${
                    showHoverImage ? 'opacity-0 scale-98' : 'opacity-100 group-hover:scale-103'
                  }`}
                  referrerPolicy="no-referrer"
                />
                {hoverImage && hoverImage !== primaryImage && (
                  <img
                    src={hoverImage}
                    alt={`${phone.name} alternate finish`}
                    aria-hidden="true"
                    className={`absolute inset-0 w-full h-full object-contain rounded-lg transition-all duration-300 ${
                      showHoverImage ? 'opacity-100 scale-103' : 'opacity-0 scale-98 pointer-events-none'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <Smartphone className="w-10 h-10 mb-1" />
                <span className="text-xs font-medium">{phone.name}</span>
              </div>
            )}
          </button>
        </div>

        {/* Brand Kicker & Color Finish Swatches Row */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            {phone.brand}
          </span>
          <div className="flex items-center gap-1.5" role="group" aria-label={`Color finishes for ${phone.name}`}>
            {phone.colors.slice(0, 4).map((color, idx) => (
              <button
                key={color.name}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIdx(idx);
                }}
                title={color.name}
                aria-label={`Preview ${color.name} finish`}
                aria-pressed={selectedColorIdx === idx}
                className={`w-3 h-3 rounded-full border transition-transform cursor-pointer ${
                  selectedColorIdx === idx
                    ? 'border-[#3B82F6] ring-2 ring-[#3B82F6]/35 scale-110'
                    : 'border-white/25 hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>

        {/* Model Title */}
        <button
          onClick={() => onSelectPhone(phone)}
          className="text-left w-full cursor-pointer"
        >
          <h3 className="text-[15px] font-bold text-white group-hover:text-[#60A5FA] transition-colors truncate">
            {phone.name}
          </h3>
        </button>

        {/* Clean Unboxed Specs & Finish Line */}
        <p className="text-xs text-slate-400 mt-0.5 truncate">
          {phone.defaultStorage} · {activeColor?.name || phone.defaultColor} · {phone.specs.chipset}
        </p>

        {/* Price Row */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-[16px] font-bold text-white font-mono tabular-nums">
            {formatPKR(phone.currentPrice)}
          </span>
          {phone.originalPrice && (
            <span className="text-xs text-slate-500 line-through font-mono tabular-nums">
              {formatPKR(phone.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating Line */}
        <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-300">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-white tabular-nums">{phone.rating}</span>
          <span className="text-slate-400">({phone.reviewsCountText})</span>
        </div>
      </div>

      {/* Primary Add to Cart CTA */}
      <div className="mt-4">
        <button
          onClick={() => onQuickAdd(phone)}
          className="w-full py-2.5 px-4 rounded-xl bg-[#0066FF] hover:bg-[#1A75FF] text-white text-xs sm:text-sm font-semibold transition-all duration-150 shadow-xs hover:shadow-md active:scale-98 cursor-pointer whitespace-nowrap"
          aria-label={`Add ${phone.name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
};
