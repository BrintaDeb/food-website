'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  RefreshCw,
  Search,
  CheckCircle,
  Truck,
  Flame,
  Loader2,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { getOrders, getMenuItems, updateOrderStatus, getAdminStats } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { toast } from '@/lib/toast';
import type { Order, OrderStatus } from '@/types/order';
import type { MenuItem } from '@/types/menu';
import type { AdminStats } from '@/types/stats';
import { MenuDataTable } from '@/components/admin/MenuDataTable';

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter & Search State
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [ordersRes, menuRes, statsRes] = await Promise.all([
        getOrders(),
        getMenuItems(),
        getAdminStats()
      ]);
      setOrders(ordersRes.orders || []);
      setMenu(menuRes.items || []);
      setStats(statsRes.stats || null);
    } catch {
      toast.show('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Order Status Advancement Handler
  const handleAdvanceStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const res = await updateOrderStatus(orderId, nextStatus);
      if (res.success) {
        toast.show(`Order #${orderId} updated to ${nextStatus}`, 'success');
        loadData();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Status update failed';
      toast.show(msg, 'error');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'All' || (order.status || '').toLowerCase() === statusFilter.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      (order.orderId || '').toLowerCase().includes(q) ||
      (order.customer?.name || '').toLowerCase().includes(q) ||
      (order.customer?.phone || '').includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-[#120B08] text-white border-b border-neutral-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍛</span>
            <div>
              <span className="font-outfit font-black text-xl tracking-tight block leading-none text-white">
                CurryCraft Admin
              </span>
              <span className="text-xs text-[#FFB088] font-medium flex items-center gap-1 mt-0.5">
                <ShieldCheck size={12} className="text-emerald-400" />
                Executive Chef Operations
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-2 bg-neutral-900/80 p-1.5 rounded-2xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#FF5E00] text-white shadow-badge'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Live Orders</span>
              {stats?.pendingOrders ? (
                <span className="px-1.5 py-0.5 rounded-full bg-white text-[#FF5E00] text-[10px] font-black">
                  {stats.pendingOrders}
                </span>
              ) : null}
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'menu'
                  ? 'bg-[#FF5E00] text-white shadow-badge'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Indian Menu Catalog</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#FF5E00] text-white shadow-badge'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Kitchen Analytics</span>
            </button>
          </div>

          {/* External Links, Admin Profile & Sign Out */}
          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              className="hidden sm:inline-block text-xs font-bold text-neutral-300 hover:text-[#FF8516] transition-colors"
            >
              Portal
            </Link>
            <Link
              href="/"
              className="text-xs font-bold text-neutral-300 hover:text-[#FF8516] transition-colors"
            >
              Storefront
            </Link>

            <button
              onClick={loadData}
              disabled={refreshing}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
              aria-label="Refresh live data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {session?.user && (
              <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-neutral-800 text-xs">
                <span className="text-neutral-400">Signed in as</span>
                <span className="font-bold text-white truncate max-w-[140px]">
                  {session.user.name || session.user.email}
                </span>
              </div>
            )}

            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold text-xs transition"
              title="Sign Out of Admin"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex border-t border-neutral-800 bg-neutral-900 text-xs font-bold divide-x divide-neutral-800">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center ${activeTab === 'orders' ? 'text-[#FF5E00] font-black' : 'text-neutral-400'}`}
          >
            📋 Orders ({stats?.pendingOrders || 0})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-3 text-center ${activeTab === 'menu' ? 'text-[#FF5E00] font-black' : 'text-neutral-400'}`}
          >
            🍛 Menu
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 text-center ${activeTab === 'analytics' ? 'text-[#FF5E00] font-black' : 'text-neutral-400'}`}
          >
            📊 Stats
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full space-y-8">
        {/* =========================================================================
            TAB 1: LIVE ORDERS DASHBOARD
            ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-5 rounded-3xl bg-white border border-[#E8E5E0] shadow-card">
                <span className="text-xs font-black tracking-wider text-neutral-400 uppercase">
                  Total Revenue
                </span>
                <p className="font-outfit font-black text-2xl sm:text-3xl text-[#1A1311] mt-1">
                  {formatINR(stats?.totalRevenue || 0)}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {formatINR(stats?.todayRevenue || 0)} today
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#E8E5E0] shadow-card">
                <span className="text-xs font-black tracking-wider text-neutral-400 uppercase">
                  Total Orders
                </span>
                <p className="font-outfit font-black text-2xl sm:text-3xl text-[#1A1311] mt-1">
                  {stats?.totalOrders || 0}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {stats?.todayOrdersCount || 0} placed today
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-[#FF5E00]/5 border border-[#FF5E00]/30 shadow-card">
                <span className="text-xs font-black tracking-wider text-[#FF5E00] uppercase">
                  Active / In Kitchen
                </span>
                <p className="font-outfit font-black text-2xl sm:text-3xl text-[#FF5E00] mt-1">
                  {stats?.pendingOrders || 0}
                </p>
                <p className="text-xs text-[#FF8516] mt-1">Needs prep or delivery</p>
              </div>

              <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-card">
                <span className="text-xs font-black tracking-wider text-emerald-700 uppercase">
                  Delivered
                </span>
                <p className="font-outfit font-black text-2xl sm:text-3xl text-emerald-700 mt-1">
                  {stats?.statusCounts.delivered || 0}
                </p>
                <p className="text-xs text-emerald-600 mt-1">Completed orders</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                {['All', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        statusFilter === status
                          ? 'bg-[#1A1311] text-white'
                          : 'bg-white text-neutral-700 border border-[#E8E5E0] hover:bg-neutral-50'
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID, customer, phone..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E8E5E0] bg-white focus:outline-none focus:border-[#FF5E00]"
                />
              </div>
            </div>

            {/* Orders Dispatch Cards */}
            {loading ? (
              <div className="py-24 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#FF5E00]" />
                <p className="text-sm text-neutral-500 mt-2 font-medium">Fetching live orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-16 text-center text-neutral-500 font-medium">
                No orders matching the current filter.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 rounded-3xl bg-white border border-[#E8E5E0] shadow-card space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                      <div>
                        <span className="font-mono font-black text-base text-[#FF5E00]">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-neutral-400 font-semibold block">CUSTOMER</span>
                        <p className="font-bold text-neutral-800 mt-0.5">{order.customer.name}</p>
                        <p className="text-neutral-500">{order.customer.phone}</p>
                      </div>
                      <div>
                        <span className="text-neutral-400 font-semibold block">
                          DELIVERY ADDRESS
                        </span>
                        <p className="font-medium text-neutral-700 mt-0.5">
                          {order.customer.address}
                        </p>
                        <p className="text-neutral-400 mt-0.5">{order.customer.deliveryType}</p>
                      </div>
                      <div>
                        <span className="text-neutral-400 font-semibold block">
                          PAYMENT & TOTAL
                        </span>
                        <p className="font-bold text-neutral-800 mt-0.5">
                          {order.customer.paymentMethod}
                        </p>
                        <p className="font-outfit font-black text-base text-[#FF5E00] mt-0.5">
                          {formatINR(order.pricing.grandTotal)}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-[#FFFDF9] p-3.5 rounded-2xl border border-[#E8E5E0] text-xs text-neutral-700">
                      <span className="font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                        Ordered Items:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((i) => (
                          <span
                            key={i.id}
                            className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E5E0] font-medium"
                          >
                            {i.name} (x{i.quantity}) • {formatINR(i.lineTotal)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status Action Pipeline */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {order.status === 'Confirmed' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'Preparing')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-xs hover:bg-amber-600 transition-colors"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Advance to Kitchen (Preparing)</span>
                          </button>
                        )}
                        {order.status === 'Preparing' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'Out for Delivery')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-xs shadow-xs hover:bg-blue-600 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Advance to Out for Delivery</span>
                          </button>
                        )}
                        {order.status === 'Out for Delivery' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'Delivered')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Mark Delivered</span>
                          </button>
                        )}
                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleAdvanceStatus(order.id, 'Cancelled')}
                            className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: INDIAN CUISINE MENU MANAGER (DATA TABLE & CRUD)
            ========================================================================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-outfit font-black text-[#1A1311]">
                Indian Cuisine Menu Catalog
              </h2>
              <p className="text-xs text-neutral-500">
                Manage authentic Indian specialties (Biryani, Curries, Breads, Sweets), update
                pricing, tags, and dietary badges
              </p>
            </div>

            <MenuDataTable initialItems={menu} onRefresh={loadData} />
          </div>
        )}

        {/* =========================================================================
            TAB 3: ANALYTICS
            ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-3xl bg-white border border-[#E8E5E0] shadow-card space-y-6">
              <h2 className="text-2xl font-outfit font-black text-[#1A1311]">Kitchen Analytics</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8E5E0] space-y-2">
                  <span className="text-xs font-bold text-neutral-400 uppercase">
                    Average Order Value (AOV)
                  </span>
                  <p className="font-outfit font-black text-3xl text-[#1A1311]">
                    {formatINR(
                      stats?.totalOrders ? +(stats.totalRevenue / stats.totalOrders).toFixed(2) : 0
                    )}
                  </p>
                  <p className="text-xs text-neutral-500">Based on lifetime completed sales</p>
                </div>

                <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E8E5E0] space-y-2">
                  <span className="text-xs font-bold text-neutral-400 uppercase">
                    Menu Items Active
                  </span>
                  <p className="font-outfit font-black text-3xl text-[#1A1311]">
                    {stats?.menuItemsCount || 0}
                  </p>
                  <p className="text-xs text-neutral-500">Biryani, Curries, Breads, and Sweets</p>
                </div>
              </div>

              {/* Status Breakdown Bar */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <h4 className="text-xs font-black tracking-wider text-neutral-400 uppercase">
                  Orders By Status
                </h4>
                <div className="space-y-2">
                  {Object.entries(stats?.statusCounts || {}).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between text-xs font-bold">
                      <span className="capitalize text-neutral-600">{key}</span>
                      <span className="text-[#FF5E00]">{val} orders</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
