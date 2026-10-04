export type OrderStatus =
  'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export type DeliveryType = 'Home Delivery' | 'Takeaway' | 'Dine-in';

export type PaymentMethod = 'Cash on Delivery' | 'UPI / QR' | 'Card Payment' | string;

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  lineTotal: number;
}

export interface OrderCustomerDetails {
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  flat?: string;
  street?: string;
  landmark?: string;
  city?: string;
  pincode?: string;
  address: string;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface OrderPricing {
  itemsSubtotal: number;
  discount: number;
  discountLabel: string;
  taxableAmount: number;
  gst: number;
  deliveryFee: number;
  grandTotal: number;
}

export interface OrderPaymentDetails {
  paymentMethod: string;
  utr: string;
  transactionId: string;
  paidAt: string;
}

export interface OrderKitchenHub {
  id: string;
  name: string;
  area: string;
  address?: string;
  distanceKm?: number;
  etaMinutes?: number;
}

export interface Order {
  id: string;
  orderId: string;
  createdAt: string;
  formattedDate: string;
  formattedTime: string;
  status: OrderStatus;
  statusStep: number;
  estimatedTime: string;
  customer: OrderCustomerDetails;
  items: OrderItem[];
  pricing: OrderPricing;
  kitchenHub?: OrderKitchenHub;
  paymentDetails?: OrderPaymentDetails;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  customer: {
    name: string;
    phone: string;
    alternatePhone?: string;
    email?: string;
    flat?: string;
    street?: string;
    landmark?: string;
    city?: string;
    pincode?: string;
    address?: string;
    deliveryType?: DeliveryType;
    paymentMethod?: PaymentMethod;
    notes?: string;
    addressDetails?: {
      flat?: string;
      street?: string;
      landmark?: string;
      city?: string;
      pincode?: string;
    };
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  promoCode?: string;
  kitchenHub?: OrderKitchenHub;
  paymentDetails?: OrderPaymentDetails;
}
