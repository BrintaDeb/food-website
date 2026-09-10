'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, X, Plus } from 'lucide-react';
import { getMenuItems } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';
import { formatINR } from '@/lib/utils';
import type { MenuItem } from '@/types/menu';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getMenuItems()
        .then((res) => setMenu(res.items))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems = menu.filter((it) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      it.name.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q) ||
      it.description.toLowerCase().includes(q)
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Indian menu"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-20 px-4 sm:px-6"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8E5E0] animate-in slide-in-from-top-4 duration-200">
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E8E5E0]">
          <Search className="w-5 h-5 text-[#FF5E00] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu (e.g. Biryani, Sambar, Naan, Rabdi)..."
            className="w-full text-base font-medium text-[#1A1311] placeholder:text-neutral-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2.5">
          {loading ? (
            <div className="py-8 text-center text-sm text-neutral-400">Loading menu items...</div>
          ) : filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-500">
              No items matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-[#FFFDF9] border border-transparent hover:border-[#E8E5E0] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl bg-neutral-100 shrink-0 p-1 flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.image.startsWith('/') ? item.image : `/${item.image}`}
                      alt={item.name}
                      width={48}
                      height={48}
                      style={{ width: 'auto', height: 'auto', maxHeight: '48px' }}
                      className="object-contain"
                    />
                  </div>
                  <div className="truncate">
                    <p className="font-outfit font-bold text-sm text-[#1A1311] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {item.category} • {formatINR(item.price)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addItem({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image
                    });
                  }}
                  className="p-2 rounded-xl bg-[#FF5E00]/10 text-[#FF5E00] hover:bg-[#FF5E00] hover:text-white transition-colors shrink-0"
                  aria-label={`Add ${item.name} to bag`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
