import type { LatLngTuple } from '@/types/tracking';

// Realistic Bengaluru street route from Indiranagar kitchen to Koramangala customer address
export const BENGALURU_DELIVERY_ROUTE: LatLngTuple[] = [
  [12.9784, 77.6408], // CurryCraft Kitchen, 100ft Road, Indiranagar
  [12.9751, 77.6412], // 100ft Road junction
  [12.9698, 77.6421], // Indiranagar 12th Main
  [12.9642, 77.6428], // Domlur Club signal
  [12.9605, 77.6385], // Domlur Flyover entry
  [12.9568, 77.6352], // EGL (Embassy Golf Links)
  [12.9515, 77.6321], // Inner Ring Road corridor
  [12.9462, 77.6294], // Koramangala Srinivagilu junction
  [12.9411, 77.6272], // Maharaja Signal, 80ft Road
  [12.9385, 77.6258], // Sony World Signal
  [12.9362, 77.6251], // Koramangala 4th Block entry
  [12.9352, 77.6245] // Customer Destination, Koramangala
];

export function calculateBearing(start: LatLngTuple, end: LatLngTuple): number {
  const startLat = (start[0] * Math.PI) / 180;
  const startLng = (start[1] * Math.PI) / 180;
  const endLat = (end[0] * Math.PI) / 180;
  const endLng = (end[1] * Math.PI) / 180;

  const dLng = endLng - startLng;

  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

export function calculateDistanceKm(coord1: LatLngTuple, coord2: LatLngTuple): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const dLng = ((coord2[1] - coord1[1]) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1[0] * Math.PI) / 180) *
      Math.cos((coord2[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
}
