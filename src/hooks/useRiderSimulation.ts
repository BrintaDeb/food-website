'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BENGALURU_DELIVERY_ROUTE,
  calculateBearing,
  calculateDistanceKm
} from '@/lib/tracking-utils';
import type { DeliveryTelemetry } from '@/types/tracking';

export function useRiderSimulation(orderId: string) {
  const [telemetry, setTelemetry] = useState<DeliveryTelemetry | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const localIndexRef = useRef(0);
  const localTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startLocalFallback = useCallback(() => {
    if (localTimerRef.current) clearInterval(localTimerRef.current);

    const totalSteps = BENGALURU_DELIVERY_ROUTE.length;
    localTimerRef.current = setInterval(() => {
      const idx = localIndexRef.current;
      if (idx >= totalSteps) {
        const finalCoord = BENGALURU_DELIVERY_ROUTE[totalSteps - 1];
        setTelemetry({
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
        });
        if (localTimerRef.current) clearInterval(localTimerRef.current);
        return;
      }

      const curr = BENGALURU_DELIVERY_ROUTE[idx];
      const next = BENGALURU_DELIVERY_ROUTE[Math.min(idx + 1, totalSteps - 1)];
      const heading = calculateBearing(curr, next);
      const distanceRemaining = calculateDistanceKm(curr, BENGALURU_DELIVERY_ROUTE[totalSteps - 1]);
      const progress = Math.round((idx / (totalSteps - 1)) * 100);
      const etaMinutes = Math.max(1, Math.round(distanceRemaining * 2.5));

      setTelemetry({
        orderId,
        status:
          idx === 0
            ? 'KITCHEN_PREPARING'
            : idx === 1
              ? 'RIDER_ASSIGNED'
              : idx >= totalSteps - 2
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
        speedKmH: idx === 0 ? 0 : Math.floor(30 + Math.random() * 6),
        etaMinutes,
        progressPercent: progress,
        distanceRemainingKm: distanceRemaining,
        timestamp: new Date().toISOString()
      });

      localIndexRef.current++;
    }, 1800);
  }, [orderId]);

  useEffect(() => {
    if (typeof window === 'undefined' || !orderId) return;

    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(`/api/tracking/${orderId}`);

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: DeliveryTelemetry = JSON.parse(event.data);
          setTelemetry(data);
          if (data.status === 'DELIVERED') {
            eventSource?.close();
          }
        } catch {
          // ignore parse error
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource?.close();
        // Fallback to local smooth interpolator
        startLocalFallback();
      };
    } catch {
      startLocalFallback();
    }

    return () => {
      if (eventSource) eventSource.close();
      if (localTimerRef.current) clearInterval(localTimerRef.current);
    };
  }, [orderId, startLocalFallback]);

  const restartSimulation = () => {
    localIndexRef.current = 0;
    startLocalFallback();
  };

  return {
    telemetry,
    routeWaypoints: BENGALURU_DELIVERY_ROUTE,
    isConnected,
    restartSimulation
  };
}
