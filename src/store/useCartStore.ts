import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartTotals {
  subtotal: number;
  totalCount: number;
  taxableAmount: number;
  gst: number;
  deliveryFee: number;
  grandTotal: number;
}

export interface CartState extends CartTotals {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string;
  discount: number;
  discountLabel: string;
  isHydrated: boolean;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    item: Omit<CartItem, 'quantity'> & { quantity?: number },
    options?: { openDrawer?: boolean }
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  clearPromo: () => void;
  clearCart: () => void;
  setHydrated: (state: boolean) => void;
}

function calculateDiscount(
  items: CartItem[],
  promoCode: string
): { discount: number; discountLabel: string } {
  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const code = (promoCode || '').toUpperCase().trim();

  if (code === 'ROYAL50' || code === 'EARTH50') {
    return {
      discount: +(subtotal * 0.5).toFixed(2),
      discountLabel: `50% Royal Feast Special (${code})`
    };
  }

  if (items.some((it) => it.id === 'promo-combo' || it.id === 'nawabi-feast-combo')) {
    return {
      discount: 50.0,
      discountLabel: 'Combo Special Discount'
    };
  }

  return {
    discount: 0,
    discountLabel: ''
  };
}

function computeTotals(items: CartItem[], discount: number): CartTotals {
  const subtotal = +items.reduce((acc, it) => acc + it.price * it.quantity, 0).toFixed(2);
  const totalCount = items.reduce((acc, it) => acc + it.quantity, 0);
  const taxableAmount = +Math.max(0, subtotal - discount).toFixed(2);
  const gst = +(taxableAmount * 0.05).toFixed(2);
  const deliveryFee = subtotal >= 500 || items.length === 0 ? 0 : 30;
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
      isOpen: false,
      promoCode: '',
      discount: 0,
      discountLabel: '',
      isHydrated: false,

      // Initial computed totals
      subtotal: 0,
      totalCount: 0,
      taxableAmount: 0,
      gst: 0,
      deliveryFee: 0,
      grandTotal: 0,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (item, options) => {
        const state = get();
        const existing = state.items.find((i) => i.id === item.id);
        const addQty = item.quantity ?? 1;
        let updatedItems: CartItem[];

        if (existing) {
          updatedItems = state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + addQty } : i
          );
        } else {
          updatedItems = [
            ...state.items,
            {
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: addQty,
              image: item.image || '/images/kolkata-biryani.jpg'
            }
          ];
        }

        const { discount, discountLabel } = calculateDiscount(updatedItems, state.promoCode);
        const totals = computeTotals(updatedItems, discount);

        set({
          items: updatedItems,
          discount,
          discountLabel,
          isOpen: options?.openDrawer ? true : state.isOpen,
          ...totals
        });
      },

      removeItem: (id) => {
        const state = get();
        const updatedItems = state.items.filter((i) => i.id !== id);
        const { discount, discountLabel } = calculateDiscount(updatedItems, state.promoCode);
        const totals = computeTotals(updatedItems, discount);

        set({
          items: updatedItems,
          discount,
          discountLabel,
          ...totals
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        const state = get();
        const updatedItems = state.items.map((i) => (i.id === id ? { ...i, quantity } : i));
        const { discount, discountLabel } = calculateDiscount(updatedItems, state.promoCode);
        const totals = computeTotals(updatedItems, discount);

        set({
          items: updatedItems,
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
            discountLabel: '50% Royal Feast Special',
            ...totals
          });
          return { success: true, message: `Coupon ${code} applied! Saved ₹${disc}` };
        }

        return { success: false, message: 'Invalid coupon code. Try ROYAL50 for 50% off.' };
      },

      clearPromo: () => {
        const state = get();
        const { discount, discountLabel } = calculateDiscount(state.items, '');
        const totals = computeTotals(state.items, discount);
        set({
          promoCode: '',
          discount,
          discountLabel,
          ...totals
        });
      },

      clearCart: () => {
        set({
          items: [],
          promoCode: '',
          discount: 0,
          discountLabel: '',
          isOpen: false,
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
      name: 'currycraft-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { discount, discountLabel } = calculateDiscount(state.items, state.promoCode);
          const totals = computeTotals(state.items, discount);
          state.discount = discount;
          state.discountLabel = discountLabel;
          Object.assign(state, totals);
          state.isHydrated = true;
        }
      }
    }
  )
);
