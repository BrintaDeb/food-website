import { API_BASE_URL, INITIAL_INDIAN_MENU } from '@/constants/config';
import type { MenuItem } from '@/types/menu';
import type { Order } from '@/types/order';

export async function fetchMenu(): Promise<MenuItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE_URL}/api/menu`, {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to fetch menu (${res.status})`);
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.items) && data.items.length > 0) {
      return data.items;
    }
    return INITIAL_INDIAN_MENU;
  } catch {
    // Offline resilience: return authentic Indian cuisine seed data
    return INITIAL_INDIAN_MENU;
  }
}

export async function createOrder(payload: {
  customer: {
    name: string;
    phone: string;
    address: string;
    city?: string;
    deliveryType?: string;
    paymentMethod?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  promoCode?: string;
}): Promise<{ success: boolean; order?: Order; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error occurred while placing order.'
    };
  }
}

export async function fetchCustomerOrders(phone: string): Promise<Order[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/customer/orders?phone=${encodeURIComponent(phone)}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.orders || [];
  } catch {
    return [];
  }
}
