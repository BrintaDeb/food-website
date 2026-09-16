/**
 * BURGERS THAT LOVE THE EARTH — VERCEL SERVERLESS API HANDLER
 * Handles: /api/health, /api/menu, /api/orders, /api/customer, /api/admin
 */

import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// -------------------------------------------------------------
// Seed Fallback Data (ensures zero-crash instant startup on Vercel)
// -------------------------------------------------------------
const DEFAULT_MENU = [
  {
    id: 'veg-crispy',
    name: 'Veg Crispy Burger',
    category: 'Burgers',
    price: 250,
    image: 'images/burger-1.png',
    description:
      'Crisp golden veggie patty layered with fresh lettuce, garden tomatoes, and melted American cheese.',
    inStock: true,
    prepTime: '15 mins'
  },
  {
    id: 'hot-crispy',
    name: 'Hot Crispy Burger',
    category: 'Burgers',
    price: 250,
    image: 'images/burger-2.png',
    description:
      'Spicy seasoned smash patty infused with jalapeños, chili flakes, and zesty cheddar melt.',
    inStock: true,
    prepTime: '15 mins'
  },
  {
    id: 'veg-vegy',
    name: 'Veg Vegy Burger',
    category: 'Burgers',
    price: 250,
    image: 'images/burger-3.png',
    description:
      'Double stacked garden delight featuring fresh crisp cucumbers, pickles, cheddar, and chef secret sauce.',
    inStock: true,
    prepTime: '18 mins'
  },
  {
    id: 'veg-crispy-classic',
    name: 'Veg Crispy Classic',
    category: 'Burgers',
    price: 250,
    image: 'images/burger-4.png',
    description:
      'The beloved classic with double toasted sesame bun, sliced gherkins, and golden cheese.',
    inStock: true,
    prepTime: '12 mins'
  },
  {
    id: 'earth-double',
    name: 'Earth Lover Double Platter',
    category: 'Platters',
    price: 499,
    image: 'images/hero-burgers.png',
    description:
      'Signature eco-friendly double burgers served on artisanal wooden board with herb fries.',
    inStock: true,
    prepTime: '22 mins'
  },
  {
    id: 'promo-combo',
    name: 'Two Order Meal Combo',
    category: 'Combos',
    price: 399,
    image: 'images/promo-combo.png',
    description:
      '2 gourmet burgers, crispy golden french fries bowl, and cold organic soda beverage.',
    inStock: true,
    prepTime: '20 mins'
  }
];

const DEFAULT_ORDERS = [
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
        id: 'earth-double',
        name: 'Earth Lover Double Platter',
        price: 499,
        quantity: 1,
        image: 'images/burger-1.png',
        lineTotal: 499
      },
      {
        id: 'veg-vegy',
        name: 'Veg Vegy Burger',
        price: 250,
        quantity: 1,
        image: 'images/burger-1.png',
        lineTotal: 250
      }
    ],
    pricing: {
      itemsSubtotal: 749,
      discount: 374.5,
      discountLabel: '50% Promo Special (EARTH50)',
      taxableAmount: 374.5,
      gst: 18.73,
      deliveryFee: 0,
      grandTotal: 393.23
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
        id: 'promo-combo',
        name: 'Two Order Meal Combo',
        price: 399,
        quantity: 1,
        image: 'images/promo-combo.png',
        lineTotal: 399
      }
    ],
    pricing: {
      itemsSubtotal: 399,
      discount: 50,
      discountLabel: 'Combo Special Discount',
      taxableAmount: 349,
      gst: 17.45,
      deliveryFee: 30,
      grandTotal: 396.45
    }
  }
];

const DEFAULT_CUSTOMERS = [
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

// In-Memory Storage Cache (persists during Lambda/Serverless warm instance lifecycle)
let memoryStore = {
  menu: null,
  orders: null,
  customers: null
};

// Storage Paths
const PRIMARY_DATA_DIR = path.join(process.cwd(), 'data');
const TMP_DATA_DIR = path.join(os.tmpdir(), 'food-website-data');

async function readFileWithFallback(filename, defaultData) {
  // 1. Check in-memory store
  const storeKey = filename.replace('.json', '');
  if (memoryStore[storeKey] && memoryStore[storeKey].length > 0) {
    return memoryStore[storeKey];
  }

  // 2. Check /tmp file
  const tmpPath = path.join(TMP_DATA_DIR, filename);
  try {
    if (existsSync(tmpPath)) {
      const content = await fs.readFile(tmpPath, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        memoryStore[storeKey] = parsed;
        return parsed;
      }
    }
  } catch {}

  // 3. Check primary repository data/ directory
  const primaryPath = path.join(PRIMARY_DATA_DIR, filename);
  try {
    if (existsSync(primaryPath)) {
      const content = await fs.readFile(primaryPath, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        memoryStore[storeKey] = parsed;
        return parsed;
      }
    }
  } catch {}

  // 4. Return default seed clone
  memoryStore[storeKey] = JSON.parse(JSON.stringify(defaultData));
  return memoryStore[storeKey];
}

async function writeFileWithFallback(filename, data) {
  const storeKey = filename.replace('.json', '');
  memoryStore[storeKey] = data;

  const jsonString = JSON.stringify(data, null, 2);

  // Attempt writing to primary repository directory (local development)
  let wrotePrimary = false;
  try {
    await fs.mkdir(PRIMARY_DATA_DIR, { recursive: true });
    await fs.writeFile(path.join(PRIMARY_DATA_DIR, filename), jsonString, 'utf8');
    wrotePrimary = true;
  } catch {}

  // Attempt writing to /tmp directory (writable in serverless AWS Lambda / Vercel)
  try {
    await fs.mkdir(TMP_DATA_DIR, { recursive: true });
    await fs.writeFile(path.join(TMP_DATA_DIR, filename), jsonString, 'utf8');
  } catch {}
}

const getMenu = () => readFileWithFallback('menu.json', DEFAULT_MENU);
const saveMenu = (data) => writeFileWithFallback('menu.json', data);

const getOrders = () => readFileWithFallback('orders.json', DEFAULT_ORDERS);
const saveOrders = (data) => writeFileWithFallback('orders.json', data);

const getCustomers = () => readFileWithFallback('customers.json', DEFAULT_CUSTOMERS);
const saveCustomers = (data) => writeFileWithFallback('customers.json', data);

// Request body parser (handles both Vercel pre-parsed bodies and streaming Node requests)
async function parseRequestBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }

  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 2e6) {
        req.destroy();
        reject(new Error('Request payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

// JSON response sender with CORS headers
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store, no-cache, must-revalidate'
  });
  res.end(JSON.stringify(data, null, 2));
}

// -------------------------------------------------------------
// VERCEL SERVERLESS ENTRYPOINT
// -------------------------------------------------------------
export default async function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const host = req.headers.host || 'localhost';
  const parsedUrl = new URL(req.url, `http://${host}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);
  const searchParams = parsedUrl.searchParams;

  // -----------------------------------------------------------
  // 1. HEALTH CHECK
  // -----------------------------------------------------------
  if (req.method === 'GET' && (pathname === '/api/health' || pathname === '/api')) {
    return sendJSON(res, 200, {
      status: 'ok',
      platform: 'Vercel Serverless',
      service: 'Burgers That Love the Earth API',
      timestamp: new Date().toISOString()
    });
  }

  // -----------------------------------------------------------
  // 2. MENU API
  // -----------------------------------------------------------
  if (pathname === '/api/menu' || pathname === '/api/menu/') {
    if (req.method === 'GET') {
      const menu = await getMenu();
      const category = searchParams.get('category') || req.query?.category;
      const inStockOnly = (searchParams.get('inStock') || req.query?.inStock) === 'true';

      let filtered = menu;
      if (category && category !== 'All') {
        filtered = filtered.filter(
          (item) => (item.category || '').toLowerCase() === category.toLowerCase()
        );
      }
      if (inStockOnly) {
        filtered = filtered.filter((item) => item.inStock !== false);
      }
      return sendJSON(res, 200, { success: true, count: filtered.length, items: filtered });
    }

    if (req.method === 'POST') {
      try {
        const payload = await parseRequestBody(req);
        if (!payload.name || !payload.price) {
          return sendJSON(res, 400, {
            success: false,
            message: 'Item name and price are required.'
          });
        }

        const menu = await getMenu();
        const id =
          payload.id ||
          payload.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') ||
          `item-${Date.now()}`;

        const newItem = {
          id,
          name: payload.name.trim(),
          category: payload.category || 'Burgers',
          price: parseFloat(payload.price) || 0,
          image: payload.image || 'images/burger-1.png',
          description: payload.description || '',
          inStock: payload.inStock !== false,
          prepTime: payload.prepTime || '15 mins'
        };

        menu.push(newItem);
        await saveMenu(menu);
        return sendJSON(res, 201, {
          success: true,
          message: 'Menu item created successfully',
          item: newItem
        });
      } catch (err) {
        return sendJSON(res, 500, { success: false, message: err.message });
      }
    }
  }

  // PUT /api/menu/:id
  if (req.method === 'PUT' && pathname.startsWith('/api/menu/')) {
    try {
      const id = pathname.replace('/api/menu/', '').trim();
      const payload = await parseRequestBody(req);
      const menu = await getMenu();
      const index = menu.findIndex((it) => it.id === id);

      if (index === -1) {
        return sendJSON(res, 404, {
          success: false,
          message: `Menu item with id "${id}" not found.`
        });
      }

      menu[index] = {
        ...menu[index],
        ...payload,
        id
      };

      await saveMenu(menu);
      return sendJSON(res, 200, { success: true, message: 'Menu item updated', item: menu[index] });
    } catch (err) {
      return sendJSON(res, 500, { success: false, message: err.message });
    }
  }

  // DELETE /api/menu/:id
  if (req.method === 'DELETE' && pathname.startsWith('/api/menu/')) {
    const id = pathname.replace('/api/menu/', '').trim();
    const menu = await getMenu();
    const index = menu.findIndex((it) => it.id === id);

    if (index === -1) {
      return sendJSON(res, 404, { success: false, message: `Menu item "${id}" not found.` });
    }

    const removed = menu.splice(index, 1)[0];
    await saveMenu(menu);
    return sendJSON(res, 200, {
      success: true,
      message: `Item "${removed.name}" removed from menu.`
    });
  }

  // -----------------------------------------------------------
  // 3. ORDERS API
  // -----------------------------------------------------------
  if (pathname === '/api/orders' || pathname === '/api/orders/') {
    // GET /api/orders
    if (req.method === 'GET') {
      const orders = await getOrders();
      const status = searchParams.get('status') || req.query?.status;
      const phone = searchParams.get('phone') || req.query?.phone;
      const search = searchParams.get('search') || req.query?.search;

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

      return sendJSON(res, 200, { success: true, count: result.length, orders: result });
    }

    // POST /api/orders
    if (req.method === 'POST') {
      try {
        const payload = await parseRequestBody(req);
        const { customer = {}, items = [], promoCode = '' } = payload;

        if (!customer.name || customer.name.trim().length < 2) {
          return sendJSON(res, 400, {
            success: false,
            message: 'Please provide customer full name.'
          });
        }
        const rawPhone = (customer.phone || '').replace(/\D/g, '');
        if (rawPhone.length < 10) {
          return sendJSON(res, 400, {
            success: false,
            message: 'Please enter a valid 10-digit mobile number.'
          });
        }
        if (!Array.isArray(items) || items.length === 0) {
          return sendJSON(res, 400, {
            success: false,
            message: 'Cart is empty. Please select burgers to order.'
          });
        }

        // Address formatting
        const addrDetails = customer.addressDetails || {};
        const flat = (customer.flat || addrDetails.flat || '').trim();
        const street = (customer.street || addrDetails.street || '').trim();
        const landmark = (customer.landmark || addrDetails.landmark || '').trim();
        const city = (customer.city || addrDetails.city || 'Bengaluru').trim();
        const pincode = (customer.pincode || addrDetails.pincode || '').trim();

        let fullAddress = customer.address || '';
        if (flat || street || city) {
          const parts = [
            flat ? `Flat/House: ${flat}` : '',
            street ? `Street/Building: ${street}` : '',
            landmark ? `Landmark: ${landmark}` : '',
            city ? city : '',
            pincode ? `PIN: ${pincode}` : ''
          ].filter(Boolean);
          fullAddress = parts.join(', ');
        }

        if (!fullAddress && (customer.deliveryType || 'Home Delivery') === 'Home Delivery') {
          return sendJSON(res, 400, {
            success: false,
            message: 'Please provide delivery address details.'
          });
        }

        // Calculations
        let itemsSubtotal = 0;
        const formattedItems = items.map((it) => {
          const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
          const price = Math.max(0, parseFloat(it.price) || 0);
          const lineTotal = +(price * qty).toFixed(2);
          itemsSubtotal += lineTotal;
          return {
            id: it.id,
            name: it.name,
            price,
            quantity: qty,
            image: it.image || 'images/burger-1.png',
            lineTotal
          };
        });

        itemsSubtotal = +itemsSubtotal.toFixed(2);

        // Discount calculation
        let discount = 0;
        let discountLabel = '';
        if (promoCode && promoCode.toUpperCase() === 'EARTH50') {
          discount = +(itemsSubtotal * 0.5).toFixed(2);
          discountLabel = '50% Promo Special (EARTH50)';
        } else if (items.some((it) => it.id === 'promo-combo')) {
          discount = 50.0;
          discountLabel = 'Combo Special Discount';
        }

        const taxableAmount = Math.max(0, itemsSubtotal - discount);
        const gst = +(taxableAmount * 0.05).toFixed(2); // 5% GST

        const deliveryType = customer.deliveryType || 'Home Delivery';
        let deliveryFee = 30.0;
        if (deliveryType === 'Takeaway' || deliveryType === 'Dine-in' || itemsSubtotal >= 500) {
          deliveryFee = 0.0;
        }

        const grandTotal = +(taxableAmount + gst + deliveryFee).toFixed(2);

        // Generate Order ID
        const orderNumber = Math.floor(10000 + Math.random() * 90000);
        const orderId = `BGR-${orderNumber}`;

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

        const newOrder = {
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
            deliveryType,
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

        // Update customer profile
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
            }
            if (fullAddress && !cust.addresses.includes(fullAddress)) {
              cust.addresses.push(fullAddress);
            }
            await saveCustomers(customers);
          } catch {}
        }

        return sendJSON(res, 201, {
          success: true,
          message: 'Order created successfully! Receipt generated.',
          order: newOrder
        });
      } catch (err) {
        return sendJSON(res, 500, {
          success: false,
          message: 'Failed to process order: ' + err.message
        });
      }
    }
  }

  // PATCH /api/orders/:id/status
  if (
    req.method === 'PATCH' &&
    pathname.startsWith('/api/orders/') &&
    pathname.endsWith('/status')
  ) {
    try {
      const orderId = pathname.replace('/api/orders/', '').replace('/status', '').trim();
      const payload = await parseRequestBody(req);
      const { status } = payload;

      if (!status) {
        return sendJSON(res, 400, { success: false, message: 'Status is required.' });
      }

      const orders = await getOrders();
      const order = orders.find(
        (o) => (o.orderId || '').toLowerCase() === orderId.toLowerCase() || o.id === orderId
      );

      if (!order) {
        return sendJSON(res, 404, { success: false, message: `Order #${orderId} not found.` });
      }

      order.status = status;
      const statusMap = {
        Confirmed: 1,
        Preparing: 2,
        'Out for Delivery': 3,
        Delivered: 4,
        Cancelled: 0
      };
      order.statusStep = statusMap[status] ?? 1;
      order.updatedAt = new Date().toISOString();

      await saveOrders(orders);
      return sendJSON(res, 200, {
        success: true,
        message: `Order #${order.orderId} status updated to ${status}.`,
        order
      });
    } catch (err) {
      return sendJSON(res, 500, { success: false, message: err.message });
    }
  }

  // GET /api/orders/:id
  if (req.method === 'GET' && pathname.startsWith('/api/orders/')) {
    const orderId = pathname.replace('/api/orders/', '').trim();
    const orders = await getOrders();
    const order = orders.find(
      (o) => (o.orderId || '').toLowerCase() === orderId.toLowerCase() || o.id === orderId
    );

    if (!order) {
      return sendJSON(res, 404, { success: false, message: `Order #${orderId} not found.` });
    }
    return sendJSON(res, 200, { success: true, order });
  }

  // DELETE /api/orders/:id
  if (req.method === 'DELETE' && pathname.startsWith('/api/orders/')) {
    const orderId = pathname.replace('/api/orders/', '').trim();
    const orders = await getOrders();
    const index = orders.findIndex(
      (o) => (o.orderId || '').toLowerCase() === orderId.toLowerCase() || o.id === orderId
    );

    if (index === -1) {
      return sendJSON(res, 404, { success: false, message: `Order #${orderId} not found.` });
    }

    const removed = orders.splice(index, 1)[0];
    await saveOrders(orders);
    return sendJSON(res, 200, { success: true, message: `Order #${removed.orderId} deleted.` });
  }

  // -----------------------------------------------------------
  // 4. CUSTOMER PORTAL API
  // -----------------------------------------------------------
  // GET /api/customer/orders?phone=...
  if (req.method === 'GET' && pathname === '/api/customer/orders') {
    const phoneParam = searchParams.get('phone') || req.query?.phone || '';
    const phone = phoneParam.replace(/\D/g, '');
    if (!phone || phone.length < 10) {
      return sendJSON(res, 400, {
        success: false,
        message: 'Please provide a valid 10-digit mobile number.'
      });
    }

    const orders = await getOrders();
    const customerOrders = orders.filter(
      (o) => (o.customer?.phone || '').replace(/\D/g, '') === phone
    );

    return sendJSON(res, 200, {
      success: true,
      phone,
      count: customerOrders.length,
      orders: customerOrders
    });
  }

  // GET /api/customer/profile?phone=...
  if (req.method === 'GET' && pathname === '/api/customer/profile') {
    const phoneParam = searchParams.get('phone') || req.query?.phone || '';
    const phone = phoneParam.replace(/\D/g, '');
    if (!phone) {
      return sendJSON(res, 400, { success: false, message: 'Phone number required.' });
    }

    const customers = await getCustomers();
    const cust = customers.find((c) => (c.phone || '').replace(/\D/g, '') === phone);

    if (!cust) {
      return sendJSON(res, 200, { success: true, exists: false, profile: null });
    }
    return sendJSON(res, 200, { success: true, exists: true, profile: cust });
  }

  // POST /api/customer/profile
  if (req.method === 'POST' && pathname === '/api/customer/profile') {
    try {
      const payload = await parseRequestBody(req);
      const { phone, name, email, addresses } = payload;

      if (!phone || phone.replace(/\D/g, '').length < 10) {
        return sendJSON(res, 400, {
          success: false,
          message: 'Valid 10-digit phone number is required.'
        });
      }

      const customers = await getCustomers();
      const cleanP = phone.replace(/\D/g, '');
      let cust = customers.find((c) => (c.phone || '').replace(/\D/g, '') === cleanP);

      if (!cust) {
        cust = { phone, name: name || '', email: email || '', addresses: addresses || [] };
        customers.push(cust);
      } else {
        if (name) cust.name = name;
        if (email) cust.email = email;
        if (Array.isArray(addresses)) cust.addresses = addresses;
      }

      await saveCustomers(customers);
      return sendJSON(res, 200, { success: true, message: 'Profile saved.', profile: cust });
    } catch (err) {
      return sendJSON(res, 500, { success: false, message: err.message });
    }
  }

  // -----------------------------------------------------------
  // 5. ADMIN ANALYTICS API
  // -----------------------------------------------------------
  if (req.method === 'GET' && pathname === '/api/admin/stats') {
    const orders = await getOrders();
    const menu = await getMenu();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);

    const todayStr = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    const todayOrders = orders.filter((o) => {
      try {
        return (
          new Date(o.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) ===
          todayStr
        );
      } catch {
        return false;
      }
    });

    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);

    const statusCounts = {
      confirmed: orders.filter((o) => o.status === 'Confirmed').length,
      preparing: orders.filter((o) => o.status === 'Preparing').length,
      outForDelivery: orders.filter((o) => o.status === 'Out for Delivery').length,
      delivered: orders.filter((o) => o.status === 'Delivered').length,
      cancelled: orders.filter((o) => o.status === 'Cancelled').length
    };

    const pendingOrders =
      statusCounts.confirmed + statusCounts.preparing + statusCounts.outForDelivery;

    return sendJSON(res, 200, {
      success: true,
      stats: {
        totalOrders,
        totalRevenue: +totalRevenue.toFixed(2),
        todayOrdersCount: todayOrders.length,
        todayRevenue: +todayRevenue.toFixed(2),
        pendingOrders,
        menuItemsCount: menu.length,
        statusCounts
      }
    });
  }

  // Fallback 404 for unrecognized API route
  return sendJSON(res, 404, {
    success: false,
    message: `API endpoint not found: ${req.method} ${pathname}`
  });
}
