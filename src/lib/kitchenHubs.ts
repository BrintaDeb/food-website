import type { KitchenHub } from '@/types/hub';

export const BENGALURU_KITCHEN_HUBS: KitchenHub[] = [
  {
    id: 'indiranagar-flagship',
    name: 'Indiranagar Flagship Kitchen',
    area: 'Indiranagar',
    address: 'Plot 482, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
    phone: '+91 80 4125 7890',
    coordinates: { lat: 12.9716, lng: 77.6412 },
    specialties: ['Kolkata Dum Biryani', 'Slow Dum Handis', 'Royal Kebab Platter'],
    status: 'Active',
    waitMinutes: 20,
    rating: 4.9,
    deliveryRadiusKm: 12
  },
  {
    id: 'koramangala-heritage',
    name: 'Koramangala Heritage Hub',
    area: 'Koramangala',
    address: '88, 5th Block, Industrial Layout, Koramangala, Bengaluru 560095',
    phone: '+91 80 4132 4567',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    specialties: ['Awadhi Dum Mutton', 'Tandoori Garlic Naan', 'Kesari Rabdi'],
    status: 'Active',
    waitMinutes: 25,
    rating: 4.88,
    deliveryRadiusKm: 10
  },
  {
    id: 'whitefield-outpost',
    name: 'Whitefield Royal Outpost',
    area: 'Whitefield',
    address: 'Brigade IRV Centre, Nallurhalli, Whitefield, Bengaluru 560066',
    phone: '+91 80 4256 1234',
    coordinates: { lat: 12.9698, lng: 77.7499 },
    specialties: ['Corporate Dastarkhwan', 'Dum Biryanis', 'Kulhad Chai'],
    status: 'Active',
    waitMinutes: 18,
    rating: 4.85,
    deliveryRadiusKm: 14
  },
  {
    id: 'hsr-gourmet',
    name: 'HSR Layout Gourmet Station',
    area: 'HSR Layout',
    address: '422, 27th Main Rd, Sector 1, HSR Layout, Bengaluru 560102',
    phone: '+91 80 4188 9012',
    coordinates: { lat: 12.9121, lng: 77.6446 },
    specialties: ['Family Dum Feast', 'Dal Makhani Dum', 'Shahi Paneer'],
    status: 'Active',
    waitMinutes: 22,
    rating: 4.92,
    deliveryRadiusKm: 11
  },
  {
    id: 'malleshwaram-traditional',
    name: 'Malleshwaram Traditional Kitchen',
    area: 'Malleshwaram',
    address: '154, 8th Cross, Sampige Road, Malleshwaram, Bengaluru 560003',
    phone: '+91 80 4112 3456',
    coordinates: { lat: 13.0031, lng: 77.5701 },
    specialties: ['Classic Dal Sambar', 'Pure Veg Curries', 'Kulhad Phirni'],
    status: 'Active',
    waitMinutes: 16,
    rating: 4.94,
    deliveryRadiusKm: 10
  }
];

export const DEFAULT_KITCHEN_HUB = BENGALURU_KITCHEN_HUBS[0];

/**
 * Calculate distance between two GPS coordinates using the Haversine formula (km)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = R * c;

  // Road curvature factor in Indian metropolitan areas ~ 1.28x
  const roadDistanceKm = +(straightLineKm * 1.28).toFixed(1);
  return roadDistanceKm;
}

/**
 * Finds the nearest kitchen hub for given coordinates and computes ETA
 */
export function findNearestHub(
  userLat: number,
  userLng: number
): { hub: KitchenHub; distanceKm: number; etaMinutes: number } {
  let nearest = DEFAULT_KITCHEN_HUB;
  let minDistance = Infinity;

  for (const hub of BENGALURU_KITCHEN_HUBS) {
    const dist = calculateHaversineDistance(
      userLat,
      userLng,
      hub.coordinates.lat,
      hub.coordinates.lng
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearest = hub;
    }
  }

  // Delivery ETA: Kitchen prep time + ~2.5 mins per km road transit
  const transitTime = Math.round(minDistance * 2.5);
  const etaMinutes = nearest.waitMinutes + transitTime;

  return {
    hub: nearest,
    distanceKm: minDistance,
    etaMinutes
  };
}

/**
 * Matches common Bengaluru localities to the nearest hub
 */
export function matchAreaToHub(locality: string): KitchenHub {
  const q = locality.toLowerCase();

  if (q.includes('koramangala') || q.includes('ejipura') || q.includes('btm') || q.includes('jayanagar') || q.includes('jp nagar') || q.includes('bannerghatta')) {
    return BENGALURU_KITCHEN_HUBS[1]; // Koramangala
  }
  if (q.includes('whitefield') || q.includes('marathahalli') || q.includes('bellandur') || q.includes('kadugodi') || q.includes('hoodi') || q.includes('sarjapur')) {
    return BENGALURU_KITCHEN_HUBS[2]; // Whitefield
  }
  if (q.includes('hsr') || q.includes('electronic city') || q.includes('bommanahalli') || q.includes('kudlu') || q.includes('kasavanahalli')) {
    return BENGALURU_KITCHEN_HUBS[3]; // HSR
  }
  if (q.includes('malleswaram') || q.includes('malleshwaram') || q.includes('rajajinagar') || q.includes('yeshwanthpur') || q.includes('sadashivnagar') || q.includes('hebbal') || q.includes('mathikere')) {
    return BENGALURU_KITCHEN_HUB_BY_ID('malleshwaram-traditional') || BENGALURU_KITCHEN_HUBS[4]; // Malleshwaram
  }

  // Default to Indiranagar Flagship
  return DEFAULT_KITCHEN_HUB;
}

export function BENGALURU_KITCHEN_HUB_BY_ID(id: string): KitchenHub | undefined {
  return BENGALURU_KITCHEN_HUBS.find((h) => h.id === id);
}
