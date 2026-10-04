'use client';

import React, { use } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, MapPin, Utensils, Loader2, Sparkles } from 'lucide-react';
import { useRiderSimulation } from '@/hooks/useRiderSimulation';
import { RiderTelemetryCard } from '@/components/tracking/RiderTelemetryCard';

// Dynamically import Leaflet map with SSR disabled to prevent 'window is not defined'
const DeliveryTrackerMap = dynamic(() => import('@/components/tracking/DeliveryTrackerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] rounded-3xl bg-stone-100 flex flex-col items-center justify-center text-stone-400 gap-3 border border-stone-200">
      <Loader2 className="w-8 h-8 animate-spin text-[#FF5E00]" />
      <p className="text-xs font-semibold">Initializing Bengaluru GPS Map Satellite View...</p>
    </div>
  )
});

interface TrackOrderPageProps {
  params: Promise<{ orderId: string }>;
}

export default function TrackOrderPage({ params }: TrackOrderPageProps) {
  const { orderId } = use(params);
  const { telemetry, routeWaypoints, restartSimulation } = useRiderSimulation(orderId);

  return (
    <div className="min-h-screen bg-[#FFFDF9] pt-[max(1.5rem,calc(env(safe-area-inset-top,0px)+1rem))] pb-[max(2rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/portal"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5E00] hover:underline mb-2"
            >
              <ArrowLeft size={14} /> Back to Customer Portal
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-outfit font-black text-stone-900 tracking-tight">
                Live Order Tracking
              </h1>
              <span className="px-3 py-1 rounded-full bg-orange-100 text-[#FF5E00] text-xs font-black font-mono">
                #{orderId}
              </span>
            </div>
            <p className="text-xs text-stone-500 flex items-center gap-2">
              <span>Origin: CurryCraft Kitchen, Indiranagar</span>
              <span>➔</span>
              <span>Destination: Koramangala 4th Block</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Streaming
            </span>
          </div>
        </div>

        {/* Main Grid: Map on Left/Top, Telemetry & Order Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Leaflet Map */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-3 rounded-3xl border border-stone-200 shadow-sm">
              <DeliveryTrackerMap telemetry={telemetry} routeWaypoints={routeWaypoints} />
            </div>

            {/* Map Route Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <span className="text-base">🏪</span>
                <span className="font-semibold text-stone-800">CurryCraft Hub</span>
                <span className="text-stone-400 text-[11px]">(Kitchen)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base">🛵</span>
                <span className="font-semibold text-[#FF5E00]">Live Rider Scooter</span>
                <span className="text-stone-400 text-[11px]">(GPS Stream)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base">🏠</span>
                <span className="font-semibold text-emerald-700">Your Address</span>
                <span className="text-stone-400 text-[11px]">(Koramangala)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Rider Telemetry Card & Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <RiderTelemetryCard telemetry={telemetry} onRestart={restartSimulation} />

            {/* Order Items Snapshot Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Utensils size={16} className="text-[#FF5E00]" />
                  <h3 className="font-bold text-stone-900 text-sm">Gourmet Indian Package</h3>
                </div>
                <span className="text-xs font-semibold text-stone-400">2 Items</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                  <div>
                    <span className="font-bold text-stone-900 block">
                      Kolkata Chicken Biryani (x1)
                    </span>
                    <span className="text-[11px] text-stone-500">
                      With melt-in-mouth aloo, boiled egg, burani raita
                    </span>
                  </div>
                  <span className="font-bold text-stone-900">₹380</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                  <div>
                    <span className="font-bold text-stone-900 block">Classic Dal Sambar (x1)</span>
                    <span className="text-[11px] text-stone-500">
                      Curry leaves, drumstick, toor dal
                    </span>
                  </div>
                  <span className="font-bold text-stone-900">₹190</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-800">
                <span>Total Paid (Online UPI)</span>
                <span className="font-outfit font-black text-base text-[#FF5E00]">₹570</span>
              </div>
            </div>

            {/* Safety & Hygiene Guarantee */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">
                  Thermal Insulated &amp; Sealed
                </h4>
                <p className="text-[11px] text-emerald-700 leading-relaxed mt-0.5">
                  Your biryani and hot curries are carried in specialized thermal bags ensuring
                  piping hot delivery directly to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
