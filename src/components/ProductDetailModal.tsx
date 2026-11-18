import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Smartphone,
  HardDrive,
  Cpu,
  Wifi,
  Minus,
  Plus,
  Check,
  X,
} from 'lucide-react';
import { SmartphoneModel } from '../types';
import { formatPKR, buildSmartphoneInquiryUrl } from '../utils/whatsapp';
import { getPriceForStorage } from '../utils/checkout';

interface ProductDetailModalProps {
  phone: SmartphoneModel | null;
  isOpen: boolean;
  isWishlisted: boolean;
  onToggleWishlist: (phoneId: string) => void;
  onClose: () => void;
  onAddToCart: (phone: SmartphoneModel, storage: string, color: string, quantity: number) => void;
  onBuyNow: (phone: SmartphoneModel, storage: string, color: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  phone,
  isOpen,
  isWishlisted,
  onToggleWishlist,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (phone && isOpen) {
      setActiveImageIdx(0);
      setSelectedStorage(phone.defaultStorage);
      setSelectedColor(phone.defaultColor);
      setQuantity(1);
      setCopiedShare(false);
    }
  }, [phone, isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !phone) return null;

  const activePrice = getPriceForStorage(phone.currentPrice, phone.storageOptions, selectedStorage);
  const activeOriginalPrice = phone.originalPrice
    ? getPriceForStorage(phone.originalPrice, phone.storageOptions, selectedStorage)
    : undefined;
  const activeColorObj = phone.colors.find((c) => c.name === selectedColor);
  const displayedImg =
    activeImageIdx === 0 && activeColorObj?.image
      ? activeColorObj.image
      : phone.images[activeImageIdx]?.url || phone.images[0]?.url;

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${phone.brand} ${phone.name} — ${formatPKR(activePrice)} at Yasir Mobile Store`);
      }
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 1800);
    } catch {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 1800);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${phone.name} product details`}
    >
      <div
        className="relative w-full max-w-4xl bg-[#111622] text-slate-100 rounded-3xl shadow-2xl overflow-hidden animate-modalReveal my-auto border border-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar matching Screen 1 */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#111622]">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(phone.id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-slate-300 hover:text-[#EF4444] hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#EF4444] text-[#EF4444]' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              aria-label="Share smartphone link"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-slate-300 hover:text-[#60A5FA] hover:bg-white/5 transition-colors cursor-pointer"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Two-Column PDP Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT: Vertical Thumb Strip + Studio Image */}
          <div className="lg:col-span-6 bg-[#0B0F17] p-5 sm:p-7 flex gap-3 sm:gap-4 items-center border-b lg:border-b-0 lg:border-r border-white/10">
            {/* Vertical Thumbnail Strip */}
            <div className="flex flex-col gap-2.5 shrink-0">
              {phone.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`Select angle ${img.label}`}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#F4F7FB] p-1.5 border-2 transition-all overflow-hidden cursor-pointer ${
                    activeImageIdx === idx
                      ? 'border-[#3B82F6] ring-2 ring-[#3B82F6]/30'
                      : 'border-white/15 hover:border-white/40'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>

            {/* Main Studio Photo */}
            <div className="flex-1 aspect-square bg-[#F4F7FB] rounded-2xl border border-white/15 p-5 flex items-center justify-center relative">
              {phone.discountPercent && (
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-[#EF4444] text-white text-xs font-bold tabular-nums">
                  -{phone.discountPercent}%
                </span>
              )}
              <img
                src={displayedImg}
                alt={`${phone.name} - ${selectedColor}`}
                className="w-full h-full object-contain max-h-[320px]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* RIGHT: Specifications, Color Swatches, Storage & Quantity */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#60A5FA]">
                  {phone.brand} Official Smartphone
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  {phone.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span>{selectedStorage} · {selectedColor}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-slate-200 font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="tabular-nums">{phone.rating}</span>
                    <span className="text-slate-400">({phone.reviewsCountText} reviews)</span>
                  </span>
                </div>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {formatPKR(activePrice)}
                </span>
                {activeOriginalPrice && (
                  <span className="text-sm text-slate-500 line-through font-mono tabular-nums">
                    {formatPKR(activeOriginalPrice)}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {phone.shortDescription}
              </p>

              {/* 4-Column Spec Chips matching reference PDP */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-[#0B0F17] border border-white/10 rounded-xl p-2.5 text-center">
                  <Smartphone className="w-4 h-4 text-[#60A5FA] mx-auto mb-1" />
                  <span className="block text-xs font-bold text-white tabular-nums">{phone.specs.display}</span>
                  <span className="block text-[10px] text-slate-400">Display</span>
                </div>
                <div className="bg-[#0B0F17] border border-white/10 rounded-xl p-2.5 text-center">
                  <HardDrive className="w-4 h-4 text-[#60A5FA] mx-auto mb-1" />
                  <span className="block text-xs font-bold text-white tabular-nums">{selectedStorage}</span>
                  <span className="block text-[10px] text-slate-400">Storage</span>
                </div>
                <div className="bg-[#0B0F17] border border-white/10 rounded-xl p-2.5 text-center">
                  <Cpu className="w-4 h-4 text-[#60A5FA] mx-auto mb-1" />
                  <span className="block text-xs font-bold text-white truncate">{phone.specs.chipset}</span>
                  <span className="block text-[10px] text-slate-400">Processor</span>
                </div>
                <div className="bg-[#0B0F17] border border-white/10 rounded-xl p-2.5 text-center">
                  <Wifi className="w-4 h-4 text-[#60A5FA] mx-auto mb-1" />
                  <span className="block text-xs font-bold text-white truncate">{phone.specs.network}</span>
                  <span className="block text-[10px] text-slate-400">Network</span>
                </div>
              </div>

              {/* Storage Capacity Picker */}
              <div>
                <span className="text-xs font-semibold text-white block mb-2">
                  Storage Capacity
                </span>
                <div className="flex flex-wrap gap-2">
                  {phone.storageOptions.map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStorage(st)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        selectedStorage === st
                          ? 'bg-[#0F2147] border-[#3B82F6] text-[#60A5FA]'
                          : 'bg-[#0B0F17] border-white/15 text-slate-300 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches matching reference PDP */}
              <div>
                <span className="text-xs font-semibold text-white block mb-2">
                  Color: <span className="font-normal text-slate-400">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-2.5">
                  {phone.colors.map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => {
                          setSelectedColor(c.name);
                          setActiveImageIdx(0);
                        }}
                        title={c.name}
                        aria-label={`Select color ${c.name}`}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          isSelected ? 'border-[#3B82F6] scale-110 ring-2 ring-[#3B82F6]/30' : 'border-white/30'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Stepper & Actions */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <p className="text-xs text-slate-400">
                PTA Approved · 12-Month Official Warranty · Free Express Delivery
              </p>
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="inline-flex items-center border border-white/15 rounded-xl bg-[#0B0F17] p-1 shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-40 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-sm font-bold text-white tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(phone.stockCount, q + 1))}
                    disabled={quantity >= phone.stockCount}
                    aria-label="Increase quantity"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add to Cart CTA */}
                <button
                  onClick={() => onAddToCart(phone, selectedStorage, selectedColor, quantity)}
                  className="flex-1 py-3 px-5 rounded-xl bg-[#0066FF] hover:bg-[#1A75FF] text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Add to Cart — {formatPKR(activePrice * quantity)}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => onBuyNow(phone, selectedStorage, selectedColor, quantity)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-[#3B82F6] text-[#60A5FA] hover:bg-[#0066FF]/15 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Express Checkout Now
                </button>
                <a
                  href={buildSmartphoneInquiryUrl(phone, selectedStorage, selectedColor, quantity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl border border-white/15 text-slate-200 hover:border-emerald-500 hover:text-emerald-400 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  WhatsApp Inquiry
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
