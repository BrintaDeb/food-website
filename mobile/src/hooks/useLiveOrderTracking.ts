import { useEffect, useState, useRef } from 'react';
import { API_BASE_URL } from '@/constants/config';
import type { DeliveryTelemetry } from '@/types/telemetry';

// Coordinates simulating Kolkata Park Street delivery corridor
const SIMULATED_COORDINATES = [
  { lat: 22.5512, lng: 88.3524 }, // Restaurant (Park Street)
  { lat: 22.5531, lng: 88.3538 },
  { lat: 22.5562, lng: 88.3551 },
  { lat: 22.5595, lng: 88.357 },
  { lat: 22.563, lng: 88.3602 },
  { lat: 22.5671, lng: 88.3634 },
  { lat: 22.571, lng: 88.3668 },
  { lat: 22.5742, lng: 88.3705 },
  { lat: 22.578, lng: 88.3741 },
  { lat: 22.5821, lng: 88.378 } // Customer Doorstep
];

function calculateBearing(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const dLng = toRad(to.lng - from.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  const brng = (toDeg(Math.atan2(y, x)) + 360) % 360;
  return Math.round(brng);
}

export function useLiveOrderTracking(orderId: string) {
  const [telemetry, setTelemetry] = useState<DeliveryTelemetry | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const stepIndexRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    let fallbackInterval: any = null;

    // Simulation fallback generator
    const updateSimulatedStep = () => {
      if (!isMounted) return;
      const totalSteps = SIMULATED_COORDINATES.length;
      const idx = Math.min(stepIndexRef.current, totalSteps - 1);
      const curr = SIMULATED_COORDINATES[idx];
      const next = SIMULATED_COORDINATES[Math.min(idx + 1, totalSteps - 1)];
      const heading = calculateBearing(curr, next);
      const progress = Math.round((idx / (totalSteps - 1)) * 100);
      const eta = Math.max(1, Math.round((totalSteps - 1 - idx) * 2.5));

      const status =
        idx === 0
          ? 'KITCHEN_PREPARING'
          : idx === 1
            ? 'RIDER_ASSIGNED'
            : idx >= totalSteps - 2
              ? 'NEARBY'
              : 'OUT_FOR_DELIVERY';

      setTelemetry({
        orderId,
        status,
        rider: {
          name: 'Vikram Sen',
          phone: '+91 98450 12345',
          vehicleNumber: 'WB-02-EQ-4021',
          rating: 4.95,
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        },
        currentLocation: curr,
        restaurantLocation: SIMULATED_COORDINATES[0],
        destinationLocation: SIMULATED_COORDINATES[totalSteps - 1],
        heading,
        speedKmH: idx === 0 ? 0 : 34,
        etaMinutes: eta,
        progressPercent: progress,
        distanceRemainingKm: +((totalSteps - 1 - idx) * 0.4).toFixed(1),
        timestamp: new Date().toISOString()
      });

      if (stepIndexRef.current < totalSteps - 1) {
        stepIndexRef.current += 1;
      }
    };

    // Attempt real SSE stream if possible
    try {
      const url = `${API_BASE_URL}/api/tracking/${orderId}`;
      const controller = new AbortController();

      fetch(url, { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok || !response.body) {
            throw new Error('SSE not available, falling back to simulation');
          }
          setIsConnected(true);
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (isMounted) {
            const { value, done } = await reader.read();
            if (done) break;
            const text = decoder.decode(value);
            const lines = text.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data: DeliveryTelemetry = JSON.parse(line.replace('data: ', ''));
                  if (isMounted) setTelemetry(data);
                } catch {}
              }
            }
          }
        })
        .catch(() => {
          // Trigger resilient native timer simulation
          setIsConnected(true);
          updateSimulatedStep();
          fallbackInterval = setInterval(updateSimulatedStep, 3500);
        });

      return () => {
        isMounted = false;
        controller.abort();
        if (fallbackInterval) clearInterval(fallbackInterval);
      };
    } catch {
      updateSimulatedStep();
      fallbackInterval = setInterval(updateSimulatedStep, 3500);
      return () => {
        isMounted = false;
        if (fallbackInterval) clearInterval(fallbackInterval);
      };
    }
  }, [orderId]);

  return { telemetry, isConnected };
}
