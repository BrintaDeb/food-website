import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { Navigation, Home, Store } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import type { DeliveryTelemetry } from '@/types/telemetry';

interface DeliveryMapViewProps {
  telemetry: DeliveryTelemetry;
}

export function DeliveryMapView({ telemetry }: DeliveryMapViewProps) {
  const mapRef = useRef<MapView | null>(null);

  const routeCoordinates = [
    { latitude: telemetry.restaurantLocation.lat, longitude: telemetry.restaurantLocation.lng },
    { latitude: telemetry.currentLocation.lat, longitude: telemetry.currentLocation.lng },
    { latitude: telemetry.destinationLocation.lat, longitude: telemetry.destinationLocation.lng }
  ];

  useEffect(() => {
    if (mapRef.current && telemetry.currentLocation) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: telemetry.currentLocation.lat,
            longitude: telemetry.currentLocation.lng
          },
          pitch: 30,
          heading: telemetry.heading,
          zoom: 15
        },
        { duration: 1000 }
      );
    }
  }, [telemetry.currentLocation, telemetry.heading]);

  const initialRegion = {
    latitude: telemetry.currentLocation.lat,
    longitude: telemetry.currentLocation.lng,
    latitudeDelta: 0.035,
    longitudeDelta: 0.035
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsCompass={true}
      >
        {/* Route Line */}
        <Polyline
          coordinates={routeCoordinates}
          strokeColor={COLORS.primary}
          strokeWidth={4}
          lineDashPattern={[0]}
        />

        {/* Restaurant Marker */}
        <Marker
          coordinate={{
            latitude: telemetry.restaurantLocation.lat,
            longitude: telemetry.restaurantLocation.lng
          }}
          title="CurryCraft Heritage Kitchen"
          description="Order prepared & dispatched"
        >
          <View style={[styles.markerPin, { backgroundColor: COLORS.charcoal }]}>
            <Store size={14} color="#FFFFFF" />
          </View>
        </Marker>

        {/* Destination Marker */}
        <Marker
          coordinate={{
            latitude: telemetry.destinationLocation.lat,
            longitude: telemetry.destinationLocation.lng
          }}
          title="Your Delivery Address"
          description="Courier will arrive shortly"
        >
          <View style={[styles.markerPin, { backgroundColor: COLORS.vegGreen }]}>
            <Home size={14} color="#FFFFFF" />
          </View>
        </Marker>

        {/* Live Rider Scooter Marker with Heading Rotation */}
        <Marker
          coordinate={{
            latitude: telemetry.currentLocation.lat,
            longitude: telemetry.currentLocation.lng
          }}
          anchor={{ x: 0.5, y: 0.5 }}
          flat={true}
          rotation={telemetry.heading}
          title={telemetry.rider.name}
          description={`Vehicle: ${telemetry.rider.vehicleNumber} (${telemetry.speedKmH} km/h)`}
        >
          <View style={styles.riderMarkerOuter}>
            <View style={styles.riderMarkerInner}>
              <Navigation size={18} color="#FFFFFF" style={{ transform: [{ rotate: '-45deg' }] }} />
            </View>
          </View>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  riderMarkerOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 94, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  riderMarkerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#FF5E00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6
  }
});
