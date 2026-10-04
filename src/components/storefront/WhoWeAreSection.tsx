'use client';

import Image from 'next/image';
import { Share2, CheckCircle2 } from 'lucide-react';
import { toast } from '@/lib/toast';

export function WhoWeAreSection() {
  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'CurryCraft - Authentic Indian Cuisine',
          text: 'Taste royal Kolkata Biryani, Dal Sambar, and tandoor delicacies at CurryCraft!',
          url: window.location.href
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.show('Website link copied to clipboard!', 'info');
    }
  };

  const features = [
    'Hand-Ground Whole Spices sourced directly from heritage spice gardens across Kerala, Kashmir, and Bengal.',
    'Slow Dum-Pukht Cooking Technique sealing clay handis with dough to lock in deep, natural aromatic flavors.',
    'Transparent Ingredient Profiles detailing authentic desi ghee, mustard oil, saffron, and fresh farm dairy.',
    'Diverse Vegetarian & Nawabi Selections spanning comforting South Indian sambar to festive Awadhi biryani.'
  ];

  return (
    <section id="whoWeAreSection" className="py-16 sm:py-24 bg-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#FF5E00]/10 text-[#FF5E00] text-xs font-black tracking-widest uppercase">
            Who We Are
          </span>
          <h2 className="text-3xl sm:text-5xl font-outfit font-black text-[#1A1311] tracking-tight">
            Preserving Culinary Legacies, One Handi At A Time
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Feature Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E8E5E0] shadow-xs hover:border-[#FF5E00]/40 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#FF5E00] shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base font-medium text-neutral-700 leading-relaxed">
                    {feat}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={handleShare}
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#1A1311] hover:bg-black text-white font-outfit font-bold text-sm shadow-card transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#FF8516]" />
                <span>Share With Friends</span>
              </button>
            </div>
          </div>

          {/* Right Chef Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-[#E8E5E0] bg-stone-100">
              <Image
                src="/images/chef-indian.jpg"
                alt="Executive Chef Vikram Singh presenting handcrafted Indian cuisine"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
