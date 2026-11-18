import React, { useMemo } from 'react';
import { Search, X, SlidersHorizontal, Smartphone } from 'lucide-react';
import { BRANDS } from '../data/products';
import { SmartphoneBrand, SmartphoneModel } from '../types';
import { SmartphoneCard } from './SmartphoneCard';

interface ShopByBrandSectionProps {
  phones: SmartphoneModel[];
  selectedBrand: SmartphoneBrand | 'All';
  onSelectBrand: (brand: SmartphoneBrand | 'All') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating';
  onSortChange: (sort: 'featured' | 'price-low' | 'price-high' | 'rating') => void;
  wishlistIds: string[];
  onToggleWishlist: (phoneId: string) => void;
  onSelectPhone: (phone: SmartphoneModel) => void;
  onQuickAdd: (phone: SmartphoneModel) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

const BrandEmblem: React.FC<{ brand: SmartphoneBrand }> = ({ brand }) => {
  switch (brand) {
    case 'Apple':
      return (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current text-white" aria-hidden="true">
          <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
        </svg>
      );
    case 'Samsung':
      return (
        <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase px-2 py-0.5 rounded bg-[#1428A0] text-white">
          SAMSUNG
        </span>
      );
    case 'Google':
      return (
        <span className="w-8 h-8 rounded-full bg-[#161D2C] border border-white/15 flex items-center justify-center text-lg font-extrabold text-[#60A5FA]">
          G
        </span>
      );
    case 'OnePlus':
      return (
        <span className="w-8 h-8 rounded-md border-2 border-[#EF4444] text-[#EF4444] flex items-center justify-center text-xs font-extrabold">
          1+
        </span>
      );
    case 'Xiaomi':
      return (
        <span className="w-8 h-8 rounded-lg bg-[#FF6900] text-white flex items-center justify-center text-xs font-extrabold">
          mi
        </span>
      );
    case 'realme':
      return (
        <span className="px-2.5 py-0.5 rounded bg-[#FACC15] text-[#0F172A] text-xs font-extrabold tracking-tight">
          realme
        </span>
      );
  }
};

export const ShopByBrandSection: React.FC<ShopByBrandSectionProps> = ({
  phones,
  selectedBrand,
  onSelectBrand,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  wishlistIds,
  onToggleWishlist,
  onSelectPhone,
  onQuickAdd,
  searchInputRef,
}) => {
  const filteredPhones = useMemo(() => {
    return phones
      .filter((p) => {
        if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.specs.chipset.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.currentPrice - b.currentPrice;
        if (sortBy === 'price-high') return b.currentPrice - a.currentPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [phones, selectedBrand, searchQuery, sortBy]);

  return (
    <section id="shop-by-brand" className="bg-[#05070B] pt-10 sm:pt-12 pb-14 sm:pb-16 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight">
            Shop by Brand
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Explore 7–8 models from every major smartphone company.
          </p>
        </div>

        {/* 6 Interactive Brand Tiles matching Reference Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8">
          {BRANDS.map((brand) => {
            const count = phones.filter((p) => p.brand === brand.name).length;
            const isActive = selectedBrand === brand.name;
            return (
              <button
                key={brand.id}
                onClick={() => onSelectBrand(isActive ? 'All' : brand.name)}
                aria-pressed={isActive}
                className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-b from-[#0F2147] to-[#111622] border-[#3B82F6] ring-2 ring-[#3B82F6]/25 shadow-md -translate-y-0.5'
                    : 'bg-[#111622] border-white/10 hover:bg-[#161D2C] hover:border-white/20'
                }`}
              >
                <div className="h-9 flex items-center justify-center">
                  <BrandEmblem brand={brand.name} />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-semibold text-white">{brand.name}</span>
                  <span className="block text-[11px] text-slate-400 tabular-nums">{count} Models</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filter, Search & Sort Toolbar */}
        <div className="bg-[#0E131E] border border-white/10 rounded-2xl p-4 mb-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Segmented Brand Quick Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => onSelectBrand('All')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedBrand === 'All'
                  ? 'bg-[#0066FF] text-white shadow-2xs'
                  : 'bg-[#161D2C] text-slate-300 border border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              All Companies ({phones.length})
            </button>
            {BRANDS.map((brand) => {
              const count = phones.filter((p) => p.brand === brand.name).length;
              const isActive = selectedBrand === brand.name;
              return (
                <button
                  key={brand.id}
                  onClick={() => onSelectBrand(brand.name)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0066FF] text-white shadow-2xs'
                      : 'bg-[#161D2C] text-slate-300 border border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {brand.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search model or chipset..."
                aria-label="Search smartphone models"
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#090C12] border border-white/15 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3B82F6]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                aria-label="Sort smartphones"
                className="bg-[#090C12] border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#3B82F6] cursor-pointer"
              >
                <option value="featured" className="bg-[#090C12] text-white">Featured Models</option>
                <option value="price-low" className="bg-[#090C12] text-white">Price: Low to High</option>
                <option value="price-high" className="bg-[#090C12] text-white">Price: High to Low</option>
                <option value="rating" className="bg-[#090C12] text-white">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Catalog Summary Line */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 px-1 text-xs text-slate-400">
          <span>
            Showing <strong className="text-white tabular-nums">{filteredPhones.length}</strong>{' '}
            {selectedBrand === 'All' ? 'Smartphones across all 6 companies' : `${selectedBrand} Smartphones`} · PTA Approved &amp; Box Packed
          </span>
          {(selectedBrand !== 'All' || searchQuery.trim() !== '') && (
            <button
              onClick={() => {
                onSelectBrand('All');
                onSearchChange('');
              }}
              className="text-[#60A5FA] hover:text-blue-300 font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Active Brand Models Grid (7-8 models per brand, or all 47) */}
        {filteredPhones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPhones.map((phone) => (
              <SmartphoneCard
                key={phone.id}
                phone={phone}
                isWishlisted={wishlistIds.includes(phone.id)}
                onToggleWishlist={onToggleWishlist}
                onSelectPhone={onSelectPhone}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#111622] border border-white/10 rounded-2xl p-12 text-center">
            <Smartphone className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No smartphone models matched</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Try clearing your search or selecting another brand.
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onSelectBrand('All');
              }}
              className="px-5 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-semibold hover:bg-[#1A75FF] cursor-pointer"
            >
              Show All {phones.length} Models
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
