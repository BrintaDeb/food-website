import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrders, getCustomers, saveCustomers } from '@/lib/db';
import { createOrderSchema } from '@/lib/validations';
import type { Order, OrderItem } from '@/types/order';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const phone = searchParams.get('phone');
    const search = searchParams.get('search');

    const orders = await getOrders();
    let result = orders;

    if (status && status !== 'All') {
      result = result.filter((o) => (o.status || '').toLowerCase() === status.toLowerCase());
    }
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      result = result.filter((o) =>
        (o.customer?.phone || '').replace(/\D/g, '').includes(cleanPhone)
      );
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          (o.orderId || '').toLowerCase().includes(q) ||
          (o.customer?.name || '').toLowerCase().includes(q) ||
          (o.customer?.address || '').toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: result.length,
      orders: result
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch orders';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createOrderSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: validated.error.issues.map((e: { message: string }) => e.message).join(', ')
        },
        { status: 400 }
      );
    }

    const { customer, items, promoCode } = validated.data;

    // Address formatting
    const addrDetails = customer.addressDetails || {};
    const flat = (customer.flat || addrDetails.flat || '').trim();
    const street = (customer.street || addrDetails.street || '').trim();
    const landmark = (customer.landmark || addrDetails.landmark || '').trim();
    const city = (customer.city || addrDetails.city || 'Bengaluru').trim();
    const pincode = (customer.pincode || addrDetails.pincode || '').trim();

    let fullAddress = (customer.address || '').trim();
    if (flat || street || city) {
      const parts = [
        flat ? `Flat/House: ${flat}` : '',
        street ? `Street/Building: ${street}` : '',
        landmark ? `Landmark: ${landmark}` : '',
        city,
        pincode ? `PIN: ${pincode}` : ''
      ].filter(Boolean);
      fullAddress = parts.join(', ');
    }

    if (!fullAddress && customer.deliveryType === 'Home Delivery') {
      return NextResponse.json(
        { success: false, message: 'Please provide delivery address details.' },
        { status: 400 }
      );
    }

    // Calculations
    let itemsSubtotal = 0;
    const formattedItems: OrderItem[] = items.map((it) => {
      const qty = Math.max(1, it.quantity || 1);
      const price = Math.max(0, it.price || 0);
      const lineTotal = +(price * qty).toFixed(2);
      itemsSubtotal += lineTotal;
      return {
        id: it.id,
        name: it.name,
        price,
        quantity: qty,
        image: it.image || '/images/kolkata-biryani.jpg',
        lineTotal
      };
    });

    itemsSubtotal = +itemsSubtotal.toFixed(2);

    // Discount calculation
    let discount = 0;
    let discountLabel = '';
    const upperCode = (promoCode || '').toUpperCase();

    if (upperCode === 'ROYAL50' || upperCode === 'EARTH50') {
      discount = +(itemsSubtotal * 0.5).toFixed(2);
      discountLabel = `50% Royal Special (${upperCode})`;
    } else if (items.some((it) => it.id === 'promo-combo' || it.id === 'nawabi-feast-combo')) {
      discount = 50.0;
      discountLabel = 'Combo Special Discount';
    }

    const taxableAmount = Math.max(0, itemsSubtotal - discount);
    const gst = +(taxableAmount * 0.05).toFixed(2); // 5% GST

    let deliveryFee = 30.0;
    if (
      customer.deliveryType === 'Takeaway' ||
      customer.deliveryType === 'Dine-in' ||
      itemsSubtotal >= 500
    ) {
      deliveryFee = 0.0;
    }

    const grandTotal = +(taxableAmount + gst + deliveryFee).toFixed(2);

    // Generate Order ID
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const orderId = `CC-${orderNumber}`;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
    const formattedTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });

    const newOrder: Order = {
      id: orderId,
      orderId,
      createdAt: now.toISOString(),
      formattedDate,
      formattedTime,
      status: 'Confirmed',
      statusStep: 1,
      estimatedTime: '25 - 35 mins',
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        alternatePhone: (customer.alternatePhone || '').trim(),
        email: (customer.email || '').trim(),
        flat,
        street,
        landmark,
        city,
        pincode,
        address: fullAddress || 'Takeaway Counter',
        deliveryType: customer.deliveryType,
        paymentMethod: customer.paymentMethod || 'Cash on Delivery',
        notes: (customer.notes || '').trim()
      },
      items: formattedItems,
      pricing: {
        itemsSubtotal,
        discount,
        discountLabel,
        taxableAmount,
        gst,
        deliveryFee,
        grandTotal
      }
    };

    const orders = await getOrders();
    orders.unshift(newOrder);
    await saveOrders(orders);

    // Sync Customer Profile
    if (customer.phone) {
      try {
        const customers = await getCustomers();
        const cleanP = customer.phone.replace(/\D/g, '');
        let cust = customers.find((c) => (c.phone || '').replace(/\D/g, '') === cleanP);
        if (!cust) {
          cust = {
            phone: customer.phone,
            name: customer.name,
            email: customer.email || '',
            addresses: []
          };
          customers.push(cust);
        } else {
          if (customer.name) cust.name = customer.name;
          if (customer.email) cust.email = customer.email;
        }

        if (fullAddress && !cust.addresses.includes(fullAddress)) {
          cust.addresses.push(fullAddress);
        }
        await saveCustomers(customers);
      } catch {}
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully! Receipt generated.',
        order: newOrder
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to process order';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
