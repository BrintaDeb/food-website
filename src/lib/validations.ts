import { z } from 'zod';

export const menuItemSchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters'),
  category: z.string().default('Biryani'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  image: z.string().optional().default('/images/kolkata-biryani.jpg'),
  description: z.string().optional().default(''),
  inStock: z.boolean().optional().default(true),
  prepTime: z.string().optional().default('20 mins'),
  isVeg: z.boolean().optional().default(false),
  spiceLevel: z.coerce.number().min(1).max(3).optional().default(1),
  tags: z.array(z.string()).optional().default([]),
  calories: z.number().optional()
});

export const updateMenuItemSchema = menuItemSchema.partial();

export const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  image: z.string().optional()
});

export const orderCustomerSchema = z.object({
  name: z.string().min(2, 'Customer name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  alternatePhone: z.string().optional().default(''),
  email: z.string().email().optional().or(z.literal('')),
  flat: z.string().optional().default(''),
  street: z.string().optional().default(''),
  landmark: z.string().optional().default(''),
  city: z.string().optional().default('Bengaluru'),
  pincode: z.string().optional().default(''),
  address: z.string().optional().default(''),
  deliveryType: z.enum(['Home Delivery', 'Takeaway', 'Dine-in']).default('Home Delivery'),
  paymentMethod: z.string().default('Cash on Delivery'),
  notes: z.string().optional().default(''),
  addressDetails: z
    .object({
      flat: z.string().optional(),
      street: z.string().optional(),
      landmark: z.string().optional(),
      city: z.string().optional(),
      pincode: z.string().optional()
    })
    .optional()
});

export const createOrderSchema = z.object({
  customer: orderCustomerSchema,
  items: z.array(orderItemSchema).min(1, 'Cart cannot be empty'),
  promoCode: z.string().optional().default('')
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'])
});

export const customerProfileSchema = z.object({
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  addresses: z.array(z.string()).optional()
});
