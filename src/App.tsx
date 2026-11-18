import React, { useState, useRef, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import {
  POPULAR_SMARTPHONES,
  SMARTPHONES,
} from './data/products';
import {
  CartItem,
  SmartphoneBrand,
  SmartphoneModel,
  SmartphoneOrder,
} from './types';
import { createSmartphoneOrder } from './utils/checkout';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustSection } from './components/TrustSection';
import { PopularSmartphonesSection } from './components/PopularSmartphonesSection';
import { PromoBannerSection } from './components/PromoBannerSection';
import { ShopByBrandSection } from './components/ShopByBrandSection';
import { AboutUsSection } from './components/AboutUsSection';
import { VisitUsSection } from './components/VisitUsSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Pre-seeded demo order so "Track Order" works immediately even before placing a new order
const INITIAL_SAMPLE_ORDER: SmartphoneOrder = createSmartphoneOrder({
  orderId: '#YM-784512',
  items: [
    {
      product: SMARTPHONES[1], // iPhone 16 Pro
      quantity: 1,
      selectedStorage: '256GB',
      selectedColor: 'Natural Titanium',
    },
  ],
  shipping: {
    fullName: 'Sara Ahmed',
    email: 'sara.ahmed@example.com',
    address: '12 Commercial Area, Phase 6, DHA',
    city: 'Lahore',
    phone: '03293179587',
    postalCode: '54792',
  },
  paymentMethod: 'Credit / Debit Card',
});

export default function App() {
  // Catalog filter & search state
  const [selectedBrand, setSelectedBrand] = useState<SmartphoneBrand | 'All'>('Apple');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const brandSearchInputRef = useRef<HTMLInputElement | null>(null);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(['APP-02']);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartToast, setCartToast] = useState<string | null>(null);

  // PDP Modal state
  const [detailPhone, setDetailPhone] = useState<SmartphoneModel | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Multi-step Checkout Modal state (Shipping -> Payment -> Confirmation)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Order History & Live Track Order Modal state
  const [orders, setOrders] = useState<SmartphoneOrder[]>([INITIAL_SAMPLE_ORDER]);
  const [activeTrackOrder, setActiveTrackOrder] = useState<SmartphoneOrder | null>(INITIAL_SAMPLE_ORDER);
  const [isTrackOpen, setIsTrackOpen] = useState(false);

  // Google Maps Platform Demo Key quota banner state
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const onQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  const showToast = (msg: string) => {
    setCartToast(msg);
    setTimeout(() => {
      setCartToast((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  const handleToggleWishlist = (phoneId: string) => {
    setWishlistIds((prev) =>
      prev.includes(phoneId) ? prev.filter((id) => id !== phoneId) : [...prev, phoneId]
    );
  };

  const handleOpenPhoneDetail = (phone: SmartphoneModel) => {
    setDetailPhone(phone);
    setIsDetailOpen(true);
  };

  const addItemToCart = (
    phone: SmartphoneModel,
    storage: string = phone.defaultStorage,
    color: string = phone.defaultColor,
    quantity: number = 1
  ) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) =>
          it.product.id === phone.id &&
          it.selectedStorage === storage &&
          it.selectedColor === color
      );
      if (existingIdx >= 0) {
        return prev.map((it, i) =>
          i === existingIdx
            ? { ...it, quantity: Math.min(phone.stockCount, it.quantity + quantity) }
            : it
        );
      }
      return [...prev, { product: phone, quantity, selectedStorage: storage, selectedColor: color }];
    });
    showToast(`Added ${phone.name} (${storage}) to your cart`);
  };

  const handleQuickAdd = (phone: SmartphoneModel) => {
    addItemToCart(phone, phone.defaultStorage, phone.defaultColor, 1);
  };

  const handleAddFromDetail = (
    phone: SmartphoneModel,
    storage: string,
    color: string,
    quantity: number
  ) => {
    addItemToCart(phone, storage, color, quantity);
    setIsDetailOpen(false);
    setIsCartOpen(true);
  };

  const handleExpressBuyFromDetail = (
    phone: SmartphoneModel,
    storage: string,
    color: string,
    quantity: number
  ) => {
    addItemToCart(phone, storage, color, quantity);
    setIsDetailOpen(false);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setCartItems((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setCartItems((prev) =>
      prev.map((it, i) =>
        i === index ? { ...it, quantity: Math.min(it.product.stockCount, nextQuantity) } : it
      )
    );
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (newOrder: SmartphoneOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackOrder(newOrder);
    setCartItems([]);
  };

  const handleViewTrackOrderFromSuccess = (order: SmartphoneOrder) => {
    setActiveTrackOrder(order);
    setIsCheckoutOpen(false);
    setIsTrackOpen(true);
  };

  const handleSearchTrigger = () => {
    setSelectedBrand('All');
    const el = document.getElementById('shop-by-brand');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      brandSearchInputRef.current?.focus();
    }, 350);
  };

  const scrollToShopAll = () => {
    setSelectedBrand('All');
    const el = document.getElementById('shop-by-brand');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDeals = () => {
    setSelectedBrand('All');
    const el = document.getElementById('shop-by-brand');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);
  const wishlistPhones = SMARTPHONES.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#05070B] text-slate-100">
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Sticky Header */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTrackOrder={() => {
          setActiveTrackOrder(orders[0] || INITIAL_SAMPLE_ORDER);
          setIsTrackOpen(true);
        }}
        onSearchTrigger={handleSearchTrigger}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Cobalt Blue Hero Carousel Banner */}
        <HeroSection onSelectPhone={handleOpenPhoneDetail} />

        {/* 2. 4-Column Trust Features */}
        <TrustSection />

        {/* 3. Popular Smartphones Row */}
        <PopularSmartphonesSection
          phones={POPULAR_SMARTPHONES}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onSelectPhone={handleOpenPhoneDetail}
          onQuickAdd={handleQuickAdd}
          onViewAll={scrollToShopAll}
        />

        {/* 4. Mid-Page Up to 30% Off Blue Promotional Banner */}
        <PromoBannerSection onShopDeals={scrollToDeals} />

        {/* 5. Shop by Brand (6 Companies × 7-8 Models Each = 47 Smartphones) */}
        <ShopByBrandSection
          phones={SMARTPHONES}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onSelectPhone={handleOpenPhoneDetail}
          onQuickAdd={handleQuickAdd}
          searchInputRef={brandSearchInputRef}
        />

        {/* 6. About Us Section */}
        <AboutUsSection onBrowseCatalog={scrollToShopAll} />

        {/* 7. Visit Us, Showroom Map & Store Ratings Section */}
        {GOOGLE_MAPS_API_KEY ? (
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker']} language="en" region="PK">
            <VisitUsSection hasMapsApiKey={true} />
          </APIProvider>
        ) : (
          <VisitUsSection hasMapsApiKey={false} />
        )}
      </main>

      {/* Clean White Footer */}
      <Footer
        onSelectBrand={(brand) => setSelectedBrand(brand)}
        onOpenTrackOrder={() => {
          setActiveTrackOrder(orders[0] || INITIAL_SAMPLE_ORDER);
          setIsTrackOpen(true);
        }}
      />

      {/* Quick WhatsApp Support */}
      <FloatingWhatsAppButton />

      {/* Instant Cart Feedback Toast */}
      {cartToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-[#161D2C] border border-white/15 text-slate-100 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-medium animate-modalReveal"
        >
          <span>{cartToast}</span>
          <button
            onClick={() => {
              setCartToast(null);
              setIsCartOpen(true);
            }}
            className="text-[#60A5FA] hover:text-white font-semibold cursor-pointer whitespace-nowrap"
          >
            View Cart
          </button>
        </div>
      )}

      {/* =======================================================
          INTERACTIVE SCREENS FROM REFERENCE UI (6-SCREEN FLOW)
         ======================================================= */}

      {/* Screen 1: Product Detail View */}
      <ProductDetailModal
        phone={detailPhone}
        isOpen={isDetailOpen}
        isWishlisted={detailPhone ? wishlistIds.includes(detailPhone.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={handleAddFromDetail}
        onBuyNow={handleExpressBuyFromDetail}
      />

      {/* Screen 2: Your Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        phones={wishlistPhones}
        onClose={() => setIsWishlistOpen(false)}
        onRemove={handleToggleWishlist}
        onAddToCart={(phone) => {
          handleQuickAdd(phone);
          setIsWishlistOpen(false);
          setIsCartOpen(true);
        }}
        onSelectPhone={handleOpenPhoneDetail}
      />

      {/* Screens 3, 4 & 5: Multi-Step Checkout (Shipping -> Payment -> Order Placed Successfully) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={cartItems}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
        onViewTrackOrder={handleViewTrackOrderFromSuccess}
      />

      {/* Screen 6: Live Track Your Order Timeline & Delivery Map */}
      <TrackOrderModal
        isOpen={isTrackOpen}
        orders={orders}
        activeOrder={activeTrackOrder}
        onClose={() => setIsTrackOpen(false)}
      />
    </div>
  );
}
