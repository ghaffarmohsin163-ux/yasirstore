import { CartItem, PaymentMethodType, ShippingInfo, SmartphoneOrder } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ShippingInfo, string>>;
}

export interface CardDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface CardValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof CardDetails, string>>;
}

/**
 * Validates shipping checkout fields strictly without bypassing empty fields.
 */
export function validateShippingInfo(info: ShippingInfo): ValidationResult {
  const errors: Partial<Record<keyof ShippingInfo, string>> = {};

  if (!info.fullName || info.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!info.email || !emailRegex.test(info.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!info.address || info.address.trim().length < 6) {
    errors.address = 'Please enter your complete street address';
  }

  if (!info.city || info.city.trim().length < 2) {
    errors.city = 'Please enter your city';
  }

  const digitsOnly = info.phone ? info.phone.replace(/\D/g, '') : '';
  if (!info.phone || digitsOnly.length < 10 || digitsOnly.length > 14) {
    errors.phone = 'Enter a valid phone number (10–14 digits)';
  }

  if (!info.postalCode || info.postalCode.trim().length < 4) {
    errors.postalCode = 'Enter a valid postal code';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates card fields when Credit / Debit Card is chosen.
 */
export function validateCardDetails(card: CardDetails): CardValidationResult {
  const errors: Partial<Record<keyof CardDetails, string>> = {};
  const cleanNum = card.cardNumber.replace(/\s+/g, '');
  if (!/^\d{13,19}$/.test(cleanNum)) {
    errors.cardNumber = 'Enter a valid 13–19 digit card number';
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry.trim())) {
    errors.expiry = 'Use MM/YY format';
  }
  if (!/^\d{3,4}$/.test(card.cvv.trim())) {
    errors.cvv = '3 or 4 digit CVV';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Computes storage-adjusted price cleanly (Base = defaultStorage; higher tier adds realistic delta).
 */
export function getPriceForStorage(basePrice: number, storageOptions: string[], selectedStorage: string): number {
  const index = storageOptions.indexOf(selectedStorage);
  if (index <= 0) return basePrice;
  return basePrice + index * 25000;
}

/**
 * Computes cart subtotal and shipping (free nationwide over PKR 50,000, else PKR 0 promotional free shipping).
 */
export function calculateCartTotals(items: CartItem[]): { subtotal: number; shippingFee: number; total: number } {
  const subtotal = items.reduce((sum, item) => {
    const unit = getPriceForStorage(item.product.currentPrice, item.product.storageOptions, item.selectedStorage);
    return sum + unit * item.quantity;
  }, 0);

  const shippingFee = 0; // Free nationwide express smartphone shipping
  return {
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
  };
}

/**
 * Generates unique Yasir Mobile Store order number (#YM-XXXXXX).
 */
export function generateMobileOrderId(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `#YM-${randomDigits}`;
}

/**
 * Formats estimated delivery date string 2 days ahead.
 */
export function getEstimatedDeliveryDate(baseDate: Date = new Date()): string {
  const target = new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000);
  return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Creates a complete SmartphoneOrder with initial 5-stage tracking timeline.
 */
export function createSmartphoneOrder(params: {
  items: CartItem[];
  shipping: ShippingInfo;
  paymentMethod: PaymentMethodType;
  orderId?: string;
  now?: Date;
}): SmartphoneOrder {
  const now = params.now || new Date();
  const totals = calculateCartTotals(params.items);
  const orderId = params.orderId || generateMobileOrderId();
  const formattedNow = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }) + ', ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const estDate = getEstimatedDeliveryDate(now);

  return {
    orderId,
    shipping: {
      fullName: params.shipping.fullName.trim(),
      email: params.shipping.email.trim(),
      address: params.shipping.address.trim(),
      city: params.shipping.city.trim(),
      phone: params.shipping.phone.trim(),
      postalCode: params.shipping.postalCode.trim(),
    },
    paymentMethod: params.paymentMethod,
    items: params.items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      brand: item.product.brand,
      storage: item.selectedStorage,
      color: item.selectedColor,
      unitPrice: getPriceForStorage(item.product.currentPrice, item.product.storageOptions, item.selectedStorage),
      quantity: item.quantity,
      image: item.product.images[0]?.url || '',
    })),
    subtotal: totals.subtotal,
    shippingFee: totals.shippingFee,
    totalAmount: totals.total,
    estimatedDelivery: estDate,
    createdAt: formattedNow,
    timeline: [
      {
        stage: 'Order Placed',
        timestamp: formattedNow,
        completed: true,
        note: 'Order verified at Yasir Mobile Store',
      },
      {
        stage: 'Processing',
        timestamp: formattedNow,
        completed: true,
        note: 'Sealed box inspection & IMEI check completed',
      },
      {
        stage: 'Shipped',
        timestamp: 'Dispatched from Lahore Hub',
        completed: true,
        note: 'Express courier pickup confirmed',
      },
      {
        stage: 'Out for Delivery',
        timestamp: `Expected ${estDate}`,
        completed: false,
        note: 'Courier will call prior to doorstep arrival',
      },
      {
        stage: 'Delivered',
        timestamp: 'Pending signature',
        completed: false,
        note: 'Handover with official warranty card',
      },
    ],
  };
}
