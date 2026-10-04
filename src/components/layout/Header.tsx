'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { SearchModal } from '@/components/storefront/SearchModal';
import { KitchenHubBadge } from '@/components/hub/KitchenHubBadge';

interface HeaderProps {
  onExploreClick?: () => void;
}

export function Header({ onExploreClick }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { safeTotalCount, toggleCart } = useCart();

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E8E5E0]/70 transition-all pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Hub Badge */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1311] hover:opacity-90 transition-opacity min-h-[44px]"
              aria-label="CurryCraft Indian Cuisine Home"
            >
              <span className="w-10 h-10 text-2xl flex items-center justify-center">🍛</span>
              <span className="font-outfit font-black tracking-tight text-stone-900">CurryCraft</span>
            </Link>

            <div className="hidden sm:block">
              <KitchenHubBadge />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#1A1311]/80"
            aria-label="Main Navigation"
          >
            <Link href="/#heroSection" className="hover:text-[#FF5E00] transition-colors py-2">
              Home
            </Link>
            <Link href="/#menuSection" className="hover:text-[#FF5E00] transition-colors py-2">
              Indian Menu
            </Link>
            <Link href="/#promoSection" className="hover:text-[#FF5E00] transition-colors py-2">
              Special Offers
            </Link>
            <Link href="/#whoWeAreSection" className="hover:text-[#FF5E00] transition-colors py-2">
              About Us
            </Link>
            <Link
              href="/portal"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FF8516]/10 text-[#FF5E00] hover:bg-[#FF8516]/20 transition-colors font-bold min-h-[40px]"
              title="Customer Order Food & Tracking Portal"
            >
              <span>👤 Customer Portal</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 transition-colors font-bold min-h-[40px]"
              title="Kitchen Dispatch & Analytics Dashboard"
            >
              <span>🛠️ Admin Panel</span>
            </Link>
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Trigger Button (44px touch target) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#1A1311] hover:bg-black/5 hover:text-[#FF5E00] active:scale-95 transition-all"
              aria-label="Search menu"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Bag Trigger (44px touch target) */}
            <button
              onClick={toggleCart}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#1A1311] hover:bg-black/5 hover:text-[#FF5E00] active:scale-95 transition-all"
              aria-label={`View shopping bag, ${safeTotalCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {safeTotalCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#FF5E00] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-[#FFFDF9] animate-pulse">
                  {safeTotalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button (44px touch target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#1A1311] hover:bg-black/5 active:scale-95 transition-all"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 top-20 bg-black/40 backdrop-blur-xs z-30 lg:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="relative z-40 lg:hidden bg-[#FFFDF9] border-b border-[#E8E5E0] px-6 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[calc(100dvh-5rem)] overflow-y-auto">
            <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Dispatch Kitchen:</span>
              <KitchenHubBadge />
            </div>

            <div className="flex flex-col space-y-2 font-semibold text-base">
              <Link
                href="/#heroSection"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3 rounded-xl hover:bg-stone-100 hover:text-[#FF5E00] active:bg-orange-50 transition-colors min-h-[44px] flex items-center"
              >
                Home
              </Link>
              <Link
                href="/#menuSection"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3 rounded-xl hover:bg-stone-100 hover:text-[#FF5E00] active:bg-orange-50 transition-colors min-h-[44px] flex items-center"
              >
                Shop &amp; Menu
              </Link>
              <Link
                href="/#promoSection"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3 rounded-xl hover:bg-stone-100 hover:text-[#FF5E00] active:bg-orange-50 transition-colors min-h-[44px] flex items-center"
              >
                Special Offers (50% Off)
              </Link>
              <Link
                href="/#whoWeAreSection"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3 rounded-xl hover:bg-stone-100 hover:text-[#FF5E00] active:bg-orange-50 transition-colors min-h-[44px] flex items-center"
              >
                About Us
              </Link>
              <div className="pt-3 border-t border-[#E8E5E0] flex flex-col gap-3">
                <Link
                  href="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3.5 rounded-2xl bg-[#FF5E00]/10 text-[#FF5E00] font-bold text-center active:bg-[#FF5E00]/20 min-h-[48px] flex items-center justify-center transition-colors"
                >
                  👤 Customer Portal (Order &amp; Track)
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3.5 rounded-2xl bg-emerald-500/10 text-emerald-700 font-bold text-center active:bg-emerald-500/20 min-h-[48px] flex items-center justify-center transition-colors"
                >
                  🛠️ Admin Kitchen &amp; Analytics
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Real-Time Search Modal */}
      {isSearchOpen && <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
