'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Sparkles,
  Users,
  Utensils,
  Flame,
  Check,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ChefHat
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { curateRoyalFeast, type CuratedFeast } from '@/lib/sommelier';
import { formatINR } from '@/lib/utils';
import { toast } from '@/lib/toast';
import type { MenuItem } from '@/types/menu';

interface AiSommelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  allMenuItems: MenuItem[];
}

export function AiSommelierModal({ isOpen, onClose, allMenuItems }: AiSommelierModalProps) {
  const { addItem, openCart } = useCartStore();

  const [partySize, setPartySize] = useState<number>(2);
  const [dietary, setDietary] = useState<string>('All');
  const [spiceLevel, setSpiceLevel] = useState<number>(2);
  const [curatedFeast, setCuratedFeast] = useState<CuratedFeast | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-generate on open
  useEffect(() => {
    if (isOpen && allMenuItems.length > 0) {
      document.body.style.overflow = 'hidden';
      const feast = curateRoyalFeast(
        { partySize, dietary, spicePreference: spiceLevel },
        allMenuItems
      );
      setCuratedFeast(feast);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, allMenuItems, partySize, dietary, spiceLevel]);

  if (!isOpen) return null;

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const feast = curateRoyalFeast(
        { partySize, dietary, spicePreference: spiceLevel },
        allMenuItems
      );
      setCuratedFeast(feast);
      setIsGenerating(false);
      toast.show('Royal Dastarkhwan curated with authentic pairings!', 'success');
    }, 400);
  };

  const handleAddFeastToCart = () => {
    if (!curatedFeast) return;

    curatedFeast.items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image
      });
    });

    toast.show(
      `Added ${curatedFeast.items.length} dishes from ${curatedFeast.title} to your bag!`,
      'success'
    );
    onClose();
    openCart();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sommelierTitle"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[92dvh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Luxury Gold/Dark Header */}
        <div className="p-5 sm:p-6 bg-linear-to-r from-[#180E0B] via-[#2A160F] to-[#180E0B] text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          {/* Subtle Royal Saffron Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF5E00]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FF5E00] to-[#E04800] flex items-center justify-center text-white text-2xl shadow-lg ring-2 ring-amber-400/40">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="sommelierTitle" className="font-outfit font-black text-lg text-white">
                  Royal AI Sommelier
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Dum-Pukht Pairing Engine
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                AI-curated banquet harmonization &amp; authentic royal course pairing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer relative z-10"
            aria-label="Close sommelier modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Curation Canvas */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 touch-scroll">
          {/* Controls Bar */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8E5E0]">
            <span className="text-[11px] font-black tracking-wider text-stone-500 uppercase block">
              1. Choose Your Dining Occasion
            </span>

            {/* Party Size */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { size: 1, label: 'Solo Feast', icon: '👤', desc: '1 Person' },
                { size: 2, label: 'Royal Couple', icon: '👥', desc: '2 Diners' },
                { size: 4, label: 'Dastarkhwan', icon: '👑', desc: 'Family (4+)' }
              ].map((p) => (
                <button
                  key={p.size}
                  type="button"
                  onClick={() => setPartySize(p.size)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer min-h-[44px] ${
                    partySize === p.size
                      ? 'border-[#FF5E00] bg-[#FF5E00]/10 text-stone-900 ring-1 ring-[#FF5E00]'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-sm block">{p.icon}</span>
                  <span className="text-xs font-bold block">{p.label}</span>
                  <span className="text-[10px] text-stone-400 block">{p.desc}</span>
                </button>
              ))}
            </div>

            {/* Dietary Focus */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-stone-600 block">
                Dietary Preference:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-scroll">
                {[
                  { id: 'All', label: 'All Specialties' },
                  { id: 'Pure Veg', label: '100% Pure Veg 🌱' },
                  { id: 'Jain Friendly', label: 'Jain Friendly 🧅❌' },
                  { id: 'Keto Friendly', label: 'Keto / High-Protein 🥩' }
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDietary(d.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer min-h-[36px] ${
                      dietary === d.id
                        ? 'bg-[#1A1311] text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Curated Feast Showcase */}
          {curatedFeast && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-linear-to-br from-[#FFF7EE] to-[#FFFDF9] border border-orange-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5E00] uppercase tracking-wider">
                      <Sparkles size={12} /> Curated Royal Dastarkhwan
                    </span>
                    <h4 className="font-outfit font-black text-xl text-stone-900 mt-0.5">
                      {curatedFeast.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5">{curatedFeast.subtitle}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 line-through block">
                      {formatINR(curatedFeast.originalTotal)}
                    </span>
                    <span className="font-outfit font-black text-2xl text-[#FF5E00] block">
                      {formatINR(curatedFeast.bundlePrice)}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 inline-block">
                      Save {formatINR(curatedFeast.savings)}
                    </span>
                  </div>
                </div>

                {/* Chef's Tasting Advice */}
                <div className="p-3 rounded-2xl bg-white/80 border border-orange-200/60 text-xs text-stone-700 flex items-start gap-2.5">
                  <ChefHat size={16} className="text-[#FF5E00] shrink-0 mt-0.5" />
                  <p className="italic leading-relaxed">{curatedFeast.chefNotes}</p>
                </div>

                {/* Curated Dishes Course Sequence */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Curated Courses ({curatedFeast.items.length} Dishes):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {curatedFeast.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs"
                      >
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                          <Image
                            src={item.image.startsWith('/') ? item.image : `/${item.image}`}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="60px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-stone-400">
                              #{idx + 1}
                            </span>
                            <p className="font-outfit font-bold text-xs text-stone-900 truncate">
                              {item.name}
                            </p>
                          </div>
                          <span className="text-[10px] font-semibold text-stone-500 block truncate">
                            {item.category}
                          </span>
                          <span className="text-xs font-black text-[#FF5E00]">
                            {formatINR(item.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="flex-1 py-3 px-4 rounded-2xl border border-stone-300 bg-white hover:bg-stone-100 font-bold text-xs text-stone-700 min-h-[48px] flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
          >
            <Sparkles size={14} className="text-[#FF5E00]" />
            <span>Regenerate Pairings</span>
          </button>

          <button
            type="button"
            onClick={handleAddFeastToCart}
            disabled={!curatedFeast || curatedFeast.items.length === 0}
            className="flex-2 py-3.5 px-6 rounded-2xl bg-linear-to-r from-[#FF5E00] to-[#E04800] hover:from-[#FF7324] hover:to-[#EB5505] text-white font-black text-sm tracking-wide shadow-lg shadow-[#FF5E00]/25 transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            <ShoppingBag size={16} />
            <span>
              Add Complete Royal Feast to Bag ({curatedFeast ? formatINR(curatedFeast.bundlePrice) : ''})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
