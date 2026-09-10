export type LatLngTuple = [number, number];

export type DeliveryStage =
  | 'ORDER_CONFIRMED'
  | 'KITCHEN_PREPARING'
  | 'RIDER_ASSIGNED'
  | 'OUT_FOR_DELIVERY'
  | 'NEARBY'
  | 'DELIVERED';

export interface RiderProfile {
  name: string;
  phone: string;
  vehicleNumber: string;
  rating: number;
  photo: string;
}

export interface DeliveryTelemetry {
  orderId: string;
  status: DeliveryStage;
  rider: RiderProfile;
  currentLocation: LatLngTuple;
  restaurantLocation: LatLngTuple;
  destinationLocation: LatLngTuple;
  heading: number;
  speedKmH: number;
  etaMinutes: number;
  progressPercent: number;
  distanceRemainingKm: number;
  timestamp: string;
}
