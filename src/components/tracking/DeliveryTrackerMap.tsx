'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  createScooterIcon,
  createRestaurantIcon,
  createDestinationIcon
} from '@/lib/leaflet-icons';
import type { DeliveryTelemetry, LatLngTuple } from '@/types/tracking';

interface DeliveryTrackerMapProps {
  telemetry: DeliveryTelemetry | null;
  routeWaypoints: LatLngTuple[];
}

// Controller component to smoothly pan map following the scooter
function MapFollower({ center }: { center: LatLngTuple }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.panTo(center, { animate: true, duration: 1.0 });
    }
  }, [center, map]);
  return null;
}

export default function DeliveryTrackerMap({ telemetry, routeWaypoints }: DeliveryTrackerMapProps) {
  const center: LatLngTuple = telemetry?.currentLocation || routeWaypoints[0] || [12.9784, 77.6408];

  const restaurantPos: LatLngTuple = telemetry?.restaurantLocation || routeWaypoints[0];
  const destinationPos: LatLngTuple =
    telemetry?.destinationLocation || routeWaypoints[routeWaypoints.length - 1];

  const scooterIcon = createScooterIcon(telemetry?.heading || 0);
  const restaurantIcon = createRestaurantIcon();
  const destinationIcon = createDestinationIcon();

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden border border-stone-200 shadow-inner z-0">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[420px]"
      >
        {/* OpenStreetMap Tile Layer with clean Carto Voyager styling */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapFollower center={center} />

        {/* Route Polyline connecting Kitchen to Customer Address */}
        <Polyline
          positions={routeWaypoints}
          pathOptions={{
            color: '#FF5E00',
            weight: 5,
            opacity: 0.85,
            lineCap: 'round',
            lineJoin: 'round'
          }}
        />

        {/* Restaurant Kitchen Pin */}
        <Marker position={restaurantPos} icon={restaurantIcon}>
          <Popup>
            <div className="p-1 text-center">
              <strong className="block text-xs font-bold text-stone-900">
                CurryCraft Indiranagar Hub 🍛
              </strong>
              <span className="text-[11px] text-stone-500">100ft Road, Bengaluru</span>
            </div>
          </Popup>
        </Marker>

        {/* Customer Destination Pin */}
        <Marker position={destinationPos} icon={destinationIcon}>
          <Popup>
            <div className="p-1 text-center">
              <strong className="block text-xs font-bold text-stone-900">
                Delivery Address 🏠
              </strong>
              <span className="text-[11px] text-stone-500">Koramangala 4th Block, Bengaluru</span>
            </div>
          </Popup>
        </Marker>

        {/* Dynamic Moving Scooter Marker */}
        {telemetry && (
          <Marker position={telemetry.currentLocation} icon={scooterIcon}>
            <Popup>
              <div className="p-1 text-center">
                <strong className="block text-xs font-bold text-orange-600">
                  {telemetry.rider.name} 🛵
                </strong>
                <span className="text-[11px] text-stone-600 block">
                  {telemetry.rider.vehicleNumber}
                </span>
                <span className="text-[10px] font-semibold text-stone-400">
                  Speed: {telemetry.speedKmH} km/h • ETA: {telemetry.etaMinutes} mins
                </span>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
