'use client';

import { useState } from 'react';
import { X, Loader2, Bike, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { placeOrder } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { toast } from '@/lib/toast';
import type { Order, DeliveryType, PaymentMethod } from '@/types/order';
import { ReceiptModal } from '@/components/checkout/ReceiptModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, promoCode, clearCart, subtotal, discount, discountLabel, gst, totalCount } =
    useCartStore();

  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('Home Delivery');
  const [flat, setFlat] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('');
  const [pickupNote, setPickupNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');

  if (!isOpen) return null;

  const currentDeliveryFee =
    deliveryType === 'Takeaway' || deliveryType === 'Dine-in' || subtotal >= 500 ? 0 : 30;
  const taxableAmount = Math.max(0, subtotal - discount);
  const currentGrandTotal = +(taxableAmount + gst + currentDeliveryFee).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      toast.show('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    if (deliveryType === 'Home Delivery' && (!flat.trim() || !street.trim())) {
      toast.show('Please fill in your flat/house and street details.', 'error');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customer: {
          name: name.trim(),
          phone: cleanPhone,
          alternatePhone: alternatePhone.trim(),
          email: email.trim(),
          flat: flat.trim(),
          street: street.trim(),
          landmark: landmark.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          deliveryType,
          paymentMethod,
          notes: pickupNote.trim(),
          addressDetails: {
            flat: flat.trim(),
            street: street.trim(),
            landmark: landmark.trim(),
            city: city.trim(),
            pincode: pincode.trim()
          }
        },
        items: items.map((it) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          image: it.image
        })),
        promoCode
      };

      const res = await placeOrder(payload);
      if (res.success && res.order) {
        clearCart();
        toast.show('Order placed successfully!', 'success');
        setCreatedOrder(res.order);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Order submission failed';
      toast.show(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkoutModalTitle"
        className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      >
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E8E5E0] animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E8E5E0] flex items-center justify-between bg-[#FFFDF9]">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍛</span>
              <div>
                <h3
                  id="checkoutModalTitle"
                  className="text-xl font-outfit font-black text-[#1A1311]"
                >
                  Complete Your Order
                </h3>
                <p className="text-xs text-neutral-500">
                  Freshly prepared slow dum-pukht in royal tamper-sealed packaging
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-neutral-400 hover:text-black hover:bg-black/5 transition-colors"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Contact Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-wider text-neutral-400 uppercase">
                1. Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-[#FF5E00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-[#FF5E00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Alternate Phone
                  </label>
                  <input
                    type="tel"
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                    placeholder="Optional backup number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-[#FF5E00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Optional for digital receipt"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-[#FF5E00]"
                  />
                </div>
              </div>
            </div>

            {/* Order Type */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-wider text-neutral-400 uppercase">
                2. Order Type
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { type: 'Home Delivery', icon: Bike, fee: '₹30 (Free > ₹500)' },
                  { type: 'Takeaway', icon: ShoppingBag, fee: 'Free Pickup' },
                  { type: 'Dine-in', icon: UtensilsCrossed, fee: 'Table Service' }
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = deliveryType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setDeliveryType(opt.type as DeliveryType)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-[#FF5E00] bg-[#FF5E00]/5 ring-1 ring-[#FF5E00]'
                          : 'border-[#E8E5E0] bg-white hover:border-neutral-300'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isSelected ? 'text-[#FF5E00]' : 'text-neutral-500'}`}
                      />
                      <div className="mt-2">
                        <p className="font-outfit font-bold text-sm text-[#1A1311]">{opt.type}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{opt.fee}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Address Details (if Home Delivery) */}
            {deliveryType === 'Home Delivery' ? (
              <div className="space-y-3">
                <h4 className="text-xs font-black tracking-wider text-neutral-400 uppercase">
                  3. Delivery Destination
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Flat / House No. / Building *
                    </label>
                    <input
                      type="text"
                      required
                      value={flat}
                      onChange={(e) => setFlat(e.target.value)}
                      placeholder="e.g. Flat 302, Palm Heights"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-[#FF5E00]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Street / Area Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. 12th Main, 4th Cross"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-[#FF5E00]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near Sony Signal / Metro"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-[#FF5E00]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-[#FF5E00]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Postal PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 560038"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-[#FF5E00]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-xs font-black tracking-wider text-neutral-400 uppercase">
                  3. Table or Pickup Note
                </h4>
                <input
                  type="text"
                  value={pickupNote}
                  onChange={(e) => setPickupNote(e.target.value)}
                  placeholder={
                    deliveryType === 'Dine-in'
                      ? 'e.g. Table Number 4 or Window side'
                      : 'e.g. Pickup around 7:30 PM'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E5E0] text-sm focus:outline-none focus:border-[#FF5E00]"
                />
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-wider text-neutral-400 uppercase">
                4. Payment Method
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Cash on Delivery', 'UPI / QR', 'Card Payment'].map((method) => {
                  const isSelected = paymentMethod === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method as PaymentMethod)}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                        isSelected
                          ? 'border-[#FF5E00] bg-[#FF5E00]/5 text-[#FF5E00] ring-1 ring-[#FF5E00]'
                          : 'border-[#E8E5E0] bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      {method}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E8E5E0] space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Items ({totalCount})</span>
                <span className="font-semibold text-neutral-800">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{discountLabel || 'Discount'}</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Restaurant GST (5%)</span>
                <span>{formatINR(gst)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{currentDeliveryFee === 0 ? 'FREE' : formatINR(currentDeliveryFee)}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E5E0] flex justify-between text-base font-black text-[#1A1311]">
                <span>Estimated Grand Total</span>
                <span className="text-[#FF5E00]">{formatINR(currentGrandTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-[#FF5E00] hover:bg-[#e05200] disabled:bg-neutral-300 text-white font-black text-sm tracking-wide shadow-float transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Placing Your Order...</span>
                </>
              ) : (
                <span>Place Order & View Receipt • {formatINR(currentGrandTotal)}</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Show Receipt Modal on Successful Order */}
      {createdOrder && (
        <ReceiptModal
          order={createdOrder}
          isOpen={Boolean(createdOrder)}
          onClose={() => {
            setCreatedOrder(null);
            onClose();
          }}
        />
      )}
    </>
  );
}
