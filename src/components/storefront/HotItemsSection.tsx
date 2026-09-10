'use client';

import React, { useState, useEffect } from 'react';
import { getMenuItems } from '@/lib/api';
import { IndianMenuGrid } from './IndianMenuGrid';
import { Loader2 } from 'lucide-react';
import type { MenuItem } from '@/types/menu';

export function HotItemsSection() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenuItems()
      .then((res) => {
        setItems(res.items || []);
      })
      .catch((err) => {
        console.error('Failed to load Indian menu items', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="menuSection" className="py-16 sm:py-24 bg-[#FFFDF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF5E00]/10 text-[#FF5E00] text-xs font-black tracking-widest uppercase">
            CurryCraft Heritage Menu
          </span>
          <h2 className="text-3xl sm:text-5xl font-outfit font-black text-[#1A1311] tracking-tight">
            Authentic Regional Indian Cuisine
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
            Slow-cooked royal dum biryanis, velvety tandoor-fired curries, comforting home-style
            dals, and festive sweets. Drag any dish directly into your cart!
          </p>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#FF5E00]" />
            <p className="text-sm text-neutral-500 mt-2 font-medium">
              Simmering the royal Indian catalog...
            </p>
          </div>
        ) : (
          <IndianMenuGrid initialItems={items} />
        )}
      </div>
    </section>
  );
}
