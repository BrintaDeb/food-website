'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Star, X } from 'lucide-react';

export function HeroSection() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section id="heroSection" className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Organic Fluid Orange Shape on Top Right */}
      <div className="absolute top-0 right-0 -z-10 w-[70vw] max-w-[850px] h-[90%] pointer-events-none opacity-95">
        <svg viewBox="0 0 900 980" preserveAspectRatio="none" className="w-full h-full" fill="none">
          <path
            d="M 320 0 
               C 250 120 180 260 210 400 
               C 250 580 420 720 480 820 
               C 550 940 700 1020 900 980 
               L 900 0 Z"
            fill="#FF5E00"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Floating Rating Badge Card */}
            <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-card border border-[#E8E5E0]">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-outfit font-black text-sm text-[#1A1311]">4.5</span>
              <span className="text-xs text-neutral-400 font-medium border-l border-neutral-200 pl-2">
                5k Happy reviews
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <p className="text-xs sm:text-base font-extrabold uppercase tracking-widest text-[#FF5E00]">
                Authentic Royal Indian Heritage Dining
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-outfit font-black text-[#1A1311] tracking-tight leading-[1.08]">
                Flavors That <br className="hidden sm:inline" />
                <span className="text-[#FF5E00]">Warm the Soul!</span>
              </h1>
            </div>

            <p className="text-sm sm:text-lg text-neutral-600 max-w-xl leading-relaxed">
              Experience the royal legacy of Kolkata Dum Biryani with melt-in-mouth aloo,
              slow-simmered regional Dal Sambar, rich handi curries, and clay-tandoor breads.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
              <a
                href="#menuSection"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-[#FF5E00] hover:bg-[#e05200] text-white font-outfit font-black text-base tracking-wide shadow-float hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[48px] text-center"
              >
                Explore Indian Menu
              </a>
              <button
                onClick={() => setDemoOpen(true)}
                className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white hover:bg-neutral-50 text-[#1A1311] font-outfit font-bold text-base shadow-card border border-[#E8E5E0] transition-all min-h-[48px] active:scale-[0.98]"
              >
                <span className="w-8 h-8 rounded-full bg-[#FF5E00] text-white flex items-center justify-center shadow-badge shrink-0">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </span>
                <span>Play Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visuals & Badges */}
          <div className="lg:col-span-5 relative flex justify-center items-center mt-4 lg:mt-0">
            {/* 75% OFF Wavy Starburst Badge */}
            <div className="absolute -top-3 right-2 sm:-top-4 sm:right-10 z-20 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#FF8516] text-white flex flex-col items-center justify-center shadow-badge rotate-12 hover:rotate-0 transition-transform cursor-pointer select-none">
              <span className="font-outfit font-black text-xl sm:text-3xl leading-none">75%</span>
              <span className="font-outfit font-black text-[10px] sm:text-sm tracking-wider uppercase">
                OFF
              </span>
            </div>

            {/* Main Hero Indian Feast Spread */}
            <div className="relative w-full max-w-[540px] aspect-4/3 flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 ring-8 ring-black/5 hover:scale-[1.02] transition-transform duration-500">
              <Image
                src="/images/hero-indian-feast.jpg"
                alt="Authentic Royal Indian Feast featuring Kolkata Dum Biryani, Tandoor Garlic Naan, and Paneer Butter Masala"
                priority
                fill
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Culinary Demo Video Modal */}
      {demoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 pt-safe pb-safe"
        >
          <div className="relative w-full max-w-3xl bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video">
            <button
              onClick={() => setDemoOpen(false)}
              className="absolute top-4 right-4 z-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-white/20 active:scale-95 transition-all"
              aria-label="Close demo"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="CurryCraft Royal Culinary Heritage Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </section>
  );
}
