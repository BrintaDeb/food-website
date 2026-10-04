'use client';

import React from 'react';
import {
  Phone,
  ShieldCheck,
  Star,
  Clock,
  Gauge,
  MapPin,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/lib/toast';
import type { DeliveryTelemetry, DeliveryStage } from '@/types/tracking';

interface RiderTelemetryCardProps {
  telemetry: DeliveryTelemetry | null;
  onRestart: () => void;
}

const STAGES: { stage: DeliveryStage; label: string; icon: string }[] = [
  { stage: 'ORDER_CONFIRMED', label: 'Order Placed', icon: '📝' },
  { stage: 'KITCHEN_PREPARING', label: 'Dum Simmering', icon: '🍲' },
  { stage: 'OUT_FOR_DELIVERY', label: 'Rider on the Move', icon: '🛵' },
  { stage: 'NEARBY', label: 'Arriving at Gate', icon: '📍' },
  { stage: 'DELIVERED', label: 'Delivered', icon: '🎉' }
];

export function RiderTelemetryCard({ telemetry, onRestart }: RiderTelemetryCardProps) {
  const handleCallRider = () => {
    toast.show(
      `Connecting call to rider ${telemetry?.rider.name || 'Vikram Sen'} (+91 98450 12345)... 📞`,
      'info'
    );
  };

  const currentStageIndex = STAGES.findIndex((s) => s.stage === telemetry?.status);

  const activeIndex = currentStageIndex === -1 ? 2 : currentStageIndex;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Rider Header & Contact */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF5E00] to-[#D94800] flex items-center justify-center text-white text-2xl shadow-md font-bold">
            🛵
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 text-lg">
                {telemetry?.rider.name || 'Vikram Sen'}
              </h3>
              <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                <Star size={11} className="fill-amber-500 text-amber-500" />
                {telemetry?.rider.rating || 4.95}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
              <span>{telemetry?.rider.vehicleNumber || 'KA-01-EQ-4021'}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck size={12} /> Contactless Verified
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCallRider}
            className="flex-1 sm:flex-initial min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-[#FF5E00] text-white font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Phone size={14} />
            <span>Call Delivery Partner</span>
          </button>
          <button
            onClick={onRestart}
            title="Restart GPS Simulation"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition cursor-pointer shrink-0"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Live Telemetry Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="p-2.5 sm:p-4 rounded-2xl bg-[#FFFDF9] border border-stone-200 text-center">
          <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-bold text-stone-400 uppercase tracking-wider block flex items-center justify-center gap-0.5 sm:gap-1">
            <Clock size={11} className="text-[#FF5E00] shrink-0" /> <span className="truncate">ETA</span>
          </span>
          <p className="font-outfit font-black text-lg xs:text-xl sm:text-2xl lg:text-3xl text-stone-900 mt-1">
            {telemetry?.status === 'DELIVERED' ? 'Arrived!' : `${telemetry?.etaMinutes || 12}m`}
          </p>
          <span className="text-[9px] xs:text-[10px] text-stone-400 truncate block">Live Traffic</span>
        </div>

        <div className="p-2.5 sm:p-4 rounded-2xl bg-[#FFFDF9] border border-stone-200 text-center">
          <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-bold text-stone-400 uppercase tracking-wider block flex items-center justify-center gap-0.5 sm:gap-1">
            <Gauge size={11} className="text-blue-500 shrink-0" /> <span className="truncate">Speed</span>
          </span>
          <p className="font-outfit font-black text-lg xs:text-xl sm:text-2xl lg:text-3xl text-stone-900 mt-1">
            {telemetry?.speedKmH || 0}{' '}
            <span className="text-[10px] xs:text-xs font-bold text-stone-400">km/h</span>
          </p>
          <span className="text-[9px] xs:text-[10px] text-stone-400 truncate block">Velocity</span>
        </div>

        <div className="p-2.5 sm:p-4 rounded-2xl bg-[#FFFDF9] border border-stone-200 text-center">
          <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-bold text-stone-400 uppercase tracking-wider block flex items-center justify-center gap-0.5 sm:gap-1">
            <MapPin size={11} className="text-emerald-500 shrink-0" /> <span className="truncate">Distance</span>
          </span>
          <p className="font-outfit font-black text-lg xs:text-xl sm:text-2xl lg:text-3xl text-stone-900 mt-1">
            {telemetry?.distanceRemainingKm ?? 3.4}{' '}
            <span className="text-[10px] xs:text-xs font-bold text-stone-400">km</span>
          </p>
          <span className="text-[9px] xs:text-[10px] text-stone-400 truncate block">Remaining</span>
        </div>
      </div>

      {/* Milestone Progress Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-bold text-stone-600">
          <span>Delivery Progress</span>
          <span className="text-[#FF5E00]">{telemetry?.progressPercent || 25}%</span>
        </div>

        {/* Outer Bar */}
        <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF5E00] to-[#E04800] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(5, telemetry?.progressPercent || 25))}%` }}
          />
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-5 gap-1 pt-2">
          {STAGES.map((s, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={s.stage} className="text-center space-y-1">
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 mx-auto rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#FF5E00] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-400'
                  } ${isCurrent ? 'ring-3 sm:ring-4 ring-[#FF5E00]/20 scale-105 sm:scale-110' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 size={13} /> : s.icon}
                </div>
                <p
                  className={`text-[8px] xs:text-[9px] sm:text-[10px] font-bold leading-tight line-clamp-2 ${
                    isCurrent ? 'text-[#FF5E00]' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                  }`}
                >
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
