export interface RiderInfo {
  name: string;
  phone: string;
  vehicleNumber: string;
  rating: number;
  photo?: string;
}

export interface DeliveryTelemetry {
  orderId: string;
  status: 'KITCHEN_PREPARING' | 'RIDER_ASSIGNED' | 'OUT_FOR_DELIVERY' | 'NEARBY' | 'DELIVERED';
  rider: RiderInfo;
  currentLocation: {
    lat: number;
    lng: number;
  };
  restaurantLocation: {
    lat: number;
    lng: number;
  };
  destinationLocation: {
    lat: number;
    lng: number;
  };
  heading: number;
  speedKmH: number;
  etaMinutes: number;
  progressPercent: number;
  distanceRemainingKm: number;
  timestamp: string;
}
