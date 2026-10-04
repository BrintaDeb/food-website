'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Package,
  MapPin,
  Search,
  CheckCircle2,
  Plus,
  Loader2,
  Phone,
  Clock,
  Bike
} from 'lucide-react';
import {
  getMenuItems,
  getCustomerOrders,
  getCustomerProfile,
  saveCustomerProfile
} from '@/lib/api';
import { useCart } from '@/hooks/useCart';
import { formatINR } from '@/lib/utils';
import { toast } from '@/lib/toast';
import type { MenuItem, MenuCategory } from '@/types/menu';
import type { Order } from '@/types/order';
import type { CustomerProfile } from '@/types/customer';
import { ReceiptModal } from '@/components/checkout/ReceiptModal';

export default function CustomerPortalPage() {
  const [activeTab, setActiveTab] = useState<'order' | 'myOrders' | 'addresses'>('order');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMenu, setLoadingMenu] = useState(true);

  // Orders Lookup State
  const [lookupPhone, setLookupPhone] = useState('');
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);

  // Saved Addresses State
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [newAddressInput, setNewAddressInput] = useState('');

  // Cart Hook
  const { safeTotalCount: totalCount, addItem, toggleCart } = useCart();

  useEffect(() => {
    getMenuItems()
      .then((res) => setMenu(res.items))
      .catch(() => {})
      .finally(() => setLoadingMenu(false));
  }, []);

  // Real-time live status updates for viewed orders via SSE
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/orders/stream');

      eventSource.addEventListener('order_updated', (e) => {
        try {
          const payload = JSON.parse(e.data) as {
            orderId: string;
            status: Order['status'];
            statusStep: number;
            updatedAt: string;
          };

          setCustomerOrders((prev) => {
            const hasOrder = prev.some(
              (o) => o.orderId.toLowerCase() === payload.orderId.toLowerCase()
            );
            if (!hasOrder) return prev;

            toast.show(
              `Order #${payload.orderId} status updated: ${payload.status}!`,
              'info'
            );

            return prev.map((o) =>
              o.orderId.toLowerCase() === payload.orderId.toLowerCase()
                ? {
                    ...o,
                    status: payload.status,
                    statusStep: payload.statusStep,
                    updatedAt: payload.updatedAt
                  }
                : o
            );
          });
        } catch {
          // ignore parse errors
        }
      });
    } catch {
      // EventSource may not be supported in some environments
    }

    return () => {
      eventSource?.close();
    };
  }, []);

  const handleLookupOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanP = lookupPhone.replace(/\D/g, '');
    if (cleanP.length < 10) {
      toast.show('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    try {
      setLoadingOrders(true);
      const [orderRes, profileRes] = await Promise.all([
        getCustomerOrders(cleanP),
        getCustomerProfile(cleanP)
      ]);

      setCustomerOrders(orderRes.orders || []);
      if (profileRes.profile) {
        setCustomerProfile(profileRes.profile);
      }
      toast.show(`Found ${orderRes.orders.length} orders for ${cleanP}`, 'info');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lookup failed';
      toast.show(msg, 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressInput.trim()) return;
    const cleanP = lookupPhone.replace(/\D/g, '');
    if (cleanP.length < 10) {
      toast.show('Please look up your phone number first to save addresses.', 'error');
      return;
    }

    const currentAddrs = customerProfile?.addresses || [];
    const updated = [...currentAddrs, newAddressInput.trim()];

    try {
      const res = await saveCustomerProfile({
        phone: cleanP,
        name: customerProfile?.name || 'Valued Customer',
        addresses: updated
      });
      setCustomerProfile(res.profile);
      setNewAddressInput('');
      toast.show('New address saved to your profile!', 'success');
    } catch {
      toast.show('Failed to save address', 'error');
    }
  };

  const filteredMenu = menu.filter((item) => {
    const matchesCat =
      selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      {/* Top Portal Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E8E5E0] shadow-xs pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl sm:text-3xl shrink-0">🍛</span>
            <div className="min-w-0">
              <span className="font-outfit font-black text-lg sm:text-xl text-[#1A1311] block leading-none truncate">
                CurryCraft Portal
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-500 font-medium truncate hidden xs:block">
                Authentic Indian Online Ordering & Tracking
              </span>
            </div>
          </Link>

          {/* Portal Navigation Tabs */}
          <div className="hidden md:flex items-center gap-2 bg-[#FFFDF9] p-1.5 rounded-2xl border border-[#E8E5E0]">
            <button
              onClick={() => setActiveTab('order')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'order'
                  ? 'bg-[#FF5E00] text-white shadow-badge'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <span>🍔</span>
              <span>Order Food</span>
            </button>
            <button
              onClick={() => setActiveTab('myOrders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'myOrders'
                  ? 'bg-[#FF5E00] text-white shadow-badge'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>My Orders & Tracking</span>
              {customerOrders.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-white text-[#FF5E00] text-[10px]">
                  {customerOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-[#FF5E00] text-white shadow-badge'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex text-xs font-bold text-neutral-600 hover:text-[#FF5E00] transition-colors p-2"
            >
              Storefront
            </Link>
            <Link
              href="/admin"
              className="text-xs font-bold px-3 py-2 rounded-full bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 transition-colors min-h-[36px] flex items-center"
            >
              Admin Panel
            </Link>

            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-full text-[#1A1311] hover:bg-neutral-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#FF5E00] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex border-t border-[#E8E5E0] bg-[#FFFDF9] text-xs font-bold divide-x divide-[#E8E5E0]">
          <button
            onClick={() => setActiveTab('order')}
            className={`flex-1 min-h-[48px] py-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'order'
                ? 'text-[#FF5E00] font-black bg-[#FF5E00]/5 border-b-2 border-[#FF5E00]'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>🍛</span>
            <span>Order</span>
          </button>
          <button
            onClick={() => setActiveTab('myOrders')}
            className={`flex-1 min-h-[48px] py-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'myOrders'
                ? 'text-[#FF5E00] font-black bg-[#FF5E00]/5 border-b-2 border-[#FF5E00]'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>📦</span>
            <span>Orders</span>
            {customerOrders.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#FF5E00] text-white text-[10px] font-bold">
                {customerOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 min-h-[48px] py-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'addresses'
                ? 'text-[#FF5E00] font-black bg-[#FF5E00]/5 border-b-2 border-[#FF5E00]'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>📍</span>
            <span>Addresses</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full pb-32 sm:pb-12">
        {/* =========================================================================
            TAB 1: ORDER FOOD
            ========================================================================= */}
        {activeTab === 'order' && (
          <div className="space-y-8">
            {/* Hero Banner inside Portal */}
            <div className="rounded-3xl bg-linear-to-r from-[#1A1311] to-[#251C1A] text-white p-6 sm:p-10 shadow-float relative overflow-hidden">
              <div className="max-w-xl space-y-3 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FF5E00]/20 text-[#FF8516] text-xs font-bold uppercase tracking-wider">
                  ✨ Authentic Dum-Pukht & Royal Heritage
                </span>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-outfit font-black tracking-tight leading-tight">
                  Royal Flavors, Delivered Fresh to Your Doorstep
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300">
                  Select your favorite dum biryanis, dal sambar, and tandoori breads. Use promo code{' '}
                  <strong className="text-[#FF8516]">ROYAL50</strong> for 50% off!
                </p>
                <div className="flex flex-wrap gap-2 pt-2 text-[11px] sm:text-xs font-bold">
                  <span className="px-3 py-1.5 rounded-lg bg-white/10">⚡ 25-35 Min Delivery</span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/10">
                    📦 Tamper-Sealed Packaging
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/10">⭐ 4.9 Rated</span>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 touch-scroll scrollbar-none">
                {(
                  ['All', 'Biryani', 'Curries', 'Breads', 'Desserts & Beverages'] as MenuCategory[]
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#FF5E00] text-white shadow-badge'
                        : 'bg-white text-neutral-700 border border-[#E8E5E0] hover:bg-neutral-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search biryani, curries, naan..."
                  className="w-full pl-10 pr-4 py-2.5 text-base sm:text-xs rounded-xl border border-[#E8E5E0] bg-white focus:outline-none focus:border-[#FF5E00]"
                />
              </div>
            </div>

            {/* Menu Grid */}
            {loadingMenu ? (
              <div className="py-24 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#FF5E00]" />
                <p className="text-sm text-neutral-500 mt-2 font-medium">
                  Loading delicious items...
                </p>
              </div>
            ) : filteredMenu.length === 0 ? (
              <div className="py-16 text-center text-neutral-500 font-medium">
                No items found matching your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-5 border border-[#E8E5E0] shadow-card hover:shadow-float hover:-translate-y-1 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold mb-2">
                        <span className="uppercase tracking-wider text-[#FF5E00] font-bold">
                          {item.category}
                        </span>
                        <span>⏱️ {item.prepTime || '15 mins'}</span>
                      </div>

                      <div className="relative w-full h-44 my-2 flex items-center justify-center">
                        <Image
                          src={item.image.startsWith('/') ? item.image : `/${item.image}`}
                          alt={item.name}
                          width={180}
                          height={160}
                          style={{ width: 'auto', height: 'auto', maxHeight: '160px' }}
                          className="object-contain drop-shadow-md"
                        />
                      </div>

                      <h3 className="font-outfit font-black text-lg text-[#1A1311] mt-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description || 'Crafted with premium organic ingredients.'}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                      <span className="font-outfit font-black text-xl text-[#FF5E00]">
                        {formatINR(item.price)}
                      </span>
                      <button
                        onClick={() => {
                          addItem({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image
                          });
                          toast.show(`Added ${item.name} to bag!`, 'success');
                        }}
                        className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#FF5E00] hover:bg-[#e05200] text-white font-bold text-xs shadow-badge transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: MY ORDERS & TRACKING
            ========================================================================= */}
        {activeTab === 'myOrders' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Phone Lookup Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E5E0] shadow-card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF5E00]/10 text-[#FF5E00] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-outfit font-black text-[#1A1311]">
                    Track Your Orders
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Enter your 10-digit mobile number to view live order progress and receipts
                  </p>
                </div>
              </div>

              <form onSubmit={handleLookupOrders} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="tel"
                  required
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  placeholder="Enter 10-digit phone (e.g. 9123456780)"
                  className="flex-1 px-4 py-3 rounded-xl border border-[#E8E5E0] text-base sm:text-sm focus:outline-none focus:border-[#FF5E00]"
                />
                <button
                  type="submit"
                  disabled={loadingOrders}
                  className="px-6 py-3 min-h-[48px] rounded-xl bg-[#FF5E00] hover:bg-[#e05200] text-white font-bold text-sm shadow-badge transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loadingOrders ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Lookup Orders</span>
                  )}
                </button>
              </form>
            </div>

            {/* Orders List */}
            {customerOrders.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-outfit font-bold text-lg text-[#1A1311]">
                  Order History ({customerOrders.length})
                </h3>

                <div className="space-y-4">
                  {customerOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E8E5E0] shadow-card space-y-4"
                    >
                      {/* Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                        <div>
                          <span className="font-mono font-bold text-sm text-[#FF5E00]">
                            #{order.orderId}
                          </span>
                          <span className="text-xs text-neutral-400 ml-3">
                            {order.formattedDate} at {order.formattedTime}
                          </span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold">
                          {order.status}
                        </span>
                      </div>

                      {/* 4-Stage Live Tracking Bar */}
                      <div className="bg-[#FFFDF9] p-3 sm:p-4 rounded-2xl border border-[#E8E5E0]">
                        <div className="grid grid-cols-4 gap-1 text-center">
                          {[
                            { label: 'Confirmed', step: 1 },
                            { label: 'Kitchen', step: 2 },
                            { label: 'Out for Delivery', step: 3 },
                            { label: 'Delivered', step: 4 }
                          ].map((st) => {
                            const isDone = (order.statusStep || 1) >= st.step;
                            return (
                              <div key={st.step} className="flex flex-col items-center">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                    isDone
                                      ? 'bg-[#FF5E00] text-white'
                                      : 'bg-neutral-200 text-neutral-400'
                                  }`}
                                >
                                  {isDone ? '✓' : st.step}
                                </div>
                                <span
                                  className={`text-[10px] sm:text-xs font-bold mt-1 leading-tight ${
                                    isDone ? 'text-[#FF5E00]' : 'text-neutral-400'
                                  }`}
                                >
                                  {st.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Item Summary */}
                      <div className="text-xs text-neutral-600">
                        <p className="font-semibold text-neutral-800">
                          {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                        </p>
                        <p className="mt-1 text-neutral-400">
                          Destination: {order.customer.address}
                        </p>
                      </div>

                      {/* Footer Totals & View Ticket Action */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-xs text-neutral-400 block font-medium">
                            TOTAL PAID
                          </span>
                          <span className="font-outfit font-black text-xl text-[#1A1311]">
                            {formatINR(order.pricing.grandTotal)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                          <Link
                            href={`/portal/track/${order.orderId}`}
                            className="flex-1 sm:flex-initial min-h-[44px] flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FF5E00] hover:bg-[#e05200] text-white text-xs font-bold transition shadow-sm"
                          >
                            <Bike size={16} />
                            <span>Live Map Tracking</span>
                          </Link>
                          <button
                            onClick={() => setSelectedOrderForReceipt(order)}
                            className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                          >
                            View Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: SAVED ADDRESSES
            ========================================================================= */}
        {activeTab === 'addresses' && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E5E0] shadow-card space-y-6">
              <div>
                <h2 className="text-xl font-outfit font-black text-[#1A1311]">
                  Saved Delivery Addresses
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Manage your primary drop-off locations for rapid 1-click checkout
                </p>
              </div>

              {/* Add New Address Form */}
              <form onSubmit={handleSaveAddress} className="space-y-3">
                <label className="block text-xs font-bold text-neutral-700">Add New Address</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    value={newAddressInput}
                    onChange={(e) => setNewAddressInput(e.target.value)}
                    placeholder="e.g. Flat 302, Palm Heights, Indiranagar, Bengaluru"
                    className="flex-1 px-4 py-3 rounded-xl border border-[#E8E5E0] text-base sm:text-sm focus:outline-none focus:border-[#FF5E00]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 min-h-[48px] rounded-xl bg-[#1A1311] hover:bg-black text-white font-bold text-sm transition-colors shrink-0 cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              </form>

              {/* Addresses List */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <h4 className="text-xs font-black tracking-wider text-neutral-400 uppercase">
                  Your Saved Addresses
                </h4>
                {customerProfile && customerProfile.addresses.length > 0 ? (
                  customerProfile.addresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8E5E0] flex items-start gap-3"
                    >
                      <MapPin className="w-5 h-5 text-[#FF5E00] shrink-0 mt-0.5" />
                      <div className="flex-1 text-xs sm:text-sm text-neutral-700 font-medium">
                        {addr}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-400">
                    No addresses saved yet. Use the phone lookup in the tracking tab or save one
                    above!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Digital Receipt Modal */}
      {selectedOrderForReceipt && (
        <ReceiptModal
          order={selectedOrderForReceipt}
          isOpen={Boolean(selectedOrderForReceipt)}
          onClose={() => setSelectedOrderForReceipt(null)}
        />
      )}
    </div>
  );
}
