import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrders } from '@/lib/db';
import { updateOrderStatusSchema } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const statusStepMap = {
  Confirmed: 1,
  Preparing: 2,
  'Out for Delivery': 3,
  Delivered: 4,
  Cancelled: 0
} as const;

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateOrderStatusSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: validated.error.issues.map((e: { message: string }) => e.message).join(', ')
        },
        { status: 400 }
      );
    }

    const { status } = validated.data;
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

    order.status = status;
    order.statusStep = statusStepMap[status] ?? 1;
    order.updatedAt = new Date().toISOString();

    await saveOrders(orders);

    return NextResponse.json({
      success: true,
      message: `Order #${order.orderId} status updated to ${status}.`,
      order
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update order status';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
