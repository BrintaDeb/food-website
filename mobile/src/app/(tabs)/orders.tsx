import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Navigation, Clock, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { fetchCustomerOrders } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { formatINR } from '@/utils/currency';
import { COLORS, SHADOWS } from '@/constants/theme';
import type { Order } from '@/types/order';

const MOCK_FALLBACK_ORDERS: Order[] = [
  {
    id: 'ORD-61516',
    orderId: 'ORD-61516',
    createdAt: new Date().toISOString(),
    formattedDate: 'Today',
    formattedTime: 'Just now',
    status: 'Out for Delivery',
    statusStep: 3,
    estimatedTime: '15 - 20 mins',
    customer: {
      name: 'Shreyam Mukherjee',
      phone: '9988776655',
      address: '12 Park Street, Heritage Quarter, Kolkata',
      deliveryType: 'Home Delivery',
      paymentMethod: 'Cash on Delivery'
    },
    items: [
      {
        id: 'kolkata-chicken-biryani',
        name: 'Kolkata Chicken Biryani',
        price: 380,
        quantity: 2,
        image: 'images/kolkata-biryani.jpg',
        lineTotal: 760
      },
      {
        id: 'gulab-jamun-rabdi',
        name: 'Gulab Jamun with Kesari Rabdi',
        price: 160,
        quantity: 1,
        image: 'images/gulab-jamun-rabdi.jpg',
        lineTotal: 160
      }
    ],
    pricing: {
      itemsSubtotal: 920,
      discount: 460,
      discountLabel: '50% Royal Special (ROYAL50)',
      taxableAmount: 460,
      gst: 23.0,
      deliveryFee: 0,
      grandTotal: 483.0
    }
  },
  {
    id: 'ORD-58384',
    orderId: 'ORD-58384',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    formattedDate: '2 Days Ago',
    formattedTime: '08:30 pm',
    status: 'Delivered',
    statusStep: 4,
    estimatedTime: 'Delivered',
    customer: {
      name: 'Shreyam Mukherjee',
      phone: '9988776655',
      address: '12 Park Street, Heritage Quarter, Kolkata',
      deliveryType: 'Home Delivery',
      paymentMethod: 'UPI'
    },
    items: [
      {
        id: 'paneer-butter-masala',
        name: 'Paneer Butter Masala',
        price: 320,
        quantity: 1,
        image: 'images/paneer-butter-masala.jpg',
        lineTotal: 320
      },
      {
        id: 'butter-garlic-naan',
        name: 'Butter Garlic Naan (2 pcs)',
        price: 120,
        quantity: 2,
        image: 'images/butter-garlic-naan.jpg',
        lineTotal: 240
      }
    ],
    pricing: {
      itemsSubtotal: 560,
      discount: 280,
      discountLabel: '50% Royal Special (ROYAL50)',
      taxableAmount: 280,
      gst: 14.0,
      deliveryFee: 0,
      grandTotal: 294.0
    }
  }
];

export default function OrdersScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);

  const { data: serverOrders = [] } = useQuery({
    queryKey: ['orders', user?.phone],
    queryFn: () => fetchCustomerOrders(user?.phone || '9876543210'),
    enabled: !!user?.phone
  });

  const orders: Order[] =
    serverOrders.length > 0 ? serverOrders : MOCK_FALLBACK_ORDERS;

  const handleTrack = (orderId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    router.push({
      pathname: '/tracking/[orderId]',
      params: { orderId }
    });
  };

  const handleReorder = (order: Order) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    for (const item of order.items) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      });
    }
    router.push('/cart');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History & Tracking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {orders.map((order) => {
          const isActive = order.status !== 'Delivered' && order.status !== 'Cancelled';

          return (
            <View key={order.id} style={[styles.orderCard, SHADOWS.card]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderIdText}>Order #{order.orderId}</Text>
                  <Text style={styles.orderDateText}>
                    {order.formattedDate} • {order.formattedTime}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: isActive ? COLORS.primarySoft : '#ECFDF5' }
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: isActive ? COLORS.primary : COLORS.vegGreen }
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>

              {/* Dish Items summary */}
              <View style={styles.itemsSummary}>
                {order.items.map((it) => (
                  <View key={it.id} style={styles.itemRow}>
                    <Text style={styles.itemNameText}>
                      {it.quantity}x {it.name}
                    </Text>
                    <Text style={styles.itemPriceText}>{formatINR(it.lineTotal)}</Text>
                  </View>
                ))}
              </View>

              {/* Total Row */}
              <View style={styles.totalRow}>
                <Text style={styles.grandTotalLabel}>Grand Total Paid</Text>
                <Text style={styles.grandTotalValue}>{formatINR(order.pricing.grandTotal)}</Text>
              </View>

              {/* Action Row */}
              <View style={styles.actionRow}>
                {isActive ? (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleTrack(order.orderId)}
                    style={styles.trackButton}
                  >
                    <Navigation size={16} color="#FFFFFF" />
                    <Text style={styles.trackButtonText}>Track Live Courier GPS</Text>
                    <ChevronRight size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleReorder(order)}
                    style={styles.reorderButton}
                  >
                    <RotateCcw size={14} color={COLORS.charcoal} />
                    <Text style={styles.reorderButtonText}>Reorder Dishes</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  orderDateText: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '600',
    marginTop: 2
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800'
  },
  itemsSummary: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    gap: 6
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemNameText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  itemPriceText: {
    fontSize: 12,
    color: COLORS.charcoal,
    fontWeight: '700'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
    marginBottom: 12
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary
  },
  actionRow: {
    flexDirection: 'row'
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  reorderButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  reorderButtonText: {
    color: COLORS.charcoal,
    fontSize: 13,
    fontWeight: '800'
  }
});
