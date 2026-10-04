'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatINR } from '@/lib/utils';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { getMenuItems } from '@/lib/api';
import { getSmartUpsellPairings, type SmartPairing } from '@/lib/sommelier';
import { toast } from '@/lib/toast';
import type { MenuItem } from '@/types/menu';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    promoCode,
    subtotal,
    discount,
    discountLabel,
    gst,
    deliveryFee,
    grandTotal,
    totalCount
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ text: string; error?: boolean } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [allMenu, setAllMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (isOpen && allMenu.length === 0) {
      getMenuItems().then((res) => {
        if (res.success && res.items) {
          setAllMenu(res.items);
        }
      });
    }
  }, [isOpen, allMenu.length]);

  const upsellPairings = useMemo(() => {
    return getSmartUpsellPairings(items, allMenu);
  }, [items, allMenu]);

  // Prevent background scroll while cart drawer is open
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

  if (!isOpen && !isCheckoutOpen) return null;

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = useCartStore.getState().applyPromo(promoInput);
    setPromoStatus({ text: res.message, error: !res.success });
  };

  const handleProceedToCheckout = () => {
    closeCart();
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer Panel */}
      {isOpen && (
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag"
          className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-[#FFFDF9] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-[#E8E5E0] h-dvh max-h-dvh pt-[env(safe-area-inset-top,0px)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E5E0] bg-white shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FF5E00]" />
              <h3 className="text-lg font-outfit font-extrabold text-[#1A1311]">
                Your Bag ({totalCount})
              </h3>
            </div>
            <button
              onClick={closeCart}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-neutral-500 hover:text-black hover:bg-black/5 active:scale-95 transition-all"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 touch-scroll overscroll-contain">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FF5E00]/10 flex items-center justify-center text-[#FF5E00]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-outfit font-bold text-lg text-[#1A1311]">Your bag is empty</p>
                  <p className="text-sm text-neutral-500 max-w-xs mt-1">
                    Explore our royal dum biryanis, slow-simmered dal sambar, and tandoori breads!
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 rounded-xl bg-[#FF5E00] text-white font-bold text-sm hover:bg-[#e05200] transition-colors cursor-pointer"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3.5 bg-white rounded-2xl border border-[#E8E5E0] shadow-xs"
                >
                  <div className="relative w-18 h-18 shrink-0 rounded-xl overflow-hidden bg-neutral-100 p-1 flex items-center justify-center">
                    <Image
                      src={item.image.startsWith('/') ? item.image : `/${item.image}`}
                      alt={item.name}
                      width={70}
                      height={70}
                      style={{ width: 'auto', height: 'auto', maxHeight: '70px' }}
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-outfit font-bold text-sm text-[#1A1311] truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{formatINR(item.price)} each</p>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Stepper (Mobile Touch Friendly) */}
                      <div className="flex items-center border border-[#E8E5E0] rounded-xl bg-[#FFFDF9] p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="min-w-[32px] min-h-[32px] flex items-center justify-center text-neutral-600 hover:text-[#FF5E00] active:scale-90 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-[#1A1311]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="min-w-[32px] min-h-[32px] flex items-center justify-center text-neutral-600 hover:text-[#FF5E00] active:scale-90 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-black text-[#FF5E00]">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="min-w-[40px] min-h-[40px] flex items-center justify-center text-neutral-400 hover:text-red-500 active:scale-90 transition-colors cursor-pointer"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}

            {/* AI Sommelier Smart Dastarkhwan Upsell / Pairings */}
            {items.length > 0 && upsellPairings.length > 0 && (
              <div className="pt-3 border-t border-stone-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">👑</span>
                    <span className="text-xs font-outfit font-black text-stone-900">
                      Complete Royal Dastarkhwan
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5E00]">
                    AI Sommelier
                  </span>
                </div>

                <div className="space-y-2">
                  {upsellPairings.map((pairing) => (
                    <div
                      key={pairing.item.id}
                      className="p-3 rounded-2xl bg-orange-50/60 border border-orange-200/70 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-stone-200">
                          <Image
                            src={pairing.item.image.startsWith('/') ? pairing.item.image : `/${pairing.item.image}`}
                            alt={pairing.item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-outfit font-bold text-xs text-stone-900 truncate">
                              {pairing.item.name}
                            </p>
                          </div>
                          <p className="text-[10px] text-stone-500 line-clamp-1">
                            {pairing.reason}
                          </p>
                          <span className="text-xs font-black text-[#FF5E00]">
                            {formatINR(pairing.item.price)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          addItem({
                            id: pairing.item.id,
                            name: pairing.item.name,
                            price: pairing.item.price,
                            image: pairing.item.image
                          });
                          toast.show(`Added ${pairing.item.name} to your bag!`, 'success');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FF5E00] hover:bg-[#e05200] text-white text-[11px] font-black tracking-wide shrink-0 transition active:scale-95 cursor-pointer shadow-xs min-h-[36px]"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Trigger with Safe Area Inset */}
          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-[#E8E5E0] bg-white space-y-4 shrink-0 pb-[max(1.25rem,calc(1rem+env(safe-area-inset-bottom,0px)))]">
              {/* Promo Code Input */}
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Coupon (e.g. ROYAL50)"
                    className="flex-1 px-3.5 py-2.5 text-base sm:text-xs uppercase font-bold tracking-wider border border-[#E8E5E0] rounded-xl focus:outline-none focus:border-[#FF5E00] min-h-[44px]"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-5 py-2.5 bg-[#1A1311] hover:bg-[#FF5E00] text-white text-xs font-bold rounded-xl active:scale-95 transition-all min-h-[44px]"
                  >
                    Apply
                  </button>
                </div>
                {promoStatus && (
                  <p
                    className={`text-[11px] font-semibold ${
                      promoStatus.error ? 'text-red-500' : 'text-emerald-600'
                    }`}
                  >
                    {promoStatus.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{discountLabel || 'Discount'}</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>{formatINR(gst)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span>
                </div>
                <div className="pt-2 border-t border-[#E8E5E0] flex justify-between text-base font-black text-[#1A1311]">
                  <span>Grand Total</span>
                  <span className="text-[#FF5E00]">{formatINR(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-[#FF5E00] hover:bg-[#e05200] active:scale-[0.98] text-white font-extrabold text-sm rounded-xl shadow-float transition-all min-h-[50px]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </aside>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      )}
    </>
  );
}
