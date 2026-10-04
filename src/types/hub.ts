export type KitchenHubStatus = 'Active' | 'High Demand' | 'Closed';

export interface KitchenHub {
  id: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  specialties: string[];
  status: KitchenHubStatus;
  waitMinutes: number;
  rating: number;
  deliveryRadiusKm: number;
}

export interface HubLocationState {
  selectedHub: KitchenHub;
  userCoords: { lat: number; lng: number } | null;
  userAddress: string | null;
  distanceKm: number | null;
  isAutoDetected: boolean;
  etaMinutes: number;
}
