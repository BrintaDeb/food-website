export type DeliveryStatus =
  'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface CustomerInfo {
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
  deliveryType: 'Home Delivery' | 'Takeaway' | 'Dine-in';
  paymentMethod: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  lineTotal: number;
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

export interface Order {
  id: string;
  orderId: string;
  createdAt: string;
  formattedDate: string;
  formattedTime: string;
  status: DeliveryStatus;
  statusStep: number;
  estimatedTime: string;
  customer: CustomerInfo;
  items: OrderItem[];
  pricing: OrderPricing;
  updatedAt?: string;
}
