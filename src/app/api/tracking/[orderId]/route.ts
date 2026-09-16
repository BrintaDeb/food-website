import { NextRequest } from 'next/server';
import {
  BENGALURU_DELIVERY_ROUTE,
  calculateBearing,
  calculateDistanceKm
} from '@/lib/tracking-utils';
import type { DeliveryTelemetry } from '@/types/tracking';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let stepIndex = 0;
      const totalSteps = BENGALURU_DELIVERY_ROUTE.length;

      const interval = setInterval(() => {
        if (stepIndex >= totalSteps) {
          const finalCoord = BENGALURU_DELIVERY_ROUTE[totalSteps - 1];
          const telemetry: DeliveryTelemetry = {
            orderId,
            status: 'DELIVERED',
            rider: {
              name: 'Vikram Sen',
              phone: '+91 98450 12345',
              vehicleNumber: 'KA-01-EQ-4021',
              rating: 4.95,
              photo: '/images/delivery-rider.jpg'
            },
            currentLocation: finalCoord,
            restaurantLocation: BENGALURU_DELIVERY_ROUTE[0],
            destinationLocation: finalCoord,
            heading: 0,
            speedKmH: 0,
            etaMinutes: 0,
            progressPercent: 100,
            distanceRemainingKm: 0,
            timestamp: new Date().toISOString()
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(telemetry)}\n\n`));
          clearInterval(interval);
          controller.close();
          return;
        }

        const curr = BENGALURU_DELIVERY_ROUTE[stepIndex];
        const next = BENGALURU_DELIVERY_ROUTE[Math.min(stepIndex + 1, totalSteps - 1)];
        const heading = calculateBearing(curr, next);
        const distanceRemaining = calculateDistanceKm(
          curr,
          BENGALURU_DELIVERY_ROUTE[totalSteps - 1]
        );
        const progress = Math.round((stepIndex / (totalSteps - 1)) * 100);
        const etaMinutes = Math.max(1, Math.round(distanceRemaining * 2.5));

        const telemetry: DeliveryTelemetry = {
          orderId,
          status:
            stepIndex === 0
              ? 'KITCHEN_PREPARING'
              : stepIndex === 1
                ? 'RIDER_ASSIGNED'
                : stepIndex >= totalSteps - 2
                  ? 'NEARBY'
                  : 'OUT_FOR_DELIVERY',
          rider: {
            name: 'Vikram Sen',
            phone: '+91 98450 12345',
            vehicleNumber: 'KA-01-EQ-4021',
            rating: 4.95,
            photo: '/images/delivery-rider.jpg'
          },
          currentLocation: curr,
          restaurantLocation: BENGALURU_DELIVERY_ROUTE[0],
          destinationLocation: BENGALURU_DELIVERY_ROUTE[totalSteps - 1],
          heading,
          speedKmH: stepIndex === 0 ? 0 : Math.floor(28 + Math.random() * 8),
          etaMinutes,
          progressPercent: progress,
          distanceRemainingKm: distanceRemaining,
          timestamp: new Date().toISOString()
        };

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(telemetry)}\n\n`));
        stepIndex++;
      }, 1500);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    }
  });
}
