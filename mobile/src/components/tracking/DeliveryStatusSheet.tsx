import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Phone, ShieldCheck, Clock, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { formatINR } from '@/utils/currency';
import { COLORS, SHADOWS } from '@/constants/theme';
import type { DeliveryTelemetry } from '@/types/telemetry';

interface DeliveryStatusSheetProps {
  telemetry: DeliveryTelemetry;
}

export function DeliveryStatusSheet({ telemetry }: DeliveryStatusSheetProps) {
  const handleCallRider = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    if (telemetry.rider.phone) {
      Linking.openURL(`tel:${telemetry.rider.phone.replace(/[^0-9+]/g, '')}`);
    }
  };

  const getStatusLabel = () => {
    switch (telemetry.status) {
      case 'KITCHEN_PREPARING':
        return 'Royal Kitchen Slow-Simmering Dum';
      case 'RIDER_ASSIGNED':
        return 'Courier Dispatched & Heading to Handi';
      case 'OUT_FOR_DELIVERY':
        return 'En Route to Your Doorstep';
      case 'NEARBY':
        return 'Arriving in 2 Minutes! Tamper-Sealed';
      case 'DELIVERED':
        return 'Delivered & Relished';
      default:
        return 'Processing Royal Feast';
    }
  };

  return (
    <View style={[styles.sheet, SHADOWS.modal]}>
      {/* Handle Bar */}
      <View style={styles.handleBar} />

      {/* Main Status & ETA */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.statusHeading}>{getStatusLabel()}</Text>
          <Text style={styles.orderSubtext}>Order #{telemetry.orderId}</Text>
        </View>

        <View style={styles.etaContainer}>
          <Clock size={14} color={COLORS.primary} />
          <Text style={styles.etaNumber}>{telemetry.etaMinutes}</Text>
          <Text style={styles.etaUnit}>MINS</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${Math.max(5, telemetry.progressPercent)}%` }]}
        />
      </View>

      {/* Rider Info Card */}
      <View style={styles.riderCard}>
        <View style={styles.riderLeft}>
          <View style={styles.riderAvatar}>
            <Text style={styles.riderAvatarText}>🛵</Text>
          </View>
          <View>
            <View style={styles.riderNameRow}>
              <Text style={styles.riderName}>{telemetry.rider.name}</Text>
              <ShieldCheck size={14} color={COLORS.vegGreen} />
            </View>
            <Text style={styles.vehicleNumber}>{telemetry.rider.vehicleNumber}</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={handleCallRider} style={styles.callButton}>
          <Phone size={16} color="#FFFFFF" />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      </View>

      {/* Live Metric Row */}
      <View style={styles.metricRow}>
        <View style={styles.metricItem}>
          <MapPin size={12} color={COLORS.muted} />
          <Text style={styles.metricLabel}>Distance:</Text>
          <Text style={styles.metricValue}>{telemetry.distanceRemainingKm} km away</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Speed:</Text>
          <Text style={styles.metricValue}>{telemetry.speedKmH} km/h</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  statusHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  orderSubtext: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '600',
    marginTop: 2
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 4
  },
  etaNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary
  },
  etaUnit: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3
  },
  riderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 18,
    marginBottom: 12
  },
  riderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  riderAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  riderAvatarText: {
    fontSize: 22
  },
  riderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  riderName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.charcoal
  },
  vehicleNumber: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '600',
    marginTop: 2
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.charcoal,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 6
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '600'
  },
  metricValue: {
    fontSize: 11,
    color: COLORS.charcoal,
    fontWeight: '800'
  }
});
