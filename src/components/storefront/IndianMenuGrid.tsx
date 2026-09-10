'use client';

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import { DraggableFoodCard } from './DraggableFoodCard';
import { useGsapFlip } from '@/hooks/useGsapFlip';
import type { MenuItem } from '@/types/menu';

interface IndianMenuGridProps {
  initialItems: MenuItem[];
}

const CATEGORIES = ['All', 'Biryani', 'Curries', 'Breads', 'Desserts & Beverages'];

export function IndianMenuGrid({ initialItems }: IndianMenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q));

      const matchesVeg = !vegOnly || item.isVeg;

      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [initialItems, selectedCategory, searchQuery, vegOnly]);

  const { containerRef, captureSnapshot } = useGsapFlip([selectedCategory, vegOnly, searchQuery]);

  const handleCategoryChange = (cat: string) => {
    captureSnapshot();
    setSelectedCategory(cat);
  };

  const handleVegToggle = () => {
    captureSnapshot();
    setVegOnly((prev) => !prev);
  };

  return (
    <div className="space-y-8">
      {/* Category Pills & Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 select-none ${
                  isSelected
                    ? 'bg-[#FF5E00] text-white shadow-lg shadow-[#FF5E00]/25 scale-105'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search & Veg Filter */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleVegToggle}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition ${
              vegOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Pure Veg</span>
          </button>

          <div className="relative flex-1 sm:w-64">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                captureSnapshot();
                setSearchQuery(e.target.value);
              }}
              placeholder="Search biryani, dal sambar, aloo..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#FF5E00] shadow-sm transition"
            />
          </div>
        </div>
      </div>

      {/* Drag & Drop Hint Banner */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-[#FF5E00]/20 text-xs">
        <div className="flex items-center gap-2 text-stone-700 font-medium">
          <Sparkles size={16} className="text-[#FF5E00]" />
          <span>
            <strong className="text-[#FF5E00] font-bold">Interactive Experience:</strong> Drag any
            dish card down into the floating cart at the bottom to add it to your order!
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider text-stone-400">
          Powered by GSAP Draggable
        </span>
      </div>

      {/* Grid of Dishes with Flip Animation */}
      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative min-h-[300px]"
      >
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-20 text-center text-stone-400 font-medium bg-white rounded-3xl border border-stone-200">
            No Indian dishes found matching your selection. Try searching for &ldquo;biryani&rdquo;,
            &ldquo;sambar&rdquo;, or &ldquo;aloo&rdquo;.
          </div>
        ) : (
          filteredItems.map((item) => <DraggableFoodCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
