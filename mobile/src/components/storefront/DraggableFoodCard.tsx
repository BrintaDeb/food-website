import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Plus, Star, Flame, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useNativeDraggableCart } from '@/hooks/useNativeDraggableCart';
import { useCartStore } from '@/store/useCartStore';
import { formatINR } from '@/utils/currency';
import { COLORS, SHADOWS } from '@/constants/theme';
import type { MenuItem } from '@/types/menu';

interface DraggableFoodCardProps {
  item: MenuItem;
  onPressItem?: (item: MenuItem) => void;
}

export function DraggableFoodCard({ item, onPressItem }: DraggableFoodCardProps) {
  const { panGesture, animatedStyle } = useNativeDraggableCart(item);
  const addItem = useCartStore((state) => state.addItem);

  const handleManualAdd = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, SHADOWS.card, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => onPressItem?.(item)}
          style={styles.innerContainer}
        >
          {/* Top Badges */}
          <View style={styles.topRow}>
            <View style={styles.badgesLeft}>
              {/* Veg / Non-Veg Indicator */}
              <View
                style={[
                  styles.vegIndicatorBox,
                  { borderColor: item.isVeg ? COLORS.vegGreen : COLORS.nonVegRed }
                ]}
              >
                <View
                  style={[
                    styles.vegDot,
                    { backgroundColor: item.isVeg ? COLORS.vegGreen : COLORS.nonVegRed }
                  ]}
                />
              </View>

              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>

            {item.rating && (
              <View style={styles.ratingBadge}>
                <Star size={12} color={COLORS.starAmber} fill={COLORS.starAmber} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            )}
          </View>

          {/* Dish Image Container */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: item.image.startsWith('http')
                  ? item.image
                  : `https://raw.githubusercontent.com/BrintaDeb/food-website/main/${item.image.replace(/^\//, '')}`
              }}
              style={styles.dishImage}
              resizeMode="cover"
            />
          </View>

          {/* Title & Timing */}
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={11} color={COLORS.muted} />
              <Text style={styles.metaText}>{item.prepTime}</Text>
            </View>

            {item.spiceLevel && (
              <View style={styles.metaItem}>
                <Flame size={11} color={COLORS.primary} />
                <Text style={styles.spiceText}>
                  {Array.from({ length: item.spiceLevel })
                    .map(() => '🌶️')
                    .join('')}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Price & Add Action */}
          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.priceLabel}>PRICE</Text>
              <Text style={styles.priceValue}>{formatINR(item.price)}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleManualAdd}
              style={styles.addButton}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    overflow: 'hidden'
  },
  innerContainer: {
    padding: 16
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  badgesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  vegIndicatorBox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  categoryPill: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.charcoal
  },
  imageContainer: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: 12
  },
  dishImage: {
    width: '100%',
    height: '100%'
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.charcoal,
    marginBottom: 4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '600'
  },
  spiceText: {
    fontSize: 10
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 12
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface
  },
  priceLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 0.5
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.charcoal,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 4
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  }
});
