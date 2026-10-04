'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AiSommelierModal } from './AiSommelierModal';
import type { MenuItem } from '@/types/menu';

interface SommelierFloatingButtonProps {
  menuItems: MenuItem[];
}

export function SommelierFloatingButton({ menuItems }: SommelierFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-linear-to-r from-[#1A1311] via-[#2D160E] to-[#1A1311] text-white border border-amber-500/40 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        aria-label="Open AI Culinary Sommelier"
      >
        <span className="w-7 h-7 rounded-full bg-linear-to-br from-[#FF5E00] to-[#E04800] flex items-center justify-center text-sm shadow-xs group-hover:rotate-12 transition-transform">
          👑
        </span>
        <div className="text-left">
          <span className="font-outfit font-black text-xs text-amber-300 block leading-tight flex items-center gap-1">
            <span>AI Sommelier</span>
            <Sparkles size={11} className="text-[#FF5E00] animate-spin" />
          </span>
          <span className="text-[10px] text-stone-300 font-medium block leading-tight">
            Curate Royal Feast
          </span>
        </div>
      </button>

      <AiSommelierModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        allMenuItems={menuItems}
      />
    </>
  );
}
