import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Smartphone, PackageCheck } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenTrackOrder: () => void;
  onSearchTrigger: () => void;
}

export const YasirMobileLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <Smartphone className={className} strokeWidth={2.1} aria-hidden="true" />
);

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenTrackOrder,
  onSearchTrigger,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow duration-200 bg-[#090C12]/95 backdrop-blur-md border-b border-white/10 ${
        isScrolled ? 'shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)]' : ''
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-6 lg:gap-8 h-16 sm:h-18">
          {/* Zone 1: Brand Mark (single-line wordmark per Top Bar Contract) */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('hero');
            }}
            className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0 group min-w-0"
          >
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shadow-xs group-hover:bg-[#1A75FF] transition-colors shrink-0">
              <YasirMobileLogoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white">
              Yasir Mobile Store
            </span>
          </a>

          {/* Zone 2: 5 Clean Single-Line Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => scrollTo('hero')}
              className="hover:text-[#60A5FA] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('popular-smartphones')}
              className="hover:text-[#60A5FA] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
            >
              Shop
            </button>
            <button
              onClick={() => scrollTo('shop-by-brand')}
              className="hover:text-[#60A5FA] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
            >
              Brands
            </button>
            <button
              onClick={() => scrollTo('about-us')}
              className="hover:text-[#60A5FA] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
            >
              About Us
            </button>
            <button
              onClick={() => scrollTo('visit-us')}
              className="hover:text-[#60A5FA] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
            >
              Visit Us
            </button>
          </nav>

          {/* Zone 3: Interactive Utility Icons (Search, Wishlist, Cart) */}
          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            <button
              onClick={onSearchTrigger}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label="Search smartphones"
              title="Search smartphones"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <button
              onClick={onOpenWishlist}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label={`Wishlist, ${wishlistCount} saved`}
              title="Wishlist"
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 min-w-4 h-4 px-1 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenCart}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label={`Your cart, ${cartCount} items`}
              title="Your Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 min-w-4 h-4 px-1 bg-[#0066FF] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0B0F17] px-4 py-4 shadow-2xl animate-modalReveal">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => scrollTo('hero')}
              className="px-3 py-2.5 rounded-lg text-left text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('popular-smartphones')}
              className="px-3 py-2.5 rounded-lg text-left text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Shop
            </button>
            <button
              onClick={() => scrollTo('shop-by-brand')}
              className="px-3 py-2.5 rounded-lg text-left text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Brands
            </button>
            <button
              onClick={() => scrollTo('about-us')}
              className="px-3 py-2.5 rounded-lg text-left text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              About Us
            </button>
            <button
              onClick={() => scrollTo('visit-us')}
              className="px-3 py-2.5 rounded-lg text-left text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Visit Us
            </button>
            <button
              onClick={() => scrollTo('shop-by-brand')}
              className="px-3 py-2.5 rounded-lg text-left text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Deals
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackOrder();
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm font-semibold text-[#60A5FA] hover:bg-[#0066FF]/15"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Track Order</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
