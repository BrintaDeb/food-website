import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { fetchMenu } from '@/services/api';
import { DraggableFoodCard } from '@/components/storefront/DraggableFoodCard';
import { CategoryPills } from '@/components/storefront/CategoryPills';
import { PersistentCartZone } from '@/components/storefront/PersistentCartZone';
import { COLORS } from '@/constants/theme';
import type { MenuCategory, MenuItem } from '@/types/menu';

const CATEGORIES: MenuCategory[] = ['All', 'Biryani', 'Curries', 'Breads', 'Desserts & Beverages'];

export default function MenuScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');
  const [vegOnly, setVegOnly] = useState(false);

  const { data: menu = [] } = useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenu
  });

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesVeg = !vegOnly || item.isVeg;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesVeg && matchesSearch;
    });
  }, [menu, selectedCategory, vegOnly, searchQuery]);

  const handlePressDish = (dish: MenuItem) => {
    router.push({
      pathname: '/dish/[id]',
      params: { id: dish.id }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search Biryani, Sambar, Naan..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={COLORS.muted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setVegOnly(!vegOnly)}
          style={[styles.filterButton, vegOnly && styles.filterButtonActive]}
        >
          <Text style={[styles.filterButtonText, vegOnly && styles.filterButtonTextActive]}>
            🌱 Veg Only
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <CategoryPills
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultsInfoRow}>
          <Text style={styles.resultsCount}>Showing {filteredMenu.length} delicacies</Text>
        </View>

        <View style={styles.cardList}>
          {filteredMenu.map((item) => (
            <DraggableFoodCard key={item.id} item={item} onPressItem={handlePressDish} />
          ))}
        </View>
      </ScrollView>

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
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 14,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.charcoal,
    fontWeight: '600'
  },
  filterButton: {
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  filterButtonActive: {
    backgroundColor: COLORS.vegGreen,
    borderColor: COLORS.vegGreen
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal
  },
  filterButtonTextActive: {
    color: '#FFFFFF'
  },
  scrollContent: {
    paddingBottom: 110
  },
  resultsInfoRow: {
    paddingHorizontal: 20,
    marginVertical: 8
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted
  },
  cardList: {
    paddingHorizontal: 20
  }
});
