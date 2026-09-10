import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrders } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const orders = await getOrders();
    const order = orders.find(
      (o) => (o.orderId || '').toLowerCase() === id.toLowerCase() || o.id === id
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: `Order #${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve order';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const orders = await getOrders();
    const index = orders.findIndex(
      (o) => (o.orderId || '').toLowerCase() === id.toLowerCase() || o.id === id
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: `Order #${id} not found.` },
        { status: 404 }
      );
    }

    const removed = orders.splice(index, 1)[0];
    await saveOrders(orders);

    return NextResponse.json({
      success: true,
      message: `Order #${removed?.orderId ?? id} deleted.`
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete order';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
