import type { MenuItem } from '@/types/menu';
import type { CartItem } from '@/store/useCartStore';

export interface SmartPairing {
  item: MenuItem;
  reason: string;
  tag: string;
  matchScore: number;
}

export interface CuratedFeast {
  id: string;
  title: string;
  subtitle: string;
  partySize: number;
  dietary: string;
  items: MenuItem[];
  originalTotal: number;
  bundlePrice: number;
  savings: number;
  chefNotes: string;
}

/**
 * Returns dynamic, authentic culinary accompaniments for the current bag
 */
export function getSmartUpsellPairings(
  cartItems: CartItem[],
  allMenuItems: MenuItem[]
): SmartPairing[] {
  if (cartItems.length === 0 || allMenuItems.length === 0) return [];

  const cartIds = new Set(cartItems.map((i) => i.id));
  const hasBiryani = cartItems.some((i) =>
    i.id.toLowerCase().includes('biryani') || i.name.toLowerCase().includes('biryani')
  );
  const hasCurry = cartItems.some((i) =>
    i.id.includes('paneer') || i.id.includes('dal') || i.id.includes('curry') || i.id.includes('sambar')
  );
  const hasBread = cartItems.some((i) => i.id.includes('naan') || i.id.includes('roti') || i.id.includes('bread'));
  const hasBeverage = cartItems.some((i) => i.id.includes('chai') || i.id.includes('lassi'));
  const hasDessert = cartItems.some((i) => i.id.includes('gulab') || i.id.includes('phirni') || i.id.includes('rabdi'));

  const candidateMap = new Map<string, SmartPairing>();

  // Rule 1: Biryani needs Burani Garlic Raita and Mirchi Ka Salan
  if (hasBiryani) {
    const raita = allMenuItems.find((m) => m.id === 'burani-garlic-raita');
    if (raita && !cartIds.has(raita.id)) {
      candidateMap.set(raita.id, {
        item: raita,
        reason: 'Cooling roasted garlic hung curd balances royal dum spices.',
        tag: '👑 Biryani Essential',
        matchScore: 98
      });
    }

    const salan = allMenuItems.find((m) => m.id === 'mirchi-ka-salan');
    if (salan && !cartIds.has(salan.id)) {
      candidateMap.set(salan.id, {
        item: salan,
        reason: 'Tangy peanut-sesame salan elevates fragrant dum rice.',
        tag: '🔥 Royal Nizami Pairing',
        matchScore: 92
      });
    }
  }

  // Rule 2: Curries need artisan tandoor breads
  if (hasCurry && !hasBread) {
    const naan = allMenuItems.find((m) => m.id === 'butter-garlic-naan');
    if (naan && !cartIds.has(naan.id)) {
      candidateMap.set(naan.id, {
        item: naan,
        reason: 'Blistered garlic naan is ideal for wiping rich satin gravies clean.',
        tag: '🧈 Tandoor Essential',
        matchScore: 95
      });
    }
  }

  // Rule 3: Main meal needs sweet closure (Dessert)
  if (!hasDessert) {
    const phirni = allMenuItems.find((m) => m.id === 'kesari-phirni');
    if (phirni && !cartIds.has(phirni.id)) {
      candidateMap.set(phirni.id, {
        item: phirni,
        reason: 'Chilled Kashmiri saffron rice pudding served in clay pot.',
        tag: '🍮 Royal Meetha',
        matchScore: 89
      });
    } else {
      const jamun = allMenuItems.find((m) => m.id === 'gulab-jamun-rabdi');
      if (jamun && !cartIds.has(jamun.id)) {
        candidateMap.set(jamun.id, {
          item: jamun,
          reason: 'Warm melt-in-mouth dumplings with chilled pistachio rabdi.',
          tag: '✨ Classic Finish',
          matchScore: 86
        });
      }
    }
  }

  // Rule 4: Chilled drink or hot tea refresher
  if (!hasBeverage) {
    const lassi = allMenuItems.find((m) => m.id === 'mango-shahi-lassi');
    if (lassi && !cartIds.has(lassi.id)) {
      candidateMap.set(lassi.id, {
        item: lassi,
        reason: 'Thick Alphonso mango & rich clotted malai refreshment.',
        tag: '🥭 Chilled Shahi Drink',
        matchScore: 88
      });
    }
  }

  // Fallback if none triggered
  if (candidateMap.size === 0) {
    const fallback = allMenuItems.find((m) => !cartIds.has(m.id));
    if (fallback) {
      candidateMap.set(fallback.id, {
        item: fallback,
        reason: 'Chef recommended royal specialty to complete your dining experience.',
        tag: '⭐ Highly Rated',
        matchScore: 70
      });
    }
  }

  return Array.from(candidateMap.values())
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

/**
 * AI Sommelier Banquet Generator for bespoke feast curation
 */
export function curateRoyalFeast(
  options: {
    partySize: number; // 1, 2, 4
    dietary: string; // 'All' | 'Pure Veg' | 'Jain Friendly' | 'Keto Friendly'
    spicePreference: number; // 1, 2, 3
  },
  menuItems: MenuItem[]
): CuratedFeast {
  const { partySize, dietary } = options;

  let filtered = [...menuItems];
  if (dietary === 'Pure Veg') {
    filtered = filtered.filter((i) => i.isVeg);
  } else if (dietary === 'Jain Friendly') {
    filtered = filtered.filter((i) => i.dietary?.includes('Jain Friendly'));
  } else if (dietary === 'Keto Friendly') {
    filtered = filtered.filter((i) => i.dietary?.includes('Keto Friendly'));
  }

  const selectedItems: MenuItem[] = [];

  if (partySize === 1) {
    // Solo Connoisseur: 1 Main + 1 Accompaniment + 1 Drink
    const main =
      filtered.find((i) => i.category === 'Biryani') ||
      filtered.find((i) => i.category === 'Curries') ||
      menuItems[0];
    const side =
      filtered.find((i) => i.id === 'burani-garlic-raita' || i.category === 'Breads') ||
      menuItems[3];
    const drink =
      filtered.find((i) => i.category === 'Desserts & Beverages') ||
      menuItems[6];

    if (main) selectedItems.push(main);
    if (side && !selectedItems.some((s) => s.id === side.id)) selectedItems.push(side);
    if (drink && !selectedItems.some((s) => s.id === drink.id)) selectedItems.push(drink);

    const originalTotal = selectedItems.reduce((acc, i) => acc + i.price, 0);
    const bundlePrice = Math.round(originalTotal * 0.85);

    return {
      id: 'solo-royal-feast',
      title: 'Solo Shahi Feast (Feast for 1)',
      subtitle: 'Complete 3-course royal dining experience with handcrafted pairings',
      partySize: 1,
      dietary,
      items: selectedItems,
      originalTotal,
      bundlePrice,
      savings: originalTotal - bundlePrice,
      chefNotes:
        'Savor the piping hot dum grains alongside the chilled garlic raita, ending with the warm kulhad chai.'
    };
  }

  if (partySize === 2) {
    // Royal Couple: 2 Mains + 1 Bread + 1 Side + 2 Desserts/Drinks
    const main1 =
      filtered.find((i) => i.id === 'kolkata-chicken-biryani') ||
      filtered.find((i) => i.category === 'Biryani') ||
      menuItems[0];
    const main2 =
      filtered.find((i) => i.id === 'paneer-butter-masala') ||
      filtered.find((i) => i.category === 'Curries') ||
      menuItems[2];
    const bread =
      filtered.find((i) => i.id === 'butter-garlic-naan') ||
      menuItems[4];
    const side =
      filtered.find((i) => i.id === 'burani-garlic-raita') ||
      menuItems[3];
    const dessert =
      filtered.find((i) => i.id === 'kesari-phirni' || i.id === 'gulab-jamun-rabdi') ||
      menuItems[5];

    [main1, main2, bread, side, dessert].forEach((item) => {
      if (item && !selectedItems.some((s) => s.id === item.id)) {
        selectedItems.push(item);
      }
    });

    const originalTotal = selectedItems.reduce((acc, i) => acc + i.price, 0);
    const bundlePrice = Math.round(originalTotal * 0.85);

    return {
      id: 'royal-couple-dastarkhwan',
      title: 'Royal Couple Dastarkhwan (Dining for 2)',
      subtitle: 'Luxurious harmony of slow-cooked dum biryani, buttery curry & artisan naan',
      partySize: 2,
      dietary,
      items: selectedItems,
      originalTotal,
      bundlePrice,
      savings: originalTotal - bundlePrice,
      chefNotes:
        'Share the slow-steamed biryani with aromatic raita, followed by blistered naan dipped in rich satin makhani gravy.'
    };
  }

  // Grand Family Dastarkhwan (3-4 People)
  const b1 = filtered.find((i) => i.id === 'kolkata-chicken-biryani') || menuItems[0];
  const b2 = filtered.find((i) => i.id === 'awadhi-mutton-biryani') || menuItems[1];
  const curry = filtered.find((i) => i.id === 'paneer-butter-masala') || menuItems[2];
  const bread = filtered.find((i) => i.id === 'butter-garlic-naan') || menuItems[4];
  const raita = filtered.find((i) => i.id === 'burani-garlic-raita') || menuItems[3];
  const salan = filtered.find((i) => i.id === 'mirchi-ka-salan') || menuItems[5];
  const dessert = filtered.find((i) => i.id === 'kesari-phirni') || menuItems[6];

  [b1, b2, curry, bread, raita, salan, dessert].forEach((item) => {
    if (item && !selectedItems.some((s) => s.id === item.id)) {
      selectedItems.push(item);
    }
  });

  const originalTotal = selectedItems.reduce((acc, i) => acc + i.price, 0);
  const bundlePrice = Math.round(originalTotal * 0.82);

  return {
    id: 'grand-shahi-dastarkhwan',
    title: 'Grand Shahi Dastarkhwan (Family of 4+)',
    subtitle: 'The ultimate royal banquet with signature biryanis, gravies, accompaniments & dessert',
    partySize: 4,
    dietary,
    items: selectedItems,
    originalTotal,
    bundlePrice,
    savings: originalTotal - bundlePrice,
    chefNotes:
      'The crown jewel of Indian feast curation: slow dum-pukht meats, fragrant saffron rice, charred naan, and rich silver-leaf phirni.'
  };
}
