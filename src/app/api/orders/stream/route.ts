import { NextRequest } from 'next/server';
import { orderEvents, OrderUpdatedPayload } from '@/lib/orderEvents';
import type { Order } from '@/types/order';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get('admin') === 'true';
  const filterPhone = searchParams.get('phone')?.replace(/\D/g, '') || '';
  const filterOrderId = (searchParams.get('orderId') || '').toLowerCase();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connected acknowledgement
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`)
      );

      // Listener for newly placed orders (relevant for Admin & matching customer)
      const handleOrderCreated = (order: Order) => {
        try {
          const orderCleanPhone = (order.customer.phone || '').replace(/\D/g, '');
          const isMatch =
            isAdmin ||
            (filterPhone && orderCleanPhone === filterPhone) ||
            (filterOrderId && order.orderId.toLowerCase() === filterOrderId);

          if (isMatch) {
            controller.enqueue(
              encoder.encode(`event: order_created\ndata: ${JSON.stringify(order)}\n\n`)
            );
          }
        } catch {
          // Controller might be closed
        }
      };

      // Listener for order status pipeline advancements
      const handleOrderUpdated = (payload: OrderUpdatedPayload) => {
        try {
          const payloadCleanPhone = (payload.phone || '').replace(/\D/g, '');
          const isMatch =
            isAdmin ||
            (filterOrderId && payload.orderId.toLowerCase() === filterOrderId) ||
            (filterPhone && (!payloadCleanPhone || payloadCleanPhone === filterPhone)) ||
            !filterPhone; // Broadcast status updates so portals can match by orderId in state

          if (isMatch) {
            controller.enqueue(
              encoder.encode(`event: order_updated\ndata: ${JSON.stringify(payload)}\n\n`)
            );
          }
        } catch {
          // Controller might be closed
        }
      };

      orderEvents.on('order:created', handleOrderCreated);
      orderEvents.on('order:updated', handleOrderUpdated);

      // 15-second heartbeat ping to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat ${Date.now()}\n\n`));
        } catch {
          clearInterval(heartbeatInterval);
        }
      }, 15000);

      // Clean cleanup on client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        orderEvents.off('order:created', handleOrderCreated);
        orderEvents.off('order:updated', handleOrderUpdated);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    }
  });
}
