import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Navigation, Home, Store, Clock, Gauge } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import type { DeliveryTelemetry } from '@/types/telemetry';

interface DeliveryMapViewProps {
  telemetry: DeliveryTelemetry;
}

export function DeliveryMapView({ telemetry }: DeliveryMapViewProps) {
  return (
    <View style={styles.webFallbackContainer}>
      <View style={styles.radarCard}>
        <View style={styles.headerBadge}>
          <Text style={styles.badgeText}>🗺️ Live Map Telemetry</Text>
        </View>

        <Text style={styles.webFallbackTitle}>CurryCraft Express Courier</Text>
        <Text style={styles.webFallbackSubtitle}>
          Live GPS active from Park Street Kitchen to your doorstep
        </Text>

        <View style={styles.routeCard}>
          <View style={styles.stopRow}>
            <View style={[styles.stopDot, { backgroundColor: COLORS.charcoal }]}>
              <Store size={12} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.stopTitle}>CurryCraft Heritage Kitchen</Text>
              <Text style={styles.stopSub}>Park Street, Kolkata</Text>
            </View>
          </View>

          <View style={styles.routeConnector} />

          <View style={styles.stopRow}>
            <View style={[styles.stopDot, { backgroundColor: COLORS.primary }]}>
              <Navigation size={12} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.stopTitle}>
                {telemetry.rider.name} • {telemetry.rider.vehicleNumber}
              </Text>
              <Text style={styles.stopSub}>
                Bearing: {telemetry.heading}° • Speed: {telemetry.speedKmH} km/h
              </Text>
            </View>
          </View>

          <View style={styles.routeConnector} />

          <View style={styles.stopRow}>
            <View style={[styles.stopDot, { backgroundColor: COLORS.vegGreen }]}>
              <Home size={12} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.stopTitle}>Delivery Destination</Text>
              <Text style={styles.stopSub}>Customer Doorstep</Text>
            </View>
          </View>
        </View>

        <View style={styles.webStatsRow}>
          <View style={styles.webStatCard}>
            <Clock size={16} color={COLORS.primary} />
            <Text style={styles.webStatNumber}>{telemetry.etaMinutes}m</Text>
            <Text style={styles.webStatLabel}>Estimated ETA</Text>
          </View>

          <View style={styles.webStatCard}>
            <Navigation size={16} color={COLORS.primary} />
            <Text style={styles.webStatNumber}>{telemetry.distanceRemainingKm} km</Text>
            <Text style={styles.webStatLabel}>Remaining</Text>
          </View>

          <View style={styles.webStatCard}>
            <Gauge size={16} color={COLORS.primary} />
            <Text style={styles.webStatNumber}>{telemetry.speedKmH} km/h</Text>
            <Text style={styles.webStatLabel}>Speed</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webFallbackContainer: {
    flex: 1,
    backgroundColor: '#1A1311',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  radarCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center'
  },
  headerBadge: {
    backgroundColor: 'rgba(255, 94, 0, 0.2)',
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 14
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800'
  },
  webFallbackTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center'
  },
  webFallbackSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: 20
  },
  routeCard: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  stopDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stopTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  stopSub: {
    color: COLORS.muted,
    fontSize: 11
  },
  routeConnector: {
    width: 2,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: 12,
    marginVertical: 2
  },
  webStatsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%'
  },
  webStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4
  },
  webStatNumber: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900'
  },
  webStatLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '600'
  }
});
