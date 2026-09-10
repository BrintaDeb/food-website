import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { MapPin, ShoppingBag, Sparkles, ChevronDown } from 'lucide-react-native';
import { fetchMenu } from '@/services/api';
import { DraggableFoodCard } from '@/components/storefront/DraggableFoodCard';
import { CategoryPills } from '@/components/storefront/CategoryPills';
import { PersistentCartZone } from '@/components/storefront/PersistentCartZone';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, SHADOWS } from '@/constants/theme';
import type { MenuCategory, MenuItem } from '@/types/menu';

const CATEGORIES: MenuCategory[] = [
  'All',
  'Biryani',
  'Curries',
  'Breads',
  'Desserts & Beverages'
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');

  const totalCount = useCartStore((state) => state.totalCount);
  const user = useAuthStore((state) => state.user);

  const { data: menu = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenu
  });

  const filteredItems = menu.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const handlePressDish = (dish: MenuItem) => {
    router.push({
      pathname: '/dish/[id]',
      params: { id: dish.id }
    });
  };

  const deliveryAddress =
    user?.addresses?.[0]?.split(',')?.[0] || '12 Park Street, Kolkata';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>🍛 CurryCraft</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.locationButton}
          >
            <MapPin size={12} color={COLORS.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {deliveryAddress}
            </Text>
            <ChevronDown size={12} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/cart')}
          style={styles.cartHeaderButton}
        >
          <ShoppingBag size={20} color={COLORS.charcoal} />
          {totalCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Royal Promo Banner */}
        <View style={[styles.heroBanner, SHADOWS.card]}>
          <View style={styles.heroTextContent}>
            <View style={styles.heroBadgeRow}>
              <Sparkles size={12} color="#FFFFFF" />
              <Text style={styles.heroBadgeText}>ROYAL DUM-PUKHT FEAST</Text>
            </View>
            <Text style={styles.heroHeading}>Get 50% Off</Text>
            <Text style={styles.heroSubheading}>
              Use code <Text style={styles.heroCode}>ROYAL50</Text> on all handi biryanis & curries!
            </Text>
          </View>
          <Image
            source={{
              uri: 'https://raw.githubusercontent.com/BrintaDeb/food-website/main/images/kolkata-biryani.jpg'
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Category Pills */}
        <CategoryPills
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Section Title */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'Signature Delicacies' : selectedCategory}
          </Text>
          <Text style={styles.itemCountText}>{filteredItems.length} dishes</Text>
        </View>

        {/* Draggable Food Card List */}
        <View style={styles.cardList}>
          {filteredItems.map((item) => (
            <DraggableFoodCard
              key={item.id}
              item={item}
              onPressItem={handlePressDish}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Reanimated Cart Dock */}
      <PersistentCartZone />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#FFFFFF'
  },
  headerLeft: {
    flex: 1,
    marginRight: 16
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.charcoal,
    letterSpacing: -0.5
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    maxWidth: 200
  },
  cartHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900'
  },
  scrollContent: {
    paddingBottom: 110
  },
  heroBanner: {
    margin: 20,
    backgroundColor: COLORS.charcoal,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden'
  },
  heroTextContent: {
    flex: 1,
    marginRight: 12
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6
  },
  heroBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  heroHeading: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4
  },
  heroSubheading: {
    fontSize: 12,
    color: '#DDD',
    lineHeight: 16
  },
  heroCode: {
    color: COLORS.primaryLight,
    fontWeight: '900'
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 18
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  itemCountText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '700'
  },
  cardList: {
    paddingHorizontal: 20
  }
});
