import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { X, Minus, Plus, Trash2, ArrowRight, Tag } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useCartStore } from '@/store/useCartStore';
import { formatINR } from '@/utils/currency';
import { COLORS, SHADOWS } from '@/constants/theme';

export default function CartScreen() {
  const router = useRouter();
  const {
    items,
    subtotal,
    discount,
    discountLabel,
    taxableAmount,
    gst,
    deliveryFee,
    grandTotal,
    updateQuantity,
    removeItem,
    applyPromo,
    clearPromo
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('ROYAL50');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isCouponError, setIsCouponError] = useState(false);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const res = applyPromo(couponInput.trim());
    setCouponMessage(res.message);
    setIsCouponError(!res.success);

    try {
      if (res.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch {}
  };

  const handleProceedCheckout = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={20} color={COLORS.charcoal} />
          </TouchableOpacity>
          <Text style={styles.topNavTitle}>Your Food Bag</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyContent}>
          <View style={styles.emptyIconCircle}>
            <Text style={{ fontSize: 36 }}>🍛</Text>
          </View>
          <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Explore our royal Kolkata dum biryanis, dal sambar, and tandoori breads!
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/menu')}
            style={styles.browseMenuButton}
          >
            <Text style={styles.browseMenuButtonText}>Browse Indian Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={20} color={COLORS.charcoal} />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>Your Food Bag ({items.length})</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cart Item Cards */}
        <View style={styles.itemsList}>
          {items.map((it) => (
            <View key={it.id} style={[styles.itemCard, SHADOWS.card]}>
              <Image
                source={{
                  uri: it.image.startsWith('http')
                    ? it.image
                    : `https://raw.githubusercontent.com/BrintaDeb/food-website/main/${it.image.replace(/^\//, '')}`
                }}
                style={styles.itemThumb}
                resizeMode="cover"
              />

              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {it.name}
                </Text>
                <Text style={styles.itemPricePerUnit}>{formatINR(it.price)} each</Text>

                <View style={styles.quantityRow}>
                  {/* Stepper */}
                  <View style={styles.stepper}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(it.id, it.quantity - 1)}
                      style={styles.stepBtn}
                    >
                      <Minus size={14} color={COLORS.charcoal} />
                    </TouchableOpacity>
                    <Text style={styles.stepQty}>{it.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(it.id, it.quantity + 1)}
                      style={styles.stepBtn}
                    >
                      <Plus size={14} color={COLORS.charcoal} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemLineTotal}>{formatINR(it.price * it.quantity)}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => removeItem(it.id)} style={styles.deleteButton}>
                <Trash2 size={16} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Promo Code Section */}
        <View style={[styles.couponBox, SHADOWS.card]}>
          <View style={styles.couponInputRow}>
            <Tag size={16} color={COLORS.primary} />
            <TextInput
              value={couponInput}
              onChangeText={(t) => setCouponInput(t.toUpperCase())}
              placeholder="Enter Coupon Code"
              placeholderTextColor={COLORS.muted}
              autoCapitalize="characters"
              style={styles.couponInput}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleApplyCoupon}
              style={styles.applyCouponBtn}
            >
              <Text style={styles.applyCouponBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {couponMessage && (
            <Text
              style={[
                styles.couponFeedback,
                { color: isCouponError ? COLORS.nonVegRed : COLORS.vegGreen }
              ]}
            >
              {couponMessage}
            </Text>
          )}
        </View>

        {/* Bill Summary Breakdown */}
        <View style={[styles.billSummaryBox, SHADOWS.card]}>
          <Text style={styles.billHeading}>Bill Details</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Subtotal</Text>
            <Text style={styles.billValue}>{formatINR(subtotal)}</Text>
          </View>

          {discount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: COLORS.vegGreen }]}>
                {discountLabel || 'Discount Applied'}
              </Text>
              <Text style={[styles.billValue, { color: COLORS.vegGreen }]}>
                -{formatINR(discount)}
              </Text>
            </View>
          )}

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>GST (5%)</Text>
            <Text style={styles.billValue}>{formatINR(gst)}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee</Text>
            <Text style={styles.billValue}>
              {deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
            </Text>
          </View>

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>To Pay</Text>
            <Text style={styles.grandTotalValue}>{formatINR(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, SHADOWS.modal]}>
        <View>
          <Text style={styles.bottomTotalLabel}>GRAND TOTAL</Text>
          <Text style={styles.bottomTotalValue}>{formatINR(grandTotal)}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleProceedCheckout}
          style={styles.checkoutBtn}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <ArrowRight size={18} color="#FFFFFF" />
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
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.cream
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#FFFFFF'
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topNavTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.charcoal,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24
  },
  browseMenuButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16
  },
  browseMenuButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
    gap: 16
  },
  itemsList: {
    gap: 12
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12
  },
  itemThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: COLORS.surface
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  itemPricePerUnit: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '600',
    marginTop: 2
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 2,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepQty: {
    width: 28,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  itemLineTotal: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary
  },
  deleteButton: {
    padding: 6
  },
  couponBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  couponInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.charcoal
  },
  applyCouponBtn: {
    backgroundColor: COLORS.charcoal,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12
  },
  applyCouponBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  couponFeedback: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8
  },
  billSummaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10
  },
  billHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.charcoal,
    marginBottom: 4
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  billLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  billValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
    marginTop: 4
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary
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
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomTotalLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 0.5
  },
  bottomTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
    gap: 8
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900'
  }
});
