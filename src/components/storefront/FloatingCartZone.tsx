'use client';

import React from 'react';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatINR } from '@/lib/utils';

export function FloatingCartZone() {
  const totalCount = useCartStore((state) => state.totalCount);
  const subtotal = useCartStore((state) => state.subtotal);
  const openCart = useCartStore((state) => state.openCart);

  return (
    <div className="fixed bottom-[max(1rem,calc(0.75rem+env(safe-area-inset-bottom,0px)))] left-1/2 -translate-x-1/2 z-40 w-[94%] sm:w-[92%] max-w-lg pointer-events-auto">
      <div
        id="floating-cart-zone"
        onClick={openCart}
        role="button"
        tabIndex={0}
        aria-label={`Shopping cart with ${totalCount} items. Total ${formatINR(subtotal)}`}
        className="group relative flex items-center justify-between gap-3 p-3 sm:p-4 rounded-3xl bg-[#1A1311]/95 text-white border-2 border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-300 cursor-pointer select-none hover:border-[#FF5E00]/50 hover:shadow-[#FF5E00]/20 active:scale-[0.99] min-h-[56px]"
      >
        {/* Glowing pulse on drag collision */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#FF5E00]/0 via-[#FF5E00]/20 to-[#FF5E00]/0 opacity-0 group-[.cart-zone--hovered]:opacity-100 transition-opacity pointer-events-none" />

        {/* Left: Cart Icon & Count */}
        <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 min-w-0">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-2xl bg-gradient-to-br from-[#FF5E00] to-[#D94800] flex items-center justify-center text-white shadow-lg shadow-[#FF5E00]/30 group-hover:scale-105 transition-transform">
            <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-[#FF5E00] font-black text-[11px] flex items-center justify-center shadow-md animate-in zoom-in-50">
                {totalCount}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[11px] sm:text-xs font-bold text-[#FFB088] uppercase tracking-wider truncate">
                Gourmet Cart
              </span>
              <Sparkles size={11} className="text-[#FF8516] shrink-0" />
            </div>
            <p className="text-xs sm:text-sm font-black font-display text-white truncate">
              {totalCount > 0 ? (
                <span>
                  {totalCount} {totalCount === 1 ? 'Dish' : 'Dishes'} • {formatINR(subtotal)}
                </span>
              ) : (
                <span className="text-white/60 text-[11px] sm:text-xs font-medium">
                  Drop dishes or tap to view
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Drop instructions & Action button */}
        <div className="flex items-center gap-2 relative z-10 shrink-0">
          <span className="hidden md:inline-block text-[11px] font-medium text-white/50 px-2 py-1 rounded-lg bg-white/5 border border-white/5 group-[.cart-zone--hovered]:text-white group-[.cart-zone--hovered]:bg-[#FF5E00]/30">
            🎯 Drop Target
          </span>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-xl bg-white/10 group-hover:bg-[#FF5E00] text-white text-xs font-bold transition-all shadow-sm min-h-[40px] active:scale-95"
          >
            <span>Bag</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
