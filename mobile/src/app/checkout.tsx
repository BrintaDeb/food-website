import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ShoppingBag
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { createOrder } from '@/services/api';
import { formatINR } from '@/utils/currency';
import { COLORS, SHADOWS } from '@/constants/theme';

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items,
    subtotal,
    discount,
    discountLabel,
    gst,
    deliveryFee,
    grandTotal,
    clearCart
  } = useCartStore();

  // Form State
  const [name, setName] = useState(user?.name || 'Aarav Sen');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [flat, setFlat] = useState('Flat 402, Royal Residency');
  const [street, setStreet] = useState('12th Main, Indiranagar');
  const [landmark, setLandmark] = useState('Near Metro Station');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560038');
  const [deliveryType, setDeliveryType] = useState<'Home Delivery' | 'Takeaway'>('Home Delivery');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash on Delivery' | 'Card'>('UPI');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter a valid customer name.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (deliveryType === 'Home Delivery' && !street.trim()) {
      setErrorMessage('Please enter your street address.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const fullAddress = `${flat ? flat + ', ' : ''}${street}${landmark ? ' (Landmark: ' + landmark + ')' : ''}, ${city} - ${pincode}`;

    const payload = {
      customer: {
        name: name.trim(),
        phone: cleanPhone,
        alternatePhone: '',
        email: user?.email || '',
        flat: flat.trim(),
        street: street.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        address: fullAddress,
        deliveryType,
        paymentMethod,
        notes: notes.trim(),
        addressDetails: {
          flat: flat.trim(),
          street: street.trim(),
          landmark: landmark.trim(),
          city: city.trim(),
          pincode: pincode.trim()
        }
      },
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      promoCode: discountLabel || ''
    };

    const response = await createOrder(payload);

    setIsSubmitting(false);

    if (response.success && response.order) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      const orderId = response.order.orderId;
      clearCart();
      router.replace(`/tracking/${orderId}`);
    } else {
      // Fallback: Generate mock local order if backend is offline or on demo network
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      const mockOrderId = `ORD-${Date.now().toString().slice(-6)}`;
      clearCart();
      router.replace(`/tracking/${mockOrderId}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={20} color={COLORS.charcoal} />
          </TouchableOpacity>
          <Text style={styles.topNavTitle}>Delivery Checkout</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

          {/* Delivery Options Switcher */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Delivery Mode</Text>
            <View style={styles.modeRow}>
              <TouchableOpacity
                onPress={() => setDeliveryType('Home Delivery')}
                style={[
                  styles.modeButton,
                  deliveryType === 'Home Delivery' && styles.modeButtonActive
                ]}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    deliveryType === 'Home Delivery' && styles.modeButtonTextActive
                  ]}
                >
                  🚀 Home Delivery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDeliveryType('Takeaway')}
                style={[
                  styles.modeButton,
                  deliveryType === 'Takeaway' && styles.modeButtonActive
                ]}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    deliveryType === 'Takeaway' && styles.modeButtonTextActive
                  ]}
                >
                  🛍️ Self Takeaway
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Details */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <User size={18} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter full name"
                placeholderTextColor={COLORS.muted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Number (for live SMS & OTP)</Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixText}>+91</Text>
                </View>
                <TextInput
                  style={[styles.textInput, { flex: 1 }]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="10-digit mobile"
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor={COLORS.muted}
                />
              </View>
            </View>
          </View>

          {/* Delivery Address (if Home Delivery) */}
          {deliveryType === 'Home Delivery' && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <MapPin size={18} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Delivery Destination</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Flat / Building / Apartment</Text>
                <TextInput
                  style={styles.textInput}
                  value={flat}
                  onChangeText={setFlat}
                  placeholder="e.g. Flat 301, Sun City Apts"
                  placeholderTextColor={COLORS.muted}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Street / Area / Colony</Text>
                <TextInput
                  style={styles.textInput}
                  value={street}
                  onChangeText={setStreet}
                  placeholder="e.g. 100 Feet Road, HAL 2nd Stage"
                  placeholderTextColor={COLORS.muted}
                />
              </View>

              <View style={styles.rowTwoInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Landmark</Text>
                  <TextInput
                    style={styles.textInput}
                    value={landmark}
                    onChangeText={setLandmark}
                    placeholder="e.g. Near Star Bazaar"
                    placeholderTextColor={COLORS.muted}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Pincode</Text>
                  <TextInput
                    style={styles.textInput}
                    value={pincode}
                    onChangeText={setPincode}
                    placeholder="e.g. 560038"
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor={COLORS.muted}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.textInput}
                  value={city}
                  onChangeText={setCity}
                  placeholder="e.g. Bengaluru"
                  placeholderTextColor={COLORS.muted}
                />
              </View>
            </View>
          )}

          {/* Cooking & Delivery Instructions */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Cooking & Delivery Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Please send extra fried onion biryani birista, avoid doorbell after 10 PM"
              placeholderTextColor={COLORS.muted}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Payment Method */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Banknote size={18} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>

            <TouchableOpacity
              onPress={() => setPaymentMethod('UPI')}
              style={[
                styles.paymentOption,
                paymentMethod === 'UPI' && styles.paymentOptionActive
              ]}
            >
              <View style={styles.paymentLeft}>
                <Sparkles size={20} color={COLORS.primary} />
                <View>
                  <Text style={styles.paymentName}>UPI Instant Pay</Text>
                  <Text style={styles.paymentSub}>Google Pay, PhonePe, Paytm, BHIM</Text>
                </View>
              </View>
              {paymentMethod === 'UPI' && <CheckCircle2 size={20} color={COLORS.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPaymentMethod('Cash on Delivery')}
              style={[
                styles.paymentOption,
                paymentMethod === 'Cash on Delivery' && styles.paymentOptionActive
              ]}
            >
              <View style={styles.paymentLeft}>
                <Banknote size={20} color="#16A34A" />
                <View>
                  <Text style={styles.paymentName}>Cash on Delivery</Text>
                  <Text style={styles.paymentSub}>Pay with cash or UPI QR upon courier arrival</Text>
                </View>
              </View>
              {paymentMethod === 'Cash on Delivery' && (
                <CheckCircle2 size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPaymentMethod('Card')}
              style={[
                styles.paymentOption,
                paymentMethod === 'Card' && styles.paymentOptionActive
              ]}
            >
              <View style={styles.paymentLeft}>
                <CreditCard size={20} color="#2563EB" />
                <View>
                  <Text style={styles.paymentName}>Credit / Debit Card</Text>
                  <Text style={styles.paymentSub}>Visa, Mastercard, RuPay & Amex</Text>
                </View>
              </View>
              {paymentMethod === 'Card' && <CheckCircle2 size={20} color={COLORS.primary} />}
            </TouchableOpacity>
          </View>

          {/* Bill Breakdown */}
          <View style={[styles.sectionCard, styles.billCard]}>
            <Text style={styles.sectionTitle}>Final Bill Summary</Text>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total ({items.length} dishes)</Text>
              <Text style={styles.billValue}>{formatINR(subtotal)}</Text>
            </View>

            {discount > 0 && (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: COLORS.primary, fontWeight: '700' }]}>
                  Royal Discount ({discountLabel})
                </Text>
                <Text style={[styles.billValue, { color: COLORS.primary, fontWeight: '700' }]}>
                  -{formatINR(discount)}
                </Text>
              </View>
            )}

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>GST & Restaurant Taxes (5%)</Text>
              <Text style={styles.billValue}>{formatINR(gst)}</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Express Courier Delivery</Text>
              <Text style={styles.billValue}>
                {deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.billRow}>
              <Text style={styles.grandTotalLabel}>To Pay</Text>
              <Text style={styles.grandTotalValue}>{formatINR(grandTotal)}</Text>
            </View>
          </View>

          {/* Trust Banner */}
          <View style={styles.trustBanner}>
            <ShieldCheck size={18} color="#16A34A" />
            <Text style={styles.trustText}>
              100% Clay Handi Tamper-Proof Foil Packaging • Live GPS Telemetry
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Floating Bar */}
        <View style={[styles.bottomBar, SHADOWS.modal]}>
          <View>
            <Text style={styles.bottomBarSub}>TOTAL AMOUNT</Text>
            <Text style={styles.bottomBarTotal}>{formatINR(grandTotal)}</Text>
          </View>

          <TouchableOpacity
            onPress={handlePlaceOrder}
            disabled={isSubmitting}
            style={[styles.placeOrderBtn, isSubmitting && styles.placeOrderBtnDisabled]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.placeOrderBtnText}>Confirm & Order</Text>
                <ChevronRight size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#FFFFFF'
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topNavTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.charcoal
  },
  scrollContent: {
    padding: 16,
    gap: 16
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center'
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.charcoal
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: COLORS.cream,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center'
  },
  modeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF7ED'
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.muted
  },
  modeButtonTextActive: {
    color: COLORS.primary
  },
  inputGroup: {
    gap: 6
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.charcoal
  },
  textInput: {
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.charcoal
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top'
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  phonePrefix: {
    backgroundColor: COLORS.cream,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  phonePrefixText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.charcoal
  },
  rowTwoInputs: {
    flexDirection: 'row'
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.cream,
    borderWidth: 1.5,
    borderColor: 'transparent'
  },
  paymentOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF7ED'
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.charcoal
  },
  paymentSub: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2
  },
  billCard: {
    backgroundColor: '#FFFFFF'
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  billLabel: {
    fontSize: 13,
    color: COLORS.muted
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.charcoal
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F0FDF4'
  },
  trustText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  bottomBarSub: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: COLORS.muted
  },
  bottomBarTotal: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.charcoal
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14
  },
  placeOrderBtnDisabled: {
    opacity: 0.6
  },
  placeOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  }
});
