import React from 'react';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { calculateCartTotals, getPriceForStorage } from '../utils/checkout';
import { formatPKR } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (index: number, nextQuantity: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totals = calculateCartTotals(items);
  const totalCount = items.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Your Cart"
    >
      <div
        className="w-full max-w-md bg-[#111622] border-l border-white/10 text-slate-100 h-full flex flex-col shadow-2xl animate-drawerSlide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Screen 2 ("← Your Cart (N)") */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-base font-bold text-white hover:text-[#60A5FA] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Your Cart ({totalCount})</span>
          </button>
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-[#0B0F17] border border-white/10 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">Your cart is empty</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                Explore Apple, Samsung, Google, OnePlus, Xiaomi, and realme models to add smartphones.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-semibold hover:bg-[#1A75FF] cursor-pointer"
              >
                Browse Smartphones
              </button>
            </div>
          ) : (
            items.map((item, idx) => {
              const unitPrice = getPriceForStorage(
                item.product.currentPrice,
                item.product.storageOptions,
                item.selectedStorage
              );
              const colorImage =
                item.product.colors.find((c) => c.name === item.selectedColor)?.image ||
                item.product.images[0]?.url;
              return (
                <div
                  key={`${item.product.id}-${item.selectedStorage}-${item.selectedColor}`}
                  className="flex gap-4 p-3.5 rounded-2xl bg-[#0B0F17] border border-white/10"
                >
                  <div className="w-20 h-20 rounded-xl bg-[#F4F7FB] border border-white/10 p-1.5 shrink-0 flex items-center justify-center">
                    <img
                      src={colorImage}
                      alt={`${item.product.name} - ${item.selectedColor}`}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          {item.selectedStorage} · {item.selectedColor}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        aria-label={`Remove ${item.product.name} from cart`}
                        className="text-slate-400 hover:text-[#EF4444] transition-colors cursor-pointer p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="inline-flex items-center bg-[#161D2C] border border-white/15 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          aria-label={`Decrease quantity for ${item.product.name}`}
                          className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          aria-label={`Increase quantity for ${item.product.name}`}
                          className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-white font-mono tabular-nums">
                        {formatPKR(unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary Footer matching Screen 2 */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#0B0F17] space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-white font-mono tabular-nums">
                  {formatPKR(totals.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-400">Free</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-base font-bold text-white">
                <span>Total</span>
                <span className="font-mono tabular-nums text-lg">{formatPKR(totals.total)}</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-5 rounded-xl bg-[#0066FF] hover:bg-[#1A75FF] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
