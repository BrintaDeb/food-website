import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { X, Star, Clock, Flame, Minus, Plus, ShoppingBag } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { fetchMenu } from '@/services/api';
import { useCartStore } from '@/store/useCartStore';
import { formatINR } from '@/utils/currency';
import { COLORS, SHADOWS } from '@/constants/theme';
import type { MenuItem } from '@/types/menu';

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);

  const { data: menu = [] } = useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenu
  });

  const dish: MenuItem | undefined = menu.find((item) => item.id === id);

  if (!dish) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Dish not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeNotFound}>
          <Text style={styles.closeNotFoundText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      quantity
    });
    router.back();
  };

  const imageUri = dish.image.startsWith('http')
    ? dish.image
    : `https://raw.githubusercontent.com/BrintaDeb/food-website/main/${dish.image.replace(/^\//, '')}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <X size={20} color={COLORS.charcoal} />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>{dish.category}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Large Hero Dish Image */}
        <View style={styles.heroImageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.heroImage} resizeMode="cover" />
          {dish.badge && (
            <View style={styles.badgeOverlay}>
              <Text style={styles.badgeOverlayText}>{dish.badge}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsBody}>
          {/* Veg Indicator & Title */}
          <View style={styles.titleRow}>
            <View style={styles.vegIndicatorBox}>
              <View
                style={[
                  styles.vegDot,
                  { backgroundColor: dish.isVeg ? COLORS.vegGreen : COLORS.nonVegRed }
                ]}
              />
            </View>
            <Text style={styles.dishTitle}>{dish.name}</Text>
          </View>

          {/* Metrics bar */}
          <View style={styles.metricsBar}>
            {dish.rating && (
              <View style={styles.metricCard}>
                <Star size={14} color={COLORS.starAmber} fill={COLORS.starAmber} />
                <Text style={styles.metricValue}>{dish.rating}</Text>
                <Text style={styles.metricLabel}>Rating</Text>
              </View>
            )}

            <View style={styles.metricCard}>
              <Clock size={14} color={COLORS.primary} />
              <Text style={styles.metricValue}>{dish.prepTime}</Text>
              <Text style={styles.metricLabel}>Preparation</Text>
            </View>

            {dish.spiceLevel && (
              <View style={styles.metricCard}>
                <Flame size={14} color={COLORS.primary} />
                <Text style={styles.metricValue}>Level {dish.spiceLevel}/3</Text>
                <Text style={styles.metricLabel}>Spice Meter</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={styles.sectionHeading}>Culinary Heritage</Text>
          <Text style={styles.descriptionText}>{dish.description}</Text>

          {/* Tags */}
          {dish.tags && dish.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {dish.tags.map((tag) => (
                <View key={tag} style={styles.tagPill}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, SHADOWS.modal]}>
        {/* Quantity Stepper */}
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.stepperButton}
          >
            <Minus size={16} color={COLORS.charcoal} />
          </TouchableOpacity>
          <Text style={styles.stepperValue}>{quantity}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setQuantity(quantity + 1)}
            style={styles.stepperButton}
          >
            <Plus size={16} color={COLORS.charcoal} />
          </TouchableOpacity>
        </View>

        {/* Add to Bag Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAddToCart}
          style={styles.addToBagButton}
        >
          <ShoppingBag size={18} color="#FFFFFF" />
          <Text style={styles.addToBagText}>
            Add {quantity} to Bag • {formatINR(dish.price * quantity)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.charcoal,
    fontWeight: '700'
  },
  closeNotFound: {
    marginTop: 12,
    padding: 10
  },
  closeNotFoundText: {
    color: COLORS.primary,
    fontWeight: '800'
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#FFFFFF'
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topNavTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.charcoal
  },
  scrollContent: {
    paddingBottom: 120
  },
  heroImageWrapper: {
    width: '100%',
    height: 280,
    position: 'relative',
    backgroundColor: COLORS.charcoal
  },
  heroImage: {
    width: '100%',
    height: '100%'
  },
  badgeOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    backgroundColor: COLORS.charcoal,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14
  },
  badgeOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  detailsBody: {
    padding: 20
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16
  },
  vegIndicatorBox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3
  },
  vegDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  dishTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.charcoal,
    lineHeight: 28
  },
  metricsBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.charcoal
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: '600'
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.charcoal,
    marginBottom: 8
  },
  descriptionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  tagPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.charcoal
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepperValue: {
    width: 32,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  addToBagButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    gap: 8
  },
  addToBagText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900'
  }
});
