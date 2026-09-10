import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Share2, Radio } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useLiveOrderTracking } from '@/hooks/useLiveOrderTracking';
import { DeliveryMapView } from '@/components/tracking/DeliveryMapView';
import { DeliveryStatusSheet } from '@/components/tracking/DeliveryStatusSheet';
import { COLORS, SHADOWS } from '@/constants/theme';

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const validOrderId = orderId || 'ORD-ROYAL';

  const { telemetry, isConnected } = useLiveOrderTracking(validOrderId);

  const handleBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.replace('/(tabs)/orders');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Full-bleed Interactive Native Map */}
      {telemetry ? (
        <DeliveryMapView telemetry={telemetry} />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Establishing Royal GPS Telemetry...</Text>
        </View>
      )}

      {/* Floating Top Navigation Header */}
      <SafeAreaView style={styles.topHeaderSafeArea}>
        <View style={styles.topHeaderRow}>
          <TouchableOpacity onPress={handleBack} style={[styles.headerButton, SHADOWS.sm]}>
            <ArrowLeft size={20} color={COLORS.charcoal} />
          </TouchableOpacity>

          <View style={[styles.titleBadge, SHADOWS.sm]}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
            </View>
            <View>
              <Text style={styles.titleBadgeText}>Order #{validOrderId.slice(-6)}</Text>
              <Text style={styles.subtitleBadgeText}>Live GPS Telemetry</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              } catch {}
            }}
            style={[styles.headerButton, SHADOWS.sm]}
          >
            <Radio size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Anchored Bottom Status Sheet */}
      {telemetry && (
        <View style={styles.bottomSheetWrapper}>
          <DeliveryStatusSheet telemetry={telemetry} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: '600'
  },
  topHeaderSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 22
  },
  liveIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A'
  },
  titleBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.charcoal
  },
  subtitleBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary
  },
  bottomSheetWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10
  }
});
