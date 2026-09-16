import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/theme';
import type { MenuCategory } from '@/types/menu';

interface CategoryPillsProps {
  categories: MenuCategory[];
  selectedCategory: MenuCategory;
  onSelectCategory: (category: MenuCategory) => void;
}

export function CategoryPills({
  categories,
  selectedCategory,
  onSelectCategory
}: CategoryPillsProps) {
  const handleSelect = (cat: MenuCategory) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    onSelectCategory(cat);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <TouchableOpacity
            key={cat}
            activeOpacity={0.8}
            onPress={() => handleSelect(cat)}
            style={[styles.pill, isSelected ? styles.pillSelected : styles.pillUnselected]}
          >
            <Text
              style={[
                styles.pillText,
                isSelected ? styles.pillTextSelected : styles.pillTextUnselected
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1
  },
  pillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  pillUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.border
  },
  pillText: {
    fontSize: 12,
    fontWeight: '800'
  },
  pillTextSelected: {
    color: '#FFFFFF'
  },
  pillTextUnselected: {
    color: COLORS.charcoal
  }
});
