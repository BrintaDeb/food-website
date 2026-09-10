import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartItem } from '@/types/menu';

interface CartState {
  items: CartItem[];
  promoCode: string;
  discount: number;
  discountLabel: string;
  subtotal: number;
  totalCount: number;
  taxableAmount: number;
  gst: number;
  deliveryFee: number;
  grandTotal: number;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  clearPromo: () => void;
  clearCart: () => void;
}

function computeTotals(items: CartItem[], discount: number) {
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const totalCount = items.reduce((acc, it) => acc + it.quantity, 0);
  const taxableAmount = Math.max(0, subtotal - discount);
  const gst = +(taxableAmount * 0.05).toFixed(2);
  const deliveryFee = totalCount === 0 || subtotal >= 500 ? 0 : 30;
  const grandTotal = +(taxableAmount + gst + deliveryFee).toFixed(2);

  return {
    subtotal,
    totalCount,
    taxableAmount,
    gst,
    deliveryFee,
    grandTotal
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: '',
      discount: 0,
      discountLabel: '',
      subtotal: 0,
      totalCount: 0,
      taxableAmount: 0,
      gst: 0,
      deliveryFee: 0,
      grandTotal: 0,

      addItem: (item) => {
        const state = get();
        const existingIndex = state.items.findIndex((it) => it.id === item.id);
        const qtyToAdd = item.quantity || 1;

        let nextItems: CartItem[];
        if (existingIndex > -1) {
          nextItems = state.items.map((it, idx) =>
            idx === existingIndex ? { ...it, quantity: it.quantity + qtyToAdd } : it
          );
        } else {
          nextItems = [
            ...state.items,
            {
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: qtyToAdd,
              image: item.image
            }
          ];
        }

        const subtotal = nextItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
        let discount = state.discount;
        let discountLabel = state.discountLabel;
        if (state.promoCode === 'ROYAL50' || state.promoCode === 'EARTH50') {
          discount = +(subtotal * 0.5).toFixed(2);
        }

        const totals = computeTotals(nextItems, discount);
        set({
          items: nextItems,
          discount,
          discountLabel,
          ...totals
        });
      },

      removeItem: (id) => {
        const state = get();
        const nextItems = state.items.filter((it) => it.id !== id);
        const subtotal = nextItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

        let discount = state.discount;
        let discountLabel = state.discountLabel;
        if (nextItems.length === 0) {
          discount = 0;
          discountLabel = '';
        } else if (state.promoCode === 'ROYAL50' || state.promoCode === 'EARTH50') {
          discount = +(subtotal * 0.5).toFixed(2);
        }

        const totals = computeTotals(nextItems, discount);
        set({
          items: nextItems,
          discount,
          discountLabel,
          ...totals
        });
      },

      updateQuantity: (id, quantity) => {
        const state = get();
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const nextItems = state.items.map((it) =>
          it.id === id ? { ...it, quantity } : it
        );
        const subtotal = nextItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

        let discount = state.discount;
        let discountLabel = state.discountLabel;
        if (state.promoCode === 'ROYAL50' || state.promoCode === 'EARTH50') {
          discount = +(subtotal * 0.5).toFixed(2);
        }

        const totals = computeTotals(nextItems, discount);
        set({
          items: nextItems,
          discount,
          discountLabel,
          ...totals
        });
      },

      applyPromo: (rawCode) => {
        const code = (rawCode || '').trim().toUpperCase();
        const state = get();
        const subtotal = state.items.reduce((acc, it) => acc + it.price * it.quantity, 0);

        if (state.items.length === 0) {
          return { success: false, message: 'Add dishes to your bag before applying coupon.' };
        }

        if (code === 'ROYAL50' || code === 'EARTH50') {
          const disc = +(subtotal * 0.5).toFixed(2);
          const totals = computeTotals(state.items, disc);
          set({
            promoCode: code,
            discount: disc,
            discountLabel: '50% Royal Special (ROYAL50)',
            ...totals
          });
          return { success: true, message: `Coupon ${code} applied! Saved ₹${disc}` };
        }

        return { success: false, message: 'Invalid coupon code. Try ROYAL50 for 50% off.' };
      },

      clearPromo: () => {
        const state = get();
        const totals = computeTotals(state.items, 0);
        set({
          promoCode: '',
          discount: 0,
          discountLabel: '',
          ...totals
        });
      },

      clearCart: () => {
        set({
          items: [],
          promoCode: '',
          discount: 0,
          discountLabel: '',
          subtotal: 0,
          totalCount: 0,
          taxableAmount: 0,
          gst: 0,
          deliveryFee: 0,
          grandTotal: 0
        });
      }
    }),
    {
      name: 'currycraft-mobile-cart',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
