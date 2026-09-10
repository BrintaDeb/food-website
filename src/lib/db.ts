import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { MenuItem } from '@/types/menu';
import type { Order } from '@/types/order';
import type { CustomerProfile } from '@/types/customer';

const DEFAULT_MENU: MenuItem[] = [
  {
    id: 'kolkata-chicken-biryani',
    name: 'Kolkata Chicken Biryani',
    category: 'Biryani',
    price: 380,
    image: '/images/kolkata-biryani.jpg',
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
    image: '/images/classic-dal-sambar.jpg',
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
    image: '/images/paneer-butter-masala.jpg',
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
    image: '/images/butter-garlic-naan.jpg',
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
    image: '/images/awadhi-mutton-biryani.jpg',
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
    image: '/images/gulab-jamun-rabdi.jpg',
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
    image: '/images/kolkata-masala-chai.jpg',
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

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'BGR-66240',
    orderId: 'BGR-66240',
    createdAt: '2026-09-05T00:00:52.409Z',
    formattedDate: '05 Sept 2026',
    formattedTime: '05:30 am',
    status: 'Confirmed',
    statusStep: 1,
    estimatedTime: '25 - 35 mins',
    customer: {
      name: 'Rohan Deshmukh',
      phone: '9123456780',
      alternatePhone: '9876543210',
      email: 'rohan.d@example.com',
      flat: 'Villa 14, Palm Grove Estates',
      street: 'Koramangala 4th Block',
      landmark: 'Behind Sony Signal',
      city: 'Bengaluru',
      pincode: '560034',
      address:
        'Flat/House: Villa 14, Palm Grove Estates, Street/Building: Koramangala 4th Block, Landmark: Behind Sony Signal, Bengaluru, PIN: 560034',
      deliveryType: 'Home Delivery',
      paymentMethod: 'Cash on Delivery',
      notes: 'Please do not honk near the gate'
    },
    items: [
      {
        id: 'kolkata-biryani',
        name: 'Kolkata Chicken Biryani',
        price: 340,
        quantity: 1,
        image: '/images/kolkata-biryani.jpg',
        lineTotal: 340
      },
      {
        id: 'classic-dal-sambar',
        name: 'Classic Dal Sambar',
        price: 180,
        quantity: 1,
        image: '/images/classic-dal-sambar.jpg',
        lineTotal: 180
      }
    ],
    pricing: {
      itemsSubtotal: 520,
      discount: 260,
      discountLabel: '50% Royal Special (ROYAL50)',
      taxableAmount: 260,
      gst: 13.0,
      deliveryFee: 0,
      grandTotal: 273.0
    }
  },
  {
    id: 'BGR-69566',
    orderId: 'BGR-69566',
    createdAt: '2026-09-04T23:59:17.152Z',
    formattedDate: '05 Sept 2026',
    formattedTime: '05:29 am',
    status: 'Preparing',
    statusStep: 2,
    estimatedTime: '25 - 35 mins',
    customer: {
      name: 'Ananya Sharma',
      phone: '9845123456',
      alternatePhone: '',
      email: 'ananya.s@example.com',
      flat: 'Apt 402, Green Acres',
      street: 'Indiranagar 100ft Road',
      landmark: 'Near Metro Pillar 42',
      city: 'Bengaluru',
      pincode: '560038',
      address:
        'Flat/House: Apt 402, Green Acres, Street/Building: Indiranagar 100ft Road, Landmark: Near Metro Pillar 42, Bengaluru, PIN: 560038',
      deliveryType: 'Home Delivery',
      paymentMethod: 'UPI / Online Payment',
      notes: 'Extra napkins please'
    },
    items: [
      {
        id: 'nawabi-feast-combo',
        name: 'Nawabi Biryani Royal Combo',
        price: 499,
        quantity: 1,
        image: '/images/kolkata-biryani.jpg',
        lineTotal: 499
      }
    ],
    pricing: {
      itemsSubtotal: 499,
      discount: 50,
      discountLabel: 'Combo Special Discount',
      taxableAmount: 349,
      gst: 17.45,
      deliveryFee: 30,
      grandTotal: 396.45
    }
  }
];

const DEFAULT_CUSTOMERS: CustomerProfile[] = [
  {
    phone: '9123456780',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@example.com',
    addresses: [
      'Flat/House: Villa 14, Palm Grove Estates, Street/Building: Koramangala 4th Block, Landmark: Behind Sony Signal, Bengaluru, PIN: 560034'
    ]
  },
  {
    phone: '9845123456',
    name: 'Ananya Sharma',
    email: 'ananya.s@example.com',
    addresses: [
      'Flat/House: Apt 402, Green Acres, Street/Building: Indiranagar 100ft Road, Landmark: Near Metro Pillar 42, Bengaluru, PIN: 560038'
    ]
  }
];

interface MemoryStore {
  menu: MenuItem[] | null;
  orders: Order[] | null;
  customers: CustomerProfile[] | null;
}

const memoryStore: MemoryStore = {
  menu: null,
  orders: null,
  customers: null
};

const PRIMARY_DATA_DIR = path.join(process.cwd(), 'data');
const TMP_DATA_DIR = path.join(os.tmpdir(), 'food-website-data');

async function readFileWithFallback<T>(filename: string, defaultData: T[]): Promise<T[]> {
  const storeKey = filename.replace('.json', '') as keyof MemoryStore;
  if (memoryStore[storeKey] && (memoryStore[storeKey] as unknown as T[]).length > 0) {
    return memoryStore[storeKey] as unknown as T[];
  }

  // 1. Try local data/
  const primaryPath = path.join(PRIMARY_DATA_DIR, filename);
  try {
    if (existsSync(primaryPath)) {
      const content = await fs.readFile(primaryPath, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        (memoryStore as unknown as Record<string, unknown>)[storeKey] = parsed;
        return parsed as T[];
      }
    }
  } catch {}

  // 2. Try /tmp
  const tmpPath = path.join(TMP_DATA_DIR, filename);
  try {
    if (existsSync(tmpPath)) {
      const content = await fs.readFile(tmpPath, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        (memoryStore as unknown as Record<string, unknown>)[storeKey] = parsed;
        return parsed as T[];
      }
    }
  } catch {}

  const clone = JSON.parse(JSON.stringify(defaultData));
  (memoryStore as unknown as Record<string, unknown>)[storeKey] = clone;
  return clone;
}

async function writeFileWithFallback<T>(filename: string, data: T[]): Promise<void> {
  const storeKey = filename.replace('.json', '') as keyof MemoryStore;
  (memoryStore as unknown as Record<string, unknown>)[storeKey] = data;
  const jsonString = JSON.stringify(data, null, 2);

  try {
    await fs.mkdir(PRIMARY_DATA_DIR, { recursive: true });
    await fs.writeFile(path.join(PRIMARY_DATA_DIR, filename), jsonString, 'utf8');
  } catch {}

  try {
    await fs.mkdir(TMP_DATA_DIR, { recursive: true });
    await fs.writeFile(path.join(TMP_DATA_DIR, filename), jsonString, 'utf8');
  } catch {}
}

export const getMenu = () => readFileWithFallback<MenuItem>('menu.json', DEFAULT_MENU);
export const saveMenu = (data: MenuItem[]) => writeFileWithFallback<MenuItem>('menu.json', data);

export const getOrders = () => readFileWithFallback<Order>('orders.json', DEFAULT_ORDERS);
export const saveOrders = (data: Order[]) => writeFileWithFallback<Order>('orders.json', data);

export const getCustomers = () =>
  readFileWithFallback<CustomerProfile>('customers.json', DEFAULT_CUSTOMERS);
export const saveCustomers = (data: CustomerProfile[]) =>
  writeFileWithFallback<CustomerProfile>('customers.json', data);
