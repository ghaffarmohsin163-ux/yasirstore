import React from 'react';
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { SmartphoneModel } from '../types';
import { formatPKR } from '../utils/whatsapp';

interface WishlistDrawerProps {
  isOpen: boolean;
  phones: SmartphoneModel[];
  onClose: () => void;
  onRemove: (phoneId: string) => void;
  onAddToCart: (phone: SmartphoneModel) => void;
  onSelectPhone: (phone: SmartphoneModel) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  phones,
  onClose,
  onRemove,
  onAddToCart,
  onSelectPhone,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Saved Wishlist"
    >
      <div
        className="w-full max-w-md bg-[#111622] border-l border-white/10 text-slate-100 h-full flex flex-col shadow-2xl animate-drawerSlide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base text-white">
            <Heart className="w-5 h-5 text-[#EF4444] fill-[#EF4444]" />
            <span>Saved Phones ({phones.length})</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close wishlist"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {phones.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-[#0B0F17] border border-white/10 flex items-center justify-center text-slate-400 mb-3">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">No saved smartphones yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[230px]">
                Tap the heart icon on any device to compare or save it for later.
              </p>
            </div>
          ) : (
            phones.map((phone) => (
              <div
                key={phone.id}
                className="flex gap-3.5 p-3.5 rounded-2xl bg-[#0B0F17] border border-white/10"
              >
                <button
                  onClick={() => {
                    onClose();
                    onSelectPhone(phone);
                  }}
                  className="w-18 h-18 rounded-xl bg-[#F4F7FB] border border-white/10 p-1.5 shrink-0 cursor-pointer"
                >
                  <img
                    src={phone.images[0]?.url}
                    alt={phone.name}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{phone.name}</h4>
                      <p className="text-xs text-slate-400">{phone.defaultStorage}</p>
                    </div>
                    <button
                      onClick={() => onRemove(phone.id)}
                      aria-label={`Remove ${phone.name} from wishlist`}
                      className="text-slate-400 hover:text-[#EF4444] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-bold text-white font-mono tabular-nums">
                      {formatPKR(phone.currentPrice)}
                    </span>
                    <button
                      onClick={() => onAddToCart(phone)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0066FF] hover:bg-[#1A75FF] text-white text-xs font-semibold cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
