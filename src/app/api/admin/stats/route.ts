import { NextResponse } from 'next/server';
import { getOrders, getMenu } from '@/lib/db';
import type { AdminStats } from '@/types/stats';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await getOrders();
    const menu = await getMenu();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);

    const todayStr = new Date().toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata'
    });

    const todayOrders = orders.filter((o) => {
      try {
        return (
          new Date(o.createdAt).toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata'
          }) === todayStr
        );
      } catch {
        return false;
      }
    });

    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);

    const statusCounts = {
      confirmed: orders.filter((o) => o.status === 'Confirmed').length,
      preparing: orders.filter((o) => o.status === 'Preparing').length,
      outForDelivery: orders.filter((o) => o.status === 'Out for Delivery').length,
      delivered: orders.filter((o) => o.status === 'Delivered').length,
      cancelled: orders.filter((o) => o.status === 'Cancelled').length
    };

    const pendingOrders =
      statusCounts.confirmed + statusCounts.preparing + statusCounts.outForDelivery;

    const stats: AdminStats = {
      totalOrders,
      totalRevenue: +totalRevenue.toFixed(2),
      todayOrdersCount: todayOrders.length,
      todayRevenue: +todayRevenue.toFixed(2),
      pendingOrders,
      menuItemsCount: menu.length,
      statusCounts
    };

    return NextResponse.json({ success: true, stats });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch admin stats';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
