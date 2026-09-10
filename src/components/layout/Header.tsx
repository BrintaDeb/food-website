'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { SearchModal } from '@/components/storefront/SearchModal';

interface HeaderProps {
  onExploreClick?: () => void;
}

export function Header({ onExploreClick }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { safeTotalCount, toggleCart } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E8E5E0]/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1311] hover:opacity-90 transition-opacity"
            aria-label="CurryCraft Indian Cuisine Home"
          >
            <span className="w-10 h-10 text-2xl flex items-center justify-center">🍛</span>
            <span className="font-outfit font-black tracking-tight text-stone-900">CurryCraft</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#1A1311]/80"
            aria-label="Main Navigation"
          >
            <Link href="/#heroSection" className="hover:text-[#FF5E00] transition-colors">
              Home
            </Link>
            <Link href="/#menuSection" className="hover:text-[#FF5E00] transition-colors">
              Indian Menu
            </Link>
            <Link href="/#promoSection" className="hover:text-[#FF5E00] transition-colors">
              Special Offers
            </Link>
            <Link href="/#whoWeAreSection" className="hover:text-[#FF5E00] transition-colors">
              About Us
            </Link>
            <Link
              href="/portal"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF8516]/10 text-[#FF5E00] hover:bg-[#FF8516]/20 transition-colors font-bold"
              title="Customer Order Food & Tracking Portal"
            >
              <span>👤 Customer Portal</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 transition-colors font-bold"
              title="Kitchen Dispatch & Analytics Dashboard"
            >
              <span>🛠️ Admin Panel</span>
            </Link>
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full text-[#1A1311] hover:bg-black/5 hover:text-[#FF5E00] transition-colors"
              aria-label="Search menu"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Bag Trigger */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-full text-[#1A1311] hover:bg-black/5 hover:text-[#FF5E00] transition-colors"
              aria-label={`View shopping bag, ${safeTotalCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {safeTotalCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#FF5E00] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-[#FFFDF9] animate-pulse">
                  {safeTotalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full text-[#1A1311] hover:bg-black/5 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFFDF9] border-b border-[#E8E5E0] px-6 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-3 font-semibold text-base">
              <Link
                href="/#heroSection"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#FF5E00] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/#hotItemsSection"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#FF5E00] transition-colors"
              >
                Shop & Menu
              </Link>
              <Link
                href="/#promoSection"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#FF5E00] transition-colors"
              >
                Special Offers (50% Off)
              </Link>
              <Link
                href="/#whoWeAreSection"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#FF5E00] transition-colors"
              >
                About Us
              </Link>
              <div className="pt-2 border-t border-[#E8E5E0] flex flex-col gap-2.5">
                <Link
                  href="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#FF5E00]/10 text-[#FF5E00] font-bold text-center"
                >
                  👤 Customer Portal (Order & Track)
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 font-bold text-center"
                >
                  🛠️ Admin Kitchen & Analytics
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
