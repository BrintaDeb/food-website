export type MenuCategory = 'All' | 'Biryani' | 'Curries' | 'Breads' | 'Desserts & Beverages';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  prepTime: string;
  isVeg: boolean;
  spiceLevel: 1 | 2 | 3;
  tags: string[];
  calories?: number;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
