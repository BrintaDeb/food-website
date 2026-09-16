# 🍛 CurryCraft — Royal Indian Cuisine & Dum Biryani Ordering System

A production-ready, full-stack food delivery and dining platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Leaflet GPS Live Telemetry**, **Zustand**, and **NextAuth**.

Accompanied by an **Expo React Native** mobile client (`mobile/`) sharing assets, schemas, and live tracking APIs.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBrintaDeb%2Ffood-website)

---

## ✨ System Architecture & Portals

### 1. 🛍️ Storefront Experience (`/`)

- **Hero & Cultural Presentation**: Royal dum handi visuals, floating rating badge (⭐ 4.9), and interactive chef spotlight.
- **Draggable Food Catalog**: GSAP Flip & HTML5 drag-and-drop support allowing guests to drag menu dishes directly into the bag.
- **Persistent Cart Drawer**: Real-time price breakdown with automatic promo discount calculation (`ROYAL50` for 50% off), GST calculations (5%), and free delivery threshold (₹500+).
- **Checkout & Digital Invoicing**: Modal validation with full Indian address details and instant printable/downloadable digital receipt.
- **Direct Live Tracking Link**: 1-click **"Track Order Live 🛵"** direct transition into real-time GPS telemetry from the receipt modal.

### 2. 👤 Customer Portal (`/portal`)

- **Browse Catalog**: Filter by category (Dum Biryani, Curries, Breads, Desserts & Beverages) with vegetarian and stock toggles.
- **Order History by Phone**: Instant phone-based order lookup displaying status timeline, itemized order breakdown, and digital receipts.
- **Saved Delivery Addresses**: Multi-address management for 1-click checkout.
- **Interactive Live Map Tracking (`/portal/track/[orderId]`)**: Real-time scooter navigation simulator through Bengaluru street coordinates with heading bearing angle and estimated delivery countdown.

### 3. 🛠️ Kitchen Dispatch & Admin Dashboard (`/admin`)

- **Executive Operations**: Protected by NextAuth credentials (`admin@currycraft.com`).
- **Real-Time Order Pipeline**: 1-click status progression (`Confirmed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered` / `Cancelled`).
- **Menu Management**: Create, edit, price, and toggle stock availability for dishes.
- **Analytics KPIs**: Today's revenue, active deliveries, and category performance.

### 4. 📱 Mobile Application (`mobile/`)

- Native **Expo React Native** client with file-based routing (`expo-router`), bottom tab navigation, gesture drag-to-cart worklets, and smooth marker animation for rider telemetry.

---

## 🚀 Deployment on Vercel

This repository is pre-configured with [`vercel.json`](./vercel.json) and [`next.config.mjs`](./next.config.mjs) for seamless, zero-config production deployment on Vercel.

### Option 1: 1-Click Dashboard Import (Recommended)

1. Click the **Deploy with Vercel** button above or go to [vercel.com/new](https://vercel.com/new).
2. Select your GitHub repository (`BrintaDeb/food-website`).
3. Vercel will automatically detect **Next.js**. Keep the default settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./`
   - **Build Command**: `next build`
4. Add the following **Environment Variables** in the Vercel project settings:
   | Variable          | Description                   | Example / Recommended Value       |
   | ----------------- | ----------------------------- | --------------------------------- |
   | `NEXTAUTH_URL`    | Your canonical deployment URL | `https://your-project.vercel.app` |
   | `NEXTAUTH_SECRET` | 32+ char secure secret string | `openssl rand -base64 32`         |
   | `ADMIN_EMAIL`     | Admin login email             | `admin@currycraft.com`            |
   | `ADMIN_PASSWORD`  | Admin login password          | `Admin@12345`                     |
5. Click **Deploy**. Vercel will build and deploy the Next.js App Router application in under a minute with global Edge CDN caching and free SSL!

### Option 2: Deploy via Vercel CLI

```bash
# 1. Install or update Vercel CLI
npm install -g vercel@latest

# 2. Authenticate
vercel login

# 3. Link and deploy to production
vercel --prod
```

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

### Available URLs:

- **Storefront**: [http://localhost:3000/](http://localhost:3000/)
- **Customer Portal**: [http://localhost:3000/portal](http://localhost:3000/portal)
- **Live GPS Tracking**: [http://localhost:3000/portal/track/BGR-66240](http://localhost:3000/portal/track/BGR-66240)
- **Admin Kitchen**: [http://localhost:3000/admin](http://localhost:3000/admin) _(Login: `admin@currycraft.com` / `Admin@12345`)_
- **Health Endpoint**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🧪 Quality Gates & Scripts

```bash
# Run TypeScript type safety verification
npm run typecheck

# Run ESLint across Next.js source code
npm run lint

# Check code formatting with Prettier
npm run format:check

# Auto-format all code
npm run format

# Test production build
npm run build

# Start production server locally
npm start

# Run legacy standalone static server (if needed)
npm run legacy:server
```

---

## 📁 Repository Structure

```
food-website/
├── vercel.json                 # Vercel deployment configuration (Next.js preset)
├── next.config.mjs             # Next.js config with security headers & image optimization
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript strict configuration
├── .env.example                # Documented production environment variables
├── public/
│   └── images/                 # Optimized photography of Indian dishes, riders & assets
├── data/
│   ├── menu.json               # Seed catalog (Dum Biryanis, Dal Sambar, Paneer, Naan)
│   ├── orders.json             # Seed orders & customer transaction history
│   └── customers.json          # Customer profiles and address book
├── src/
│   ├── app/                    # Next.js App Router (Storefront, Portal, Admin, APIs)
│   │   ├── (storefront)/       # Storefront pages & sections
│   │   ├── (customer)/         # Customer order portal & live GPS order tracking
│   │   ├── (admin)/            # Admin kitchen dispatch & analytics dashboard
│   │   └── api/                # Dynamic route handlers (/menu, /orders, /tracking, /health)
│   ├── components/             # Reusable UI, Storefront, Admin, Cart & Tracking components
│   ├── hooks/                  # Custom React hooks (useCart, useRiderSimulation, useGsapFlip)
│   ├── lib/                    # Storage layer (db.ts), auth.ts, validations.ts, utils.ts
│   ├── store/                  # Zustand cart store with persistent local storage
│   └── types/                  # TypeScript interface definitions
├── legacy/                     # Preserved legacy static site and server (npm run legacy:server)
└── mobile/                     # Expo React Native cross-platform mobile application
```

---

## 📄 License

MIT © [BrintaDeb](https://github.com/BrintaDeb)
