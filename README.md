# 🍔 Burgers That Love the Earth — Food Website & Multi-Portal Ordering Platform

A modern, responsive, and appetizing food restaurant platform built with pure HTML5, CSS3, modern Vanilla JavaScript, and Vercel Serverless Functions.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBrintaDeb%2Ffood-website)

---

## ✨ Highlights & Features

- **Storefront & Menu Experience (`index.html`)**:
  - Dynamic hero section with floating rating card and double burger platter presentation.
  - Hot items interactive carousel with touch swipe gestures and instant add-to-bag actions.
  - Slide-out cart drawer with live subtotal, discount promo code (`EARTH50`), and GST calculations.
  - Checkout modal with address and contact fields generating digital receipts with order IDs (`BGR-XXXXX`).
  - Real-time search modal and culinary demo modal.
- **Customer Portal (`customer.html`)**:
  - Browse menu categories (Burgers, Platters, Combos).
  - Live order tracking with 4-stage visual progress tracker (Confirmed ➔ Preparing ➔ Out for Delivery ➔ Delivered).
  - Phone number lookup for quick re-ordering and order history.
  - Address book management for fast checkout.
- **Admin Kitchen & Analytics Dashboard (`admin.html`)**:
  - Live order dispatcher with 1-click status advancement (Confirmed, Preparing, Out for Delivery, Delivered).
  - Menu manager: create, update, price, and delete burgers with real-time stock toggling.
  - KPI cards: Total Revenue, Today's Sales, Active Orders, and Deliveries.
- **Vercel Serverless Architecture (`api/index.js`)**:
  - Zero-cold-start REST API endpoints for `/api/menu`, `/api/orders`, `/api/customer/*`, and `/api/admin/*`.
  - Global Edge CDN delivery for static assets with clean URLs (`cleanUrls: true`).
  - Resilient storage abstraction with seed fallbacks and non-blocking in-memory persistence.

---

## 🚀 Live Deployment on Vercel

This repository is pre-configured with [`vercel.json`](./vercel.json) and [`api/index.js`](./api/index.js) for instant deployment on Vercel.

### Option 1: 1-Click Dashboard Deployment (Recommended)

1. Click the **Deploy with Vercel** button above or navigate to:
   **[https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBrintaDeb%2Ffood-website](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBrintaDeb%2Ffood-website)**
2. Select your GitHub account and import the repository.
3. Keep the default settings (Framework Preset: **Other**, Root Directory: `./`).
4. Click **Deploy**. Vercel will build and deploy both your static pages and serverless API in seconds with free SSL!

### Option 2: Deploy Using Vercel CLI

If you prefer deploying directly from your terminal:

```bash
# 1. Install Vercel CLI globally (if not already installed)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod
```

---

## 💻 Local Development

Run the full platform locally with the built-in Node.js server:

```bash
# Start server (runs storefront, customer portal, admin dashboard & API)
npm start
# or: node server.js
```

Then visit:

- **Storefront**: `http://localhost:3000/`
- **Customer Portal**: `http://localhost:3000/customer.html`
- **Admin Dashboard**: `http://localhost:3000/admin.html`
- **API Health Check**: `http://localhost:3000/api/health`

---

## 📁 Project Structure

```
food-website/
├── vercel.json              # Vercel configuration (clean URLs, rewrites & headers)
├── package.json             # ES module configuration and npm scripts
├── README.md                # Project documentation & deployment guide
├── .gitignore               # Git ignore rules (includes .vercel/ and node_modules/)
├── index.html               # Main storefront and ordering experience
├── customer.html            # Customer order tracking & profile portal
├── admin.html               # Kitchen management & analytics dashboard
├── server.js                # Standalone Node.js server for local development
├── api/
│   └── index.js             # Vercel Serverless Function handling all /api/* routes
├── data/
│   ├── menu.json            # Initial burger menu seed data
│   ├── orders.json          # Initial orders data
│   └── customers.json       # Customer profiles seed data
├── css/
│   ├── style.css            # Storefront styles and animations
│   ├── customer.css         # Customer portal styling
│   └── admin.css            # Admin dashboard styling
├── js/
│   ├── app.js               # Storefront cart, carousels, search & checkout
│   ├── customer.js          # Customer tracking & lookup interactions
│   └── admin.js             # Kitchen dispatch & menu management logic
└── images/                  # Burger photography and web asset graphics
```

---

## 📄 License

MIT © [BrintaDeb](https://github.com/BrintaDeb)
