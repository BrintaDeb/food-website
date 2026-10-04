export interface MenuItem {
  id: string;
  name: string;
  category: 'Biryani' | 'Curries' | 'Breads' | 'Desserts & Beverages' | string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  prepTime: string;
  isVeg: boolean;
  spiceLevel: 1 | 2 | 3;
  tags: string[];
  dietary?: ('Pure Veg' | 'Jain Friendly' | 'Keto Friendly' | 'Gluten Free' | 'Halal')[];
  calories?: number;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
}

export type MenuCategory = 'All' | 'Biryani' | 'Curries' | 'Breads' | 'Desserts & Beverages';

export interface CreateMenuItemInput {
  name: string;
  category: string;
  price: number;
  image?: string;
  description: string;
  inStock?: boolean;
  prepTime: string;
  isVeg?: boolean;
  spiceLevel?: 1 | 2 | 3;
  tags?: string[];
  calories?: number;
}

export interface UpdateMenuItemInput extends Partial<CreateMenuItemInput> {
  id?: string;
}
