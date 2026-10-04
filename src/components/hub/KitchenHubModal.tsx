'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Clock,
  Flame,
  CheckCircle2,
  Loader2,
  Store,
  ChevronRight
} from 'lucide-react';
import { useKitchenStore } from '@/store/useKitchenStore';
import { BENGALURU_KITCHEN_HUBS } from '@/lib/kitchenHubs';
import { toast } from '@/lib/toast';

interface KitchenHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCALITY_SHORTCUTS = [
  'Indiranagar',
  'Koramangala',
  'Whitefield',
  'HSR Layout',
  'Malleshwaram',
  'Bellandur',
  'Jayanagar',
  'MG Road'
];

export function KitchenHubModal({ isOpen, onClose }: KitchenHubModalProps) {
  const {
    selectedHub,
    setSelectedHub,
    detectLocationViaGps,
    isDetectingLocation,
    setManualArea,
    distanceKm,
    etaMinutes
  } = useKitchenStore();

  const [activeLocality, setActiveLocality] = useState('');

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGpsDetect = async () => {
    const res = await detectLocationViaGps();
    if (res.success) {
      toast.show(res.message, 'success');
      onClose();
    } else {
      toast.show(res.message, 'info');
    }
  };

  const handleSelectLocality = (loc: string) => {
    setActiveLocality(loc);
    setManualArea(loc);
    toast.show(`Location set to ${loc}. Routed to nearest kitchen hub.`, 'success');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hubModalTitle"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[92dvh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-linear-to-r from-[#1A1311] to-[#251C1A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#FF5E00] to-[#E04800] flex items-center justify-center text-white text-xl shadow-md">
              📍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="hubModalTitle" className="font-outfit font-black text-lg text-white">
                  Cloud Kitchen Hubs
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Bengaluru Matrix
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Fresh slow dum-pukht prepared at the closest royal kitchen
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Close hub modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 touch-scroll">
          {/* 1-Tap GPS Detection Button */}
          <button
            type="button"
            onClick={handleGpsDetect}
            disabled={isDetectingLocation}
            className="w-full min-h-[48px] py-3.5 px-4 rounded-2xl bg-[#FF5E00]/10 hover:bg-[#FF5E00]/15 border-2 border-dashed border-[#FF5E00]/40 text-[#FF5E00] font-bold text-xs flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer"
          >
            {isDetectingLocation ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Triangulating closest kitchen hub via GPS...</span>
              </>
            ) : (
              <>
                <Navigation size={16} className="fill-[#FF5E00]" />
                <span>Detect My Location via GPS (Auto-Route Nearest Hub)</span>
              </>
            )}
          </button>

          {/* Quick Locality Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Or Select Your Neighborhood:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none touch-scroll -mx-1 px-1">
              {LOCALITY_SHORTCUTS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleSelectLocality(loc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer min-h-[36px] ${
                    activeLocality === loc
                      ? 'bg-[#1A1311] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* List of 5 Kitchen Hubs */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Active Bengaluru Kitchen Hubs (5 Available):
            </span>

            <div className="space-y-2.5">
              {BENGALURU_KITCHEN_HUBS.map((hub) => {
                const isSelected = selectedHub.id === hub.id;
                return (
                  <div
                    key={hub.id}
                    onClick={() => {
                      setSelectedHub(hub);
                      toast.show(`Switched dispatch hub to ${hub.name}.`, 'success');
                      onClose();
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-[#FF5E00] bg-orange-50/40 ring-2 ring-[#FF5E00]/30 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-outfit font-black text-sm text-stone-900">
                          {hub.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          <Flame size={10} className="text-emerald-600" />
                          <span>{hub.status}</span>
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FF5E00] text-white">
                            Selected Hub
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-500 line-clamp-1">{hub.address}</p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-stone-600">
                        <span className="flex items-center gap-1 font-bold text-[#FF5E00]">
                          <Clock size={12} />
                          {isSelected && etaMinutes ? `${etaMinutes} mins ETA` : `~${hub.waitMinutes + 5} mins ETA`}
                        </span>
                        <span>•</span>
                        <span>⭐ {hub.rating}</span>
                        <span>•</span>
                        <span className="text-stone-400">Radius: {hub.deliveryRadiusKm} km</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {hub.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-600"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1">
                      {isSelected ? (
                        <CheckCircle2 size={20} className="text-[#FF5E00]" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-stone-300 flex items-center justify-center" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Store size={15} className="text-[#FF5E00]" />
            <span className="text-stone-600 font-medium">
              Active Hub: <strong className="text-stone-900">{selectedHub.name}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1A1311] hover:bg-black text-white font-bold text-xs min-h-[38px] cursor-pointer"
          >
            Confirm Hub
          </button>
        </div>
      </div>
    </div>
  );
}
