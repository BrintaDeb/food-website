import type { MenuItem, CreateMenuItemInput, UpdateMenuItemInput } from '@/types/menu';
import type { Order, OrderStatus, CreateOrderPayload } from '@/types/order';
import type { CustomerProfile, CustomerProfilePayload } from '@/types/customer';
import type { AdminStats } from '@/types/stats';

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

// Menu API
export async function getMenuItems(
  category?: string,
  inStockOnly?: boolean
): Promise<{ success: boolean; count: number; items: MenuItem[] }> {
  const query = new URLSearchParams();
  if (category && category !== 'All') query.set('category', category);
  if (inStockOnly) query.set('inStock', 'true');
  const qs = query.toString();
  return fetcher(`/api/menu${qs ? `?${qs}` : ''}`);
}

export async function createMenuItem(
  payload: CreateMenuItemInput
): Promise<{ success: boolean; message: string; item: MenuItem }> {
  return fetcher('/api/menu', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateMenuItem(
  id: string,
  payload: UpdateMenuItemInput
): Promise<{ success: boolean; message: string; item: MenuItem }> {
  return fetcher(`/api/menu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function deleteMenuItem(id: string): Promise<{ success: boolean; message: string }> {
  return fetcher(`/api/menu/${id}`, {
    method: 'DELETE'
  });
}

// Orders API
export async function getOrders(params?: {
  status?: string;
  phone?: string;
  search?: string;
}): Promise<{ success: boolean; count: number; orders: Order[] }> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== 'All') query.set('status', params.status);
  if (params?.phone) query.set('phone', params.phone);
  if (params?.search) query.set('search', params.search);
  const qs = query.toString();
  return fetcher(`/api/orders${qs ? `?${qs}` : ''}`);
}

export async function getOrderById(id: string): Promise<{ success: boolean; order: Order }> {
  return fetcher(`/api/orders/${id}`);
}

export async function placeOrder(
  payload: CreateOrderPayload
): Promise<{ success: boolean; message: string; order: Order }> {
  return fetcher('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<{ success: boolean; message: string; order: Order }> {
  return fetcher(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function deleteOrder(id: string): Promise<{ success: boolean; message: string }> {
  return fetcher(`/api/orders/${id}`, {
    method: 'DELETE'
  });
}

// Customer Portal API
export async function getCustomerOrders(
  phone: string
): Promise<{ success: boolean; phone: string; count: number; orders: Order[] }> {
  return fetcher(`/api/customer/orders?phone=${encodeURIComponent(phone)}`);
}

export async function getCustomerProfile(
  phone: string
): Promise<{ success: boolean; exists: boolean; profile: CustomerProfile | null }> {
  return fetcher(`/api/customer/profile?phone=${encodeURIComponent(phone)}`);
}

export async function saveCustomerProfile(
  payload: CustomerProfilePayload
): Promise<{ success: boolean; message: string; profile: CustomerProfile }> {
  return fetcher('/api/customer/profile', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// Admin Stats API
export async function getAdminStats(): Promise<{ success: boolean; stats: AdminStats }> {
  return fetcher('/api/admin/stats');
}
