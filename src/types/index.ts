export type SmartphoneBrand =
  | 'Apple'
  | 'Samsung'
  | 'Google'
  | 'OnePlus'
  | 'Xiaomi'
  | 'realme';

export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

export interface SmartphoneSpecs {
  display: string;
  storage: string;
  chipset: string;
  network: string;
  camera: string;
  battery: string;
}

export interface SmartphoneModel {
  id: string;
  brand: SmartphoneBrand;
  name: string;
  storageOptions: string[];
  defaultStorage: string;
  colors: ColorOption[];
  defaultColor: string;
  currentPrice: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCountText: string;
  badgeText?: string; // e.g. 'Best Seller' or 'New Arrival'
  isPopular?: boolean;
  isDeal?: boolean;
  stockCount: number;
  shortDescription: string;
  images: {
    url: string;
    alt: string;
    label: string;
  }[];
  specs: SmartphoneSpecs;
}

export interface CartItem {
  product: SmartphoneModel;
  quantity: number;
  selectedStorage: string;
  selectedColor: string;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  phone: string;
  postalCode: string;
}

export type PaymentMethodType =
  | 'Credit / Debit Card'
  | 'EasyPaisa / JazzCash'
  | 'Apple Pay'
  | 'Cash on Delivery';

export type OrderTrackingStage =
  | 'Order Placed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderTimelineEntry {
  stage: OrderTrackingStage;
  timestamp: string;
  completed: boolean;
  note: string;
}

export interface SmartphoneOrder {
  orderId: string;
  shipping: ShippingInfo;
  paymentMethod: PaymentMethodType;
  items: {
    productId: string;
    name: string;
    brand: SmartphoneBrand;
    storage: string;
    color: string;
    unitPrice: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  estimatedDelivery: string;
  createdAt: string;
  timeline: OrderTimelineEntry[];
}

export interface BrandMeta {
  id: string;
  name: SmartphoneBrand;
  tagline: string;
  accentColor: string;
}
