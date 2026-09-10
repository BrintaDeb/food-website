'use client';

import React from 'react';
import Image from 'next/image';
import { Leaf, Flame, Clock, Star, Plus, GripVertical } from 'lucide-react';
import { useDraggableItem } from '@/hooks/useDraggableCart';
import { useCartStore } from '@/store/useCartStore';
import { formatINR } from '@/lib/utils';
import { toast } from '@/lib/toast';
import type { MenuItem } from '@/types/menu';

interface DraggableFoodCardProps {
  item: MenuItem;
}

export function DraggableFoodCard({ item }: DraggableFoodCardProps) {
  const { cardRef } = useDraggableItem(item);
  const addItem = useCartStore((state) => state.addItem);

  const handleManualAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image
      },
      { openDrawer: false }
    );
    toast.show(`Added "${item.name}" to bag! 🍛`, 'success');
  };

  const imgSrc = item.image.startsWith('/') ? item.image : `/${item.image}`;

  return (
    <div
      ref={cardRef}
      className="flip-card-item relative flex flex-col justify-between p-5 rounded-3xl bg-white border border-[#EBE7DF] shadow-sm hover:shadow-xl transition-shadow duration-300 select-none group touch-pan-y will-change-transform transform-gpu"
    >
      <div>
        {/* Top Badges: Veg/Non-veg & Category & Drag Handle */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {item.isVeg ? (
              <span
                title="Vegetarian"
                className="w-5 h-5 rounded-md border border-emerald-600 flex items-center justify-center p-0.5"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              </span>
            ) : (
              <span
                title="Non-Vegetarian"
                className="w-5 h-5 rounded-md border border-red-600 flex items-center justify-center p-0.5"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              </span>
            )}

            <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF5E00] text-[11px] font-bold">
              {item.category}
            </span>

            {item.badge && (
              <span className="px-2 py-0.5 rounded-full bg-[#1A1311] text-white text-[10px] font-black uppercase tracking-wider">
                {item.badge}
              </span>
            )}
          </div>

          <div
            title="Drag this dish into the floating cart"
            className="flex items-center gap-1 text-[11px] font-semibold text-stone-400 group-hover:text-[#FF5E00] bg-stone-50 group-hover:bg-orange-50 px-2 py-1 rounded-xl transition-colors cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={14} />
            <span className="hidden sm:inline">Drag to Cart</span>
          </div>
        </div>

        {/* Dish Image */}
        <div className="relative w-full h-40 my-3 flex items-center justify-center pointer-events-none">
          <Image
            src={imgSrc}
            alt={item.name}
            width={160}
            height={140}
            style={{ width: 'auto', height: 'auto', maxHeight: '140px' }}
            className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
        </div>

        {/* Title, Rating & Spice */}
        <div className="flex items-start justify-between gap-2 mt-1">
          <h3 className="font-outfit font-black text-lg text-[#1A1311] group-hover:text-[#FF5E00] transition-colors leading-tight">
            {item.name}
          </h3>

          {item.rating && (
            <div className="flex items-center gap-1 text-xs font-bold text-stone-700 shrink-0 bg-stone-100 px-2 py-0.5 rounded-lg">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              <span>{item.rating}</span>
            </div>
          )}
        </div>

        {/* Spice Level & Prep Time */}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-500">
          <div className="flex items-center gap-1 font-medium">
            <Clock size={12} className="text-stone-400" />
            <span>{item.prepTime}</span>
          </div>

          {item.spiceLevel && (
            <div
              className="flex items-center gap-0.5 text-orange-500 font-semibold"
              title={`Spice Level: ${item.spiceLevel}/3`}
            >
              {Array.from({ length: item.spiceLevel }).map((_, i) => (
                <Flame key={i} size={12} className="fill-orange-500" />
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Authentic Tags (Aloo, Egg, Fragrant, Sambar, etc.) */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-[#F5F2EC] text-[#594E46] text-[10px] font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Pricing & Add Button */}
      <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-stone-400 uppercase font-bold block">Price</span>
          <span className="font-outfit font-black text-xl text-[#FF5E00]">
            {formatINR(item.price)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleManualAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#1A1311] hover:bg-[#FF5E00] text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}
