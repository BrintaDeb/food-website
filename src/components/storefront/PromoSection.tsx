'use client';

import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { toast } from '@/lib/toast';

export function PromoSection() {
  const addItem = useCartStore((state) => state.addItem);

  const handleOrderCombo = () => {
    addItem(
      {
        id: 'nawabi-feast-combo',
        name: 'Nawabi Biryani Royal Combo',
        price: 499,
        image: '/images/kolkata-biryani.jpg'
      },
      { openDrawer: false }
    );
    toast.show('Nawabi Biryani Royal Combo added to bag with 50% discount!', 'success');
  };

  return (
    <section id="promoSection" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-linear-to-r from-[#FF5E00] to-[#FF8516] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-float">
          {/* Decorative Flight Arc Dotted Line */}
          <svg
            className="absolute top-4 left-6 w-36 sm:w-48 h-auto pointer-events-none opacity-80"
            viewBox="0 0 180 120"
            fill="none"
          >
            <path
              d="M 10 110 C 20 20 130 10 160 50"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeDasharray="6 7"
              strokeLinecap="round"
            />
            <polygon points="168,52 154,43 162,59" fill="#FFFFFF" />
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Promo Typography */}
            <div className="lg:col-span-7 space-y-4">
              <span className="font-outfit font-extrabold text-lg sm:text-xl tracking-wide uppercase opacity-90">
                Get Up To
              </span>
              <h2 className="text-5xl sm:text-7xl font-outfit font-black tracking-tight leading-none drop-shadow-sm">
                50% Off
              </h2>
              <p className="text-lg sm:text-2xl font-bold max-w-lg opacity-95 leading-snug">
                On Royal Handi Combos! Fragrant Kolkata Dum Biryani, Tandoor Garlic Naan & Chilled
                Kesari Rabdi.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleOrderCombo}
                  className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#1A1311] hover:bg-black text-white font-outfit font-black text-sm sm:text-base shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer text-center"
                >
                  Order Royal Combo Deal (₹499)
                </button>
              </div>
            </div>

            {/* Promo Graphic */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-[420px] aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
                <Image
                  src="/images/kolkata-biryani.jpg"
                  alt="Royal Kolkata Dum Biryani combo feast"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
