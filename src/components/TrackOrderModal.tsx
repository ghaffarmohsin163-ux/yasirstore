import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  Calendar,
  MapPin,
  Search,
  Truck,
  X,
} from 'lucide-react';
import { SmartphoneOrder } from '../types';
import { formatPKR } from '../utils/whatsapp';

interface TrackOrderModalProps {
  isOpen: boolean;
  orders: SmartphoneOrder[];
  activeOrder: SmartphoneOrder | null;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  orders,
  activeOrder,
  onClose,
}) => {
  const [lookupId, setLookupId] = useState('');
  const [displayedOrder, setDisplayedOrder] = useState<SmartphoneOrder | null>(null);
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const target = activeOrder || orders[0] || null;
      setDisplayedOrder(target);
      setLookupId(target?.orderId || '');
      setLookupError('');
    }
  }, [isOpen, activeOrder, orders]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = lookupId.trim().toUpperCase();
    const matched = orders.find(
      (o) => o.orderId.toUpperCase() === cleaned || o.orderId.toUpperCase() === `#${cleaned}`
    );
    if (matched) {
      setDisplayedOrder(matched);
      setLookupError('');
    } else {
      setLookupError(`No order found for "${lookupId}". Try #YM-784512 or place a checkout order.`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Track Your Order"
    >
      <div
        className="relative w-full max-w-lg bg-[#111622] text-slate-100 rounded-3xl shadow-2xl overflow-hidden animate-modalReveal my-auto border border-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Screen 6 ("← Track Your Order") */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-base font-bold text-white hover:text-[#60A5FA] cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Track Your Order</span>
          </button>
          <button
            onClick={onClose}
            aria-label="Close order tracker"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 max-h-[86vh] overflow-y-auto">
          {/* Quick Order Lookup Bar */}
          <form onSubmit={handleSearchOrder} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Enter Order ID (e.g. #YM-784512)"
                aria-label="Order tracking ID"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/15 bg-[#090C12] text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#1A75FF] text-white text-xs font-semibold cursor-pointer"
            >
              Track
            </button>
          </form>
          {lookupError && <p className="text-xs text-red-400">{lookupError}</p>}

          {displayedOrder && (
            <>
              {/* Order ID Subheading */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div>
                  <span className="text-xs text-slate-400 block">Order Reference</span>
                  <span className="text-sm font-bold text-white font-mono">
                    Order {displayedOrder.orderId}
                  </span>
                </div>
                <span className="text-sm font-bold text-[#60A5FA] font-mono tabular-nums">
                  {formatPKR(displayedOrder.totalAmount)}
                </span>
              </div>

              {/* 5-Stage Vertical Tracking Timeline matching Screen 6 */}
              <div className="space-y-3 py-0.5">
                {displayedOrder.timeline.map((step, idx) => {
                  const isLast = idx === displayedOrder.timeline.length - 1;
                  return (
                    <div key={step.stage} className="relative flex gap-3.5">
                      {!isLast && (
                        <div
                          className={`absolute left-[13px] top-7 bottom-[-12px] w-0.5 ${
                            step.completed ? 'bg-[#0066FF]' : 'bg-white/15'
                          }`}
                        />
                      )}

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          step.completed
                            ? 'bg-[#0066FF] text-white'
                            : 'bg-[#0B0F17] border-2 border-white/20 text-slate-400'
                        }`}
                      >
                        {step.completed ? (
                          <Check className="w-4 h-4" strokeWidth={2.5} />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-500" />
                        )}
                      </div>

                      <div className="pb-0.5">
                        <p
                          className={`text-sm font-semibold leading-tight ${
                            step.completed ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {step.stage}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{step.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Estimated Delivery & Shipping Address Cards matching Screen 6 */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0B0F17] border border-white/10">
                  <Calendar className="w-4 h-4 text-[#60A5FA] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400 block">Estimated Delivery</span>
                    <span className="text-sm font-bold text-white">
                      {displayedOrder.estimatedDelivery}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0B0F17] border border-white/10">
                  <MapPin className="w-4 h-4 text-[#60A5FA] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400 block">Shipping Address</span>
                    <span className="text-sm font-semibold text-white block">
                      {displayedOrder.shipping.fullName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {displayedOrder.shipping.address}, {displayedOrder.shipping.city}{' '}
                      {displayedOrder.shipping.postalCode}
                    </span>
                  </div>
                </div>

                {/* Stylized Courier Route Map Card matching bottom of Screen 6 */}
                <div className="relative h-24 rounded-2xl overflow-hidden bg-[#0B162C] border border-[#1E3A8A]/60 flex items-center justify-between px-5">
                  <svg
                    viewBox="0 0 400 120"
                    className="absolute inset-0 w-full h-full opacity-45 pointer-events-none"
                    aria-hidden="true"
                  >
                    <path
                      d="M 20 95 Q 130 20, 220 65 T 360 35"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeDasharray="6 6"
                    />
                    <line x1="0" y1="40" x2="400" y2="40" stroke="#1E293B" strokeWidth="1" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="#1E293B" strokeWidth="1" />
                    <line x1="120" y1="0" x2="120" y2="120" stroke="#1E293B" strokeWidth="1" />
                    <line x1="270" y1="0" x2="270" y2="120" stroke="#1E293B" strokeWidth="1" />
                  </svg>

                  <div className="relative z-10 flex items-center gap-2 bg-[#111622] px-3 py-1.5 rounded-xl border border-white/15 shadow-xs">
                    <Truck className="w-4 h-4 text-[#60A5FA]" />
                    <span className="text-xs font-semibold text-white">DHA Lahore Hub</span>
                  </div>

                  <div className="relative z-10 flex items-center gap-1.5 bg-[#0066FF] text-white px-3 py-1.5 rounded-xl shadow-xs">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">{displayedOrder.shipping.city}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
