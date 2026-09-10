import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ShoppingBag, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCartStore } from '@/store/useCartStore';
import { formatINR } from '@/utils/currency';
import { COLORS, SHADOWS } from '@/constants/theme';

export function PersistentCartZone() {
  const router = useRouter();
  const totalCount = useCartStore((state) => state.totalCount);
  const grandTotal = useCartStore((state) => state.grandTotal);

  const scale = useSharedValue(1);

  useEffect(() => {
    if (totalCount > 0) {
      scale.value = withSpring(1.08, { damping: 10, stiffness: 200 }, () => {
        scale.value = withSpring(1);
      });
    }
  }, [totalCount]);

  if (totalCount === 0) return null;

  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.push('/cart');
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={[styles.floatingContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={[styles.dock, SHADOWS.dock]}
      >
        <View style={styles.leftInfo}>
          <View style={styles.bagIconContainer}>
            <ShoppingBag size={18} color="#FFFFFF" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalCount}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{formatINR(grandTotal)}</Text>
          </View>
        </View>

        <View style={styles.rightAction}>
          <Text style={styles.checkoutText}>View Bag</Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    zIndex: 100
  },
  dock: {
    backgroundColor: COLORS.charcoal,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 94, 0, 0.3)'
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  bagIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.primary
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 0.5
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  }
});
