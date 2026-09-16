import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPhone = searchParams.get('phone') || '';
    const cleanPhone = rawPhone.replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    const orders = await getOrders();
    const customerOrders = orders.filter(
      (o) => (o.customer?.phone || '').replace(/\D/g, '') === cleanPhone
    );

    return NextResponse.json({
      success: true,
      phone: cleanPhone,
      count: customerOrders.length,
      orders: customerOrders
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve customer orders';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
