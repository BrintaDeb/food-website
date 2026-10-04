'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const reviews = [
    {
      quote:
        'The aroma of the Kolkata Chicken Biryani took me straight back to Park Street! The tender chicken, fragrant long-grain rice, and that signature melt-in-mouth potato are pure perfection.',
      author: 'Merian Mukherjee',
      role: 'Culinary Columnist & Food Critic',
      stars: 5
    },
    {
      quote:
        'The Classic Dal Sambar is pure comfort in a bowl. Slow-simmered with drumsticks, shallots, and freshly tempered curry leaves. Truly authentic regional craftsmanship!',
      author: 'Dr. Vikram Swaminathan',
      role: 'Heritage Food Researcher',
      stars: 5
    },
    {
      quote:
        'The clay-tandoor Garlic Naan was delightfully blistered with melted butter, and the Kesari Rabdi was decadently rich. Super fast delivery with live GPS courier tracking!',
      author: 'Rohan Kapoor',
      role: 'Gastronomy Enthusiast',
      stars: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const prev = () => {
    setCurrentIndex((prevIdx) => (prevIdx === 0 ? reviews.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setCurrentIndex((prevIdx) => (prevIdx === reviews.length - 1 ? 0 : prevIdx + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    setTouchStartX(null);
  };

  const current = reviews[currentIndex] || reviews[0]!;

  return (
    <section id="testimonialsSection" className="py-16 sm:py-24 bg-[#FFFDF9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#FF5E00]/10 text-[#FF5E00] text-xs font-black tracking-widest uppercase mb-3">
          What Our Guests Say
        </span>
        <h2 className="text-3xl sm:text-5xl font-outfit font-black text-[#1A1311] tracking-tight mb-12">
          Loved by Connoisseurs of Heritage Cuisine
        </h2>

        {/* Center Card with Touch Swipe Support */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative p-6 sm:p-12 rounded-3xl bg-white border border-[#E8E5E0] shadow-card touch-pan-y select-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FF5E00]/10 text-[#FF5E00] flex items-center justify-center mx-auto mb-6">
            <Quote className="w-6 h-6" />
          </div>

          <p className="text-base sm:text-2xl font-medium text-neutral-800 leading-relaxed max-w-2xl mx-auto mb-8">
            &ldquo;{current.quote}&rdquo;
          </p>

          <div className="flex items-center justify-center text-amber-400 gap-1 mb-4">
            {[...Array(current.stars)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>

          <div>
            <h4 className="font-outfit font-black text-lg text-[#1A1311]">{current.author}</h4>
            <p className="text-xs text-neutral-400 font-semibold">{current.role}</p>
          </div>
        </div>

        {/* Carousel Controls (44px touch targets) */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl border border-[#E8E5E0] bg-white hover:bg-neutral-50 active:scale-95 text-[#1A1311] transition-all shadow-xs"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2 items-center">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`min-h-[32px] flex items-center transition-all ${
                  currentIndex === idx ? 'w-8 bg-[#FF5E00] h-3 rounded-full' : 'w-3 h-3 bg-neutral-300 rounded-full'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl border border-[#E8E5E0] bg-white hover:bg-neutral-50 active:scale-95 text-[#1A1311] transition-all shadow-xs"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
