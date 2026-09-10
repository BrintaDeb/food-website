'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { toast } from '@/lib/toast';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.show('Thank you for subscribing to CurryCraft culinary updates!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1A1311] text-white pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Contact Info */}
          <div className="space-y-4">
            <Link
              href="/#heroSection"
              className="flex items-center gap-2.5 text-2xl font-extrabold text-white"
            >
              <span className="text-2xl">🍛</span>
              <span className="font-outfit font-black">CurryCraft</span>
            </Link>

            <p className="text-sm text-neutral-300 leading-relaxed max-w-sm">
              Celebrating regional Indian culinary heritage with slow-dum Kolkata biryanis,
              traditional dal sambar, and handcrafted tandoor specialties.
            </p>

            <div className="space-y-2.5 pt-2 text-sm text-neutral-300">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2.5 hover:text-[#FF8516] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#FF8516]" />
                <span>+91 98765 43210</span>
              </a>
              <a
                href="mailto:contact@currycraft.in"
                className="flex items-center gap-2.5 hover:text-[#FF8516] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#FF8516]" />
                <span>contact@currycraft.in</span>
              </a>
              <div className="flex items-center gap-2.5 text-neutral-300">
                <MapPin className="w-4 h-4 text-[#FF8516] shrink-0" />
                <span>12 Park Street, Heritage Quarter, Kolkata</span>
              </div>
            </div>
          </div>

          {/* Col 2: Service */}
          <div>
            <h4 className="font-outfit font-bold text-lg text-white mb-4">Our Specialties</h4>
            <ul className="space-y-2.5 text-sm text-neutral-300">
              <li>
                <Link href="/#menuSection" className="hover:text-[#FF8516] transition-colors">
                  Kolkata Dum Biryani
                </Link>
              </li>
              <li>
                <Link href="/#menuSection" className="hover:text-[#FF8516] transition-colors">
                  Regional Dal Sambar
                </Link>
              </li>
              <li>
                <Link href="/#promoSection" className="hover:text-[#FF8516] transition-colors">
                  Nawabi Combos (50% Off)
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-[#FF8516] transition-colors">
                  Live Dispatch GPS Tracker
                </Link>
              </li>
              <li>
                <Link href="/#whoWeAreSection" className="hover:text-[#FF8516] transition-colors">
                  About Our Kitchen Heritage
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Follow Us */}
          <div>
            <h4 className="font-outfit font-bold text-lg text-white mb-4">Follow Us</h4>
            <ul className="space-y-2.5 text-sm text-neutral-300">
              <li>
                <a href="#" className="hover:text-[#FF8516] transition-colors">
                  Instagram (@currycraft.india)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF8516] transition-colors">
                  Twitter (X)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF8516] transition-colors">
                  Facebook Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF8516] transition-colors">
                  Culinary Journal
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="font-outfit font-bold text-lg text-white mb-4">Stay In The Loop</h4>
            <p className="text-sm text-neutral-300 mb-4">
              Subscribe for festive feast drops, seasonal biryani specials, and privilege offers.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex items-center bg-white/10 rounded-xl p-1.5 border border-white/10 focus-within:border-[#FF5E00] transition-all"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                required
                className="bg-transparent text-sm text-white px-3 py-1.5 focus:outline-none w-full placeholder:text-neutral-400"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-[#FF5E00] hover:bg-[#FF8516] text-white p-2 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>CurryCraft © All Rights Reserved | Authentic Heritage Indian Cuisine</p>
          <div className="flex items-center gap-6">
            <Link href="/portal" className="hover:text-neutral-200 transition-colors">
              Customer Portal
            </Link>
            <Link href="/admin" className="hover:text-neutral-200 transition-colors">
              Kitchen Admin
            </Link>
            <span>✨ Authentic Dum-Pukht</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
