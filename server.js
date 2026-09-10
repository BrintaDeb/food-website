/**
 * BURGERS THAT LOVE THE EARTH — ENHANCED BACKEND SERVER
 * Zero-Dependency Node.js HTTP Server & Full REST API
 * Supports: Storefront, Admin Panel & Customer Portal
 */

import http from 'node:http';
import fs from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// ==========================================
// STORAGE HELPERS
// ==========================================
async function initStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    if (!existsSync(ORDERS_FILE)) {
      await fs.writeFile(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8');
    }
    if (!existsSync(MENU_FILE)) {
      await fs.writeFile(MENU_FILE, JSON.stringify([], null, 2), 'utf8');
    }
    if (!existsSync(CUSTOMERS_FILE)) {
      await fs.writeFile(CUSTOMERS_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (err) {
    console.error('Storage init error:', err);
  }
}

async function getOrders() {
  try {
    const raw = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveOrders(orders) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

async function getMenu() {
  try {
    const raw = await fs.readFile(MENU_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveMenu(items) {
  await fs.writeFile(MENU_FILE, JSON.stringify(items, null, 2), 'utf8');
}

async function getCustomers() {
  try {
    const raw = await fs.readFile(CUSTOMERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveCustomers(customers) {
  await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), 'utf8');
}

// Request Body Parser
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 2e6) {
        // 2MB limit
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

// JSON response helper
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data, null, 2));
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);
  const searchParams = parsedUrl.searchParams;

  // ==========================================
  // REST API: HEALTH CHECK
  // ==========================================
  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJSON(res, 200, {
      status: 'ok',
      service: 'Burgers That Love the Earth Multi-Portal Server',
      timestamp: new Date().toISOString()
    });
  }

  // ==========================================
  // REST API: MENU MANAGEMENT
  // ==========================================

  // GET /api/menu — Fetch menu items
  if (req.method === 'GET' && pathname === '/api/menu') {
    const menu = await getMenu();
    const category = searchParams.get('category');
    const inStockOnly = searchParams.get('inStock') === 'true';

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

  // POST /api/menu — Add new menu item (Admin)
  if (req.method === 'POST' && pathname === '/api/menu') {
    try {
      const payload = await parseRequestBody(req);
      if (!payload.name || !payload.price) {
        return sendJSON(res, 400, { success: false, message: 'Item name and price are required.' });
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

  // PUT /api/menu/:id — Update menu item (Admin)
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
        id // preserve id
      };

      await saveMenu(menu);
      return sendJSON(res, 200, { success: true, message: 'Menu item updated', item: menu[index] });
    } catch (err) {
      return sendJSON(res, 500, { success: false, message: err.message });
    }
  }

  // DELETE /api/menu/:id — Delete menu item (Admin)
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

  // ==========================================
  // REST API: ORDERS & CHECKOUT
  // ==========================================

  // GET /api/orders — List orders (Admin & Customer)
  if (req.method === 'GET' && pathname === '/api/orders') {
    const orders = await getOrders();
    const status = searchParams.get('status');
    const phone = searchParams.get('phone');
    const search = searchParams.get('search');

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
          o.orderId.toLowerCase().includes(q) ||
          (o.customer?.name || '').toLowerCase().includes(q) ||
          (o.customer?.address || '').toLowerCase().includes(q)
      );
    }

    return sendJSON(res, 200, { success: true, count: result.length, orders: result });
  }

  // GET /api/orders/:id — Single order
  if (req.method === 'GET' && pathname.startsWith('/api/orders/')) {
    const orderId = pathname.replace('/api/orders/', '').trim();
    const orders = await getOrders();
    const order = orders.find(
      (o) => o.orderId.toLowerCase() === orderId.toLowerCase() || o.id === orderId
    );

    if (!order) {
      return sendJSON(res, 404, { success: false, message: `Order #${orderId} not found.` });
    }
    return sendJSON(res, 200, { success: true, order });
  }

  // PATCH /api/orders/:id/status — Update order status (Admin)
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
        (o) => o.orderId.toLowerCase() === orderId.toLowerCase() || o.id === orderId
      );

      if (!order) {
        return sendJSON(res, 404, { success: false, message: `Order #${orderId} not found.` });
      }

      order.status = status;
      // Step tracker mapping
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

  // DELETE /api/orders/:id — Delete order (Admin)
  if (req.method === 'DELETE' && pathname.startsWith('/api/orders/')) {
    const orderId = pathname.replace('/api/orders/', '').trim();
    const orders = await getOrders();
    const index = orders.findIndex(
      (o) => o.orderId.toLowerCase() === orderId.toLowerCase() || o.id === orderId
    );

    if (index === -1) {
      return sendJSON(res, 404, { success: false, message: `Order #${orderId} not found.` });
    }

    const removed = orders.splice(index, 1)[0];
    await saveOrders(orders);
    return sendJSON(res, 200, { success: true, message: `Order #${removed.orderId} deleted.` });
  }

  // POST /api/orders — Create order with full address & contact details
  if (req.method === 'POST' && pathname === '/api/orders') {
    try {
      const payload = await parseRequestBody(req);
      const { customer = {}, items = [], promoCode = '' } = payload;

      // Validation
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
          message: 'Cart is empty. Please select dishes to order.'
        });
      }

      // Construct formatted full address
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

      // Order ID
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

      const newOrder = {
        id: orderId,
        orderId,
        createdAt: now.toISOString(),
        formattedDate,
        formattedTime,
        status: 'Confirmed',
        statusStep: 1, // 1: Confirmed, 2: Preparing, 3: Out for Delivery, 4: Delivered
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

      // Save customer profile if requested or update customer profile
      if (customer.phone) {
        try {
          const customers = await getCustomers();
          const cleanP = customer.phone.replace(/\D/g, '');
          let cust = customers.find((c) => c.phone.replace(/\D/g, '') === cleanP);
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
      console.error('Order creation error:', err);
      return sendJSON(res, 500, {
        success: false,
        message: 'Failed to process order: ' + err.message
      });
    }
  }

  // ==========================================
  // REST API: CUSTOMER PORTAL
  // ==========================================

  // GET /api/customer/orders?phone=...
  if (req.method === 'GET' && pathname === '/api/customer/orders') {
    const phone = (searchParams.get('phone') || '').replace(/\D/g, '');
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
    const phone = (searchParams.get('phone') || '').replace(/\D/g, '');
    if (!phone) {
      return sendJSON(res, 400, { success: false, message: 'Phone number required.' });
    }

    const customers = await getCustomers();
    const cust = customers.find((c) => c.phone.replace(/\D/g, '') === phone);

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
      let cust = customers.find((c) => c.phone.replace(/\D/g, '') === cleanP);

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

  // ==========================================
  // REST API: ADMIN ANALYTICS & STATS
  // ==========================================
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

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    return res.end('Method Not Allowed');
  }

  let safePath = pathname === '/' ? '/index.html' : pathname;
  const normalized = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, normalized);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  try {
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      safePath = path.join(safePath, 'index.html');
    }

    const finalPath = stats.isDirectory() ? path.join(__dirname, safePath) : filePath;
    const ext = path.extname(finalPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const isDevAsset = ext === '.html' || ext === '.css' || ext === '.js';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': isDevAsset ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600'
    });

    if (req.method === 'HEAD') {
      return res.end();
    }

    const stream = createReadStream(finalPath);
    stream.pipe(res);
    stream.on('error', () => {
      if (!res.headersSent) res.writeHead(500);
      res.end();
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(
        '<h1>404 Not Found</h1><p>The requested page or asset could not be found.</p>'
      );
    }
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

// Boot up
await initStorage();
server.listen(PORT, () => {
  console.log(`🚀 Burgers That Love the Earth server running at http://localhost:${PORT}/`);
  console.log(`🛠️ Admin Dashboard: http://localhost:${PORT}/admin.html`);
  console.log(`👤 Customer Portal: http://localhost:${PORT}/customer.html`);
});
