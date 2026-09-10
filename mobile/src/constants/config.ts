import { Platform } from 'react-native';
import type { MenuItem } from '@/types/menu';

export const API_BASE_URL = (() => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.250.221.81:3000';
  }
  return 'http://localhost:3000';
})();

export const RESTAURANT_METADATA = {
  name: 'CurryCraft Indian Cuisine',
  tagline: 'Authentic Royal Indian Heritage Dining',
  phone: '+91 98765 43210',
  address: '12 Park Street, Heritage Quarter, Kolkata',
  defaultCoupon: 'ROYAL50',
  discountPercentage: 50,
  taxRatePercent: 5,
  defaultDeliveryFee: 30,
  freeDeliveryThreshold: 500
};

export const INITIAL_INDIAN_MENU: MenuItem[] = [
  {
    id: 'kolkata-chicken-biryani',
    name: 'Kolkata Chicken Biryani',
    category: 'Biryani',
    price: 380,
    image: 'images/kolkata-biryani.jpg',
    description:
      'Fragrant aged long-grain basmati rice layered with succulent chicken, golden melt-in-the-mouth potato (aloo), and farm boiled egg, slow-cooked in dum with saffron and aromatic meetha ittar.',
    inStock: true,
    prepTime: '25 mins',
    isVeg: false,
    spiceLevel: 2,
    tags: ['aloo', 'egg', 'fragrant', 'biryani', 'dum', 'signature'],
    rating: 4.9,
    reviewsCount: 342,
    badge: 'Chef Special'
  },
  {
    id: 'classic-dal-sambar',
    name: 'Classic Dal Sambar',
    category: 'Curries',
    price: 190,
    image: 'images/classic-dal-sambar.jpg',
    description:
      'Homestyle comfort toor dal stewed with fresh drumsticks, shallots, and vegetables, tempered with black mustard seeds, curry leaves, and tangy tamarind extract.',
    inStock: true,
    prepTime: '15 mins',
    isVeg: true,
    spiceLevel: 1,
    tags: ['comfort', 'vegetarian', 'lentil', 'tamarind', 'curry-leaves', 'south-indian'],
    rating: 4.8,
    reviewsCount: 215,
    badge: 'Comfort Classic'
  },
  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    category: 'Curries',
    price: 320,
    image: 'images/paneer-butter-masala.jpg',
    description:
      'Soft malai paneer cubes simmered in a velvety, rich tomato-cashew satin gravy finished with artisanal butter and dried fenugreek leaves (kasuri methi).',
    inStock: true,
    prepTime: '20 mins',
    isVeg: true,
    spiceLevel: 1,
    tags: ['vegetarian', 'paneer', 'butter', 'creamy', 'curry', 'north-indian'],
    rating: 4.9,
    reviewsCount: 410,
    badge: 'Bestseller'
  },
  {
    id: 'butter-garlic-naan',
    name: 'Butter Garlic Naan (2 pcs)',
    category: 'Breads',
    price: 120,
    image: 'images/butter-garlic-naan.jpg',
    description:
      'Traditional clay-tandoor blistered leavened bread generously brushed with roasted minced garlic, fresh coriander, and melted golden butter.',
    inStock: true,
    prepTime: '10 mins',
    isVeg: true,
    spiceLevel: 1,
    tags: ['bread', 'tandoor', 'garlic', 'butter', 'vegetarian'],
    rating: 4.7,
    reviewsCount: 188
  },
  {
    id: 'awadhi-mutton-biryani',
    name: 'Awadhi Dum Mutton Biryani',
    category: 'Biryani',
    price: 490,
    image: 'images/awadhi-mutton-biryani.jpg',
    description:
      'Royal Lucknawi style dum biryani with tender mutton shanks, fragrant kewra essence, caramelized fried onions (birista), and whole Indian spices.',
    inStock: true,
    prepTime: '30 mins',
    isVeg: false,
    spiceLevel: 2,
    tags: ['mutton', 'dum', 'royal', 'biryani', 'fragrant'],
    rating: 4.9,
    reviewsCount: 276,
    badge: 'Royal Heritage'
  },
  {
    id: 'gulab-jamun-rabdi',
    name: 'Gulab Jamun with Kesari Rabdi',
    category: 'Desserts & Beverages',
    price: 160,
    image: 'images/gulab-jamun-rabdi.jpg',
    description:
      'Warm, melt-in-mouth reduced milk dumplings soaked in green cardamom sugar syrup, crowned with chilled slow-simmered saffron rabdi and pistachios.',
    inStock: true,
    prepTime: '8 mins',
    isVeg: true,
    spiceLevel: 1,
    tags: ['dessert', 'sweet', 'rabdi', 'cardamom', 'festive', 'vegetarian'],
    rating: 4.9,
    reviewsCount: 390
  },
  {
    id: 'kolkata-masala-chai',
    name: 'Kolkata Kulhad Masala Chai',
    category: 'Desserts & Beverages',
    price: 80,
    image: 'images/kolkata-masala-chai.jpg',
    description:
      'Authentic clay cup (kulhad) brewed Assam CTC tea infused with crushed green cardamom, fresh crushed ginger, cloves, and whole creamy milk.',
    inStock: true,
    prepTime: '5 mins',
    isVeg: true,
    spiceLevel: 1,
    tags: ['beverage', 'chai', 'kulhad', 'ginger', 'cardamom', 'vegetarian'],
    rating: 4.8,
    reviewsCount: 150
  }
];
