import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Smartphone,
  Wallet,
  Banknote,
  Lock,
  CheckCircle2,
  X,
} from 'lucide-react';
import { CartItem, PaymentMethodType, ShippingInfo, SmartphoneOrder } from '../types';
import {
  calculateCartTotals,
  createSmartphoneOrder,
  getPriceForStorage,
  validateCardDetails,
  validateShippingInfo,
} from '../utils/checkout';
import { formatPKR } from '../utils/whatsapp';
import { PROMO_LINEUP_IMAGE } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onOrderCompleted: (order: SmartphoneOrder) => void;
  onViewTrackOrder: (order: SmartphoneOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  onClose,
  onOrderCompleted,
  onViewTrackOrder,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    postalCode: '',
  });
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('Credit / Debit Card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardErrors, setCardErrors] = useState<{ cardNumber?: string; expiry?: string; cvv?: string }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<SmartphoneOrder | null>(null);

  useEffect(() => {
    if (isOpen && step !== 3) {
      setStep(1);
      setShippingErrors({});
      setCardErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totals = calculateCartTotals(items);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateShippingInfo(shipping);
    if (!res.isValid) {
      setShippingErrors(res.errors);
      return;
    }
    setShippingErrors({});
    setStep(2);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'Credit / Debit Card') {
      const cardRes = validateCardDetails({ cardNumber, expiry, cvv });
      if (!cardRes.isValid) {
        setCardErrors(cardRes.errors);
        return;
      }
    }
    setCardErrors({});
    setIsSubmitting(true);

    const newOrder = createSmartphoneOrder({
      items,
      shipping,
      paymentMethod,
    });

    // Notify backend demo endpoint without blocking user experience on network hiccups
    try {
      const firstItem = newOrder.items[0];
      await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: newOrder.orderId,
          customerName: newOrder.shipping.fullName,
          customerEmail: newOrder.shipping.email,
          customerPhone: newOrder.shipping.phone,
          deliveryAddress: `${newOrder.shipping.address}, ${newOrder.shipping.city} ${newOrder.shipping.postalCode}`,
          productId: firstItem?.productId || 'MULTI',
          productName:
            newOrder.items.length > 1
              ? `${firstItem?.name} (+${newOrder.items.length - 1} more)`
              : firstItem?.name || 'Smartphone',
          productCategory: firstItem?.brand || 'Smartphones',
          unitPrice: firstItem?.unitPrice || newOrder.totalAmount,
          quantity: newOrder.items.reduce((acc, it) => acc + it.quantity, 0),
          totalAmount: newOrder.totalAmount,
          paymentStatus: `CONFIRMED (${paymentMethod})`,
          orderDate: newOrder.createdAt,
        }),
      });
    } catch {
      // Offline-safe fallback; order state proceeds cleanly
    }

    setIsSubmitting(false);
    setCompletedOrder(newOrder);
    onOrderCompleted(newOrder);
    setStep(3);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div
        className="relative w-full max-w-2xl bg-[#111622] text-slate-100 rounded-3xl shadow-2xl overflow-hidden animate-modalReveal my-auto border border-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                aria-label="Back to Shipping"
                className="p-1.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-lg font-bold text-white">
              {step === 1 && 'Checkout'}
              {step === 2 && 'Payment Method'}
              {step === 3 && 'Order Confirmation'}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Step Visual Progress Bar matching Reference Screen 3 */}
        <div className="px-6 py-3.5 bg-[#0B0F17] border-b border-white/10">
          <div className="flex items-center justify-between max-w-md mx-auto text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[#0066FF] text-white">
                {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </span>
              <span className={step >= 1 ? 'text-white' : 'text-slate-500'}>Shipping</span>
            </div>

            <div className={`h-0.5 flex-1 mx-3 ${step >= 2 ? 'bg-[#0066FF]' : 'bg-white/15'}`} />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step > 2
                    ? 'bg-[#0066FF] text-white'
                    : step === 2
                    ? 'bg-[#0066FF] text-white'
                    : 'bg-white/15 text-slate-400'
                }`}
              >
                {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <span className={step >= 2 ? 'text-white' : 'text-slate-500'}>Payment</span>
            </div>

            <div className={`h-0.5 flex-1 mx-3 ${step === 3 ? 'bg-[#0066FF]' : 'bg-white/15'}`} />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step === 3 ? 'bg-[#0066FF] text-white' : 'bg-white/15 text-slate-400'
                }`}
              >
                {step === 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
              </span>
              <span className={step === 3 ? 'text-white' : 'text-slate-500'}>Confirmation</span>
            </div>
          </div>
        </div>

        {/* =======================================================
            STEP 1: SHIPPING ADDRESS + ORDER SUMMARY (Screen 3)
           ======================================================= */}
        {step === 1 && (
          <form onSubmit={handleShippingSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto" noValidate>
            <div>
              <h3 className="text-sm font-bold text-white mb-3">Shipping Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label htmlFor="ship-name" className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="ship-name"
                    type="text"
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    placeholder="Muhammad Yasir"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-[#090C12] text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] ${
                      shippingErrors.fullName ? 'border-red-500' : 'border-white/15'
                    }`}
                  />
                  {shippingErrors.fullName && (
                    <p className="text-xs text-red-400 mt-1">{shippingErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="ship-email" className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="ship-email"
                    type="email"
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    placeholder="customer@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-[#090C12] text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] ${
                      shippingErrors.email ? 'border-red-500' : 'border-white/15'
                    }`}
                  />
                  {shippingErrors.email && (
                    <p className="text-xs text-red-400 mt-1">{shippingErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="ship-phone" className="block text-xs font-medium text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="ship-phone"
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    placeholder="03293179587"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-[#090C12] text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] ${
                      shippingErrors.phone ? 'border-red-500' : 'border-white/15'
                    }`}
                  />
                  {shippingErrors.phone && (
                    <p className="text-xs text-red-400 mt-1">{shippingErrors.phone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="ship-address" className="block text-xs font-medium text-slate-300 mb-1">
                    Street Address
                  </label>
                  <input
                    id="ship-address"
                    type="text"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    placeholder="House 14, Street 6, DHA Phase 6"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-[#090C12] text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] ${
                      shippingErrors.address ? 'border-red-500' : 'border-white/15'
                    }`}
                  />
                  {shippingErrors.address && (
                    <p className="text-xs text-red-400 mt-1">{shippingErrors.address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="ship-city" className="block text-xs font-medium text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    id="ship-city"
                    type="text"
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    placeholder="Lahore"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-[#090C12] text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] ${
                      shippingErrors.city ? 'border-red-500' : 'border-white/15'
                    }`}
                  />
                  {shippingErrors.city && (
                    <p className="text-xs text-red-400 mt-1">{shippingErrors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="ship-postal" className="block text-xs font-medium text-slate-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    id="ship-postal"
                    type="text"
                    value={shipping.postalCode}
                    onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                    placeholder="54792"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-[#090C12] text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] font-mono ${
                      shippingErrors.postalCode ? 'border-red-500' : 'border-white/15'
                    }`}
                  />
                  {shippingErrors.postalCode && (
                    <p className="text-xs text-red-400 mt-1">{shippingErrors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Preview matching Screen 3 */}
            <div className="bg-[#0B0F17] border border-white/10 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Summary</h4>
              <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const unit = getPriceForStorage(
                    item.product.currentPrice,
                    item.product.storageOptions,
                    item.selectedStorage
                  );
                  return (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg bg-[#F4F7FB] border border-white/10 object-contain p-1 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{item.product.name}</p>
                          <p className="text-slate-400 truncate">
                            {item.selectedStorage} · Qty {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-white font-mono tabular-nums shrink-0">
                        {formatPKR(unit * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-400">Free</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-white">
                <span>Total</span>
                <span className="font-mono tabular-nums">{formatPKR(totals.total)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#0066FF] hover:bg-[#1A75FF] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* =======================================================
            STEP 2: PAYMENT METHOD (Screen 4)
           ======================================================= */}
        {step === 2 && (
          <form onSubmit={handleConfirmPayment} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto" noValidate>
            <div className="space-y-2.5">
              {(
                [
                  { id: 'Credit / Debit Card', icon: CreditCard, note: 'VISA · Mastercard' },
                  { id: 'EasyPaisa / JazzCash', icon: Smartphone, note: 'Instant Mobile Wallet' },
                  { id: 'Apple Pay', icon: Wallet, note: 'Express Touch / Face ID' },
                  { id: 'Cash on Delivery', icon: Banknote, note: 'Pay at Doorstep' },
                ] as const
              ).map((option) => {
                const Icon = option.icon;
                const isSelected = paymentMethod === option.id;
                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id)}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F2147] border-[#3B82F6] ring-2 ring-[#3B82F6]/25'
                        : 'bg-[#0B0F17] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#3B82F6]' : 'border-slate-500'
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />}
                      </span>
                      <span className="text-sm font-semibold text-white">{option.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{option.note}</span>
                      <Icon className="w-4 h-4 text-[#60A5FA]" />
                    </div>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'Credit / Debit Card' && (
              <div className="p-4 rounded-2xl bg-[#0B0F17] border border-white/10 space-y-3">
                <div>
                  <label htmlFor="card-num" className="block text-xs font-medium text-slate-300 mb-1">
                    Card Number
                  </label>
                  <input
                    id="card-num"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 5678 9012 3456"
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#090C12] text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-[#3B82F6] ${
                      cardErrors.cardNumber ? 'border-red-500' : 'border-white/15'
                    }`}
                  />
                  {cardErrors.cardNumber && (
                    <p className="text-xs text-red-400 mt-1">{cardErrors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="card-exp" className="block text-xs font-medium text-slate-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      id="card-exp"
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="04/28"
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#090C12] text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-[#3B82F6] ${
                        cardErrors.expiry ? 'border-red-500' : 'border-white/15'
                      }`}
                    />
                    {cardErrors.expiry && (
                      <p className="text-xs text-red-400 mt-1">{cardErrors.expiry}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="card-cvv" className="block text-xs font-medium text-slate-300 mb-1">
                      CVV
                    </label>
                    <input
                      id="card-cvv"
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#090C12] text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-[#3B82F6] ${
                        cardErrors.cvv ? 'border-red-500' : 'border-white/15'
                      }`}
                    />
                    {cardErrors.cvv && (
                      <p className="text-xs text-red-400 mt-1">{cardErrors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#0B0F17] border border-white/10 text-sm">
              <span className="font-medium text-slate-300">Payable Total</span>
              <span className="font-extrabold text-white font-mono tabular-nums">
                {formatPKR(totals.total)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-[#0066FF] hover:bg-[#1A75FF] text-white text-sm font-semibold transition-colors disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? 'Confirming Order...' : 'Confirm Payment'}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>Demo checkout encryption enabled — no real money is charged.</span>
            </div>
          </form>
        )}

        {/* =======================================================
            STEP 3: ORDER PLACED SUCCESSFULLY (Screen 5)
           ======================================================= */}
        {step === 3 && completedOrder && (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#0066FF] text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-bold text-white">Order Placed Successfully!</h3>
              <p className="text-sm text-slate-400">
                Thank you for your order, <strong className="text-white">{completedOrder.shipping.fullName}</strong>.
              </p>
              <p className="text-sm font-medium text-slate-400">
                Your order number is{' '}
                <span className="font-mono font-bold text-[#60A5FA]">{completedOrder.orderId}</span>
              </p>
            </div>

            <div className="max-w-sm mx-auto space-y-2.5 pt-2">
              <button
                onClick={() => onViewTrackOrder(completedOrder)}
                className="w-full py-3 px-6 rounded-xl bg-[#0066FF] hover:bg-[#1A75FF] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Track Your Order
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-xl bg-[#0B0F17] hover:bg-white/10 border border-white/15 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

            {/* Bottom Sealed Phone Box Visual */}
            <div className="pt-3">
              <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#041E5C] to-[#0052D4] text-white p-4 flex items-center justify-between gap-4 max-w-md mx-auto ring-1 ring-white/15">
                <div className="text-left">
                  <p className="text-xs font-semibold text-blue-200">Estimated Delivery</p>
                  <p className="text-sm font-bold">{completedOrder.estimatedDelivery}</p>
                </div>
                <img
                  src={PROMO_LINEUP_IMAGE}
                  alt="Enjoy your new smartphone"
                  className="w-24 h-12 rounded-lg object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
