'use client';

import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useKitchenStore } from '@/store/useKitchenStore';
import { KitchenHubModal } from './KitchenHubModal';

export function KitchenHubBadge() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedHub, etaMinutes } = useKitchenStore();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200/70 text-[#FF5E00] hover:bg-orange-100/60 active:scale-95 transition-all text-xs font-bold cursor-pointer min-h-[38px] group"
        title="Change dispatch kitchen hub or triangulate GPS location"
        aria-label={`Delivering from ${selectedHub.name}`}
      >
        <MapPin size={13} className="text-[#FF5E00] shrink-0 animate-bounce" />
        <span className="truncate max-w-[130px] sm:max-w-[160px] text-stone-900 group-hover:text-[#FF5E00] transition-colors">
          {selectedHub.area} Hub
        </span>
        <span className="text-neutral-400 hidden xs:inline">•</span>
        <span className="text-[#FF5E00] font-mono text-[11px] hidden xs:inline">
          {etaMinutes}m
        </span>
        <ChevronDown size={13} className="text-stone-400 group-hover:text-[#FF5E00] transition-colors" />
      </button>

      <KitchenHubModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
