# CurryCraft Mobile: React Native & Expo Implementation Plan

## 1. Executive Architecture & Confirmed Decisions

Based on user alignment via `/grill-me`, the mobile application architecture is configured with the following confirmed technical specifications:

1. **Backend Connectivity**:
   - **Local Development URL**: Dynamic resolution via `EXPO_PUBLIC_API_URL` defaulting to host Wi-Fi IP (`http://10.250.221.81:3000`), with automatic fallbacks for Android Emulator (`http://10.0.2.2:3000`) and iOS Simulator (`http://localhost:3000`).
   - **Production URL**: Configurable to live deployed API URL (e.g. Vercel).
2. **Live Telemetry & GPS Tracking**:
   - Streamed via **Server-Sent Events (SSE)** using the existing `/api/tracking/[orderId]` endpoint with native auto-reconnection and smooth bearing-angle marker interpolation.
3. **Customer Authentication Flow**:
   - **Phone Number / OTP** login flow, storing secure auth tokens and session data in `expo-secure-store`.
4. **Gesture Constraints (60fps UI Thread)**:
   - Drag-to-Cart uses `Gesture.Pan()` with `.activateAfterLongPress(200)` to ensure zero conflicts with vertical menu scrolling (`ScrollView` / `FlatList`).
   - Coordinates updated via Reanimated shared values on the UI thread (`useAnimatedStyle`), triggering `withSpring` elastic recoil on the floating cart dock.

```
+-----------------------------------------------------------------------------------------+
|                                CURRYCRAFT MOBILE CLIENT                                 |
|                                                                                         |
|  +------------------------+  +------------------------+  +---------------------------+  |
|  |      Expo Router       |  |       NativeWind       |  |  Reanimated & Gestures    |  |
|  |   File-based (Tabs/    |  |   Tailwind CSS Tokens  |  |  60fps UI Thread Worklet  |  |
|  |     Shared Stack)      |  |  Safe Areas & Theming  |  |  Drag-to-Cart & Shared UI |  |
|  +------------------------+  +------------------------+  +---------------------------+  |
|                                                                                         |
|  +------------------------+  +------------------------+  +---------------------------+  |
|  |      Zustand Store     |  |   TanStack React Query |  |     react-native-maps     |  |
|  |   Cart & Auth State    |  |   Offline Cache Layer  |  |  Smooth Rider Marker GPS  |  |
|  |  (MMKV / SecureStore)  |  |   Background Sync      |  |  Apple & Google Maps SDK  |  |
|  +------------------------+  +------------------------+  +---------------------------+  |
+-----------------------------------------------------------------------------------------+
                                         |
                                         |  HTTPS / SSE (http://10.250.221.81:3000)
                                         v
+-----------------------------------------------------------------------------------------+
|                                NEXT.JS BACKEND (API & DB)                               |
|   /api/menu  *  /api/orders  *  /api/tracking/[orderId]  *  /api/auth  *  data/db.ts    |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Project Directory Structure (`mobile/`)

The mobile application will be organized inside a `mobile/` directory within the existing repository to coexist cleanly alongside the Next.js web application while sharing types and assets.

```
mobile/
├── app/                                    # Expo Router file-based routing
│   ├── _layout.tsx                         # Root layout (QueryClient, AuthProvider, GestureHandlerRootView, Paper/Theme)
│   ├── (tabs)/                             # Bottom Tab Navigator
│   │   ├── _layout.tsx                     # Tab configuration & custom floating dock
│   │   ├── index.tsx                       # Home / Explore (Hero platter, Categories, Draggable Menu Grid)
│   │   ├── menu.tsx                        # Full Indian Cuisine Menu with filters & search
│   │   ├── orders.tsx                      # Order history & active tracking list
│   │   └── profile.tsx                     # Customer profile, saved addresses, preferences
│   ├── dish/
│   │   └── [id].tsx                        # Shared Element Transition dish details modal
│   ├── cart/
│   │   ├── index.tsx                       # Interactive Cart modal / screen
│   │   └── checkout.tsx                    # Native checkout form with address picker & payment
│   ├── tracking/
│   │   └── [orderId].tsx                   # Fullscreen Live Delivery Map (react-native-maps)
│   └── (auth)/
│       ├── login.tsx                       # Phone / Email OTP login
│       └── register.tsx                    # Customer registration & address onboarding
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx                  # Haptic-enabled primary/secondary buttons
│   │   │   ├── Card.tsx                    # Glassmorphic / clean elevated cards
│   │   │   ├── Header.tsx                  # Safe-area aware custom app header
│   │   │   └── Badge.tsx                   # Veg/Non-veg and spice indicator badges
│   │   ├── storefront/
│   │   │   ├── DraggableFoodCard.tsx       # Reanimated + GestureHandler Pan gesture card
│   │   │   ├── PersistentCartZone.tsx      # Target landing dock with elastic spring physics
│   │   │   ├── CategoryPills.tsx           # Horizontal snap scroll filter list
│   │   │   └── HeroBanner.tsx              # Curved hero with authentic Indian culinary imagery
│   │   ├── tracking/
│   │   │   ├── DeliveryMapView.tsx         # Cross-platform map (Apple Maps / Google Maps)
│   │   │   ├── RiderMarker.tsx             # Animated motorcycle marker interpolating coordinates
│   │   │   ├── DeliveryStatusSheet.tsx     # BottomSheet showing driver details & ETA
│   │   │   └── RoutePolyline.tsx           # Route line from kitchen to doorstep
│   │   └── checkout/
│   │       ├── AddressSelector.tsx         # Saved addresses with GPS auto-locate
│   │       └── CouponInput.tsx             # ROYAL50 validation with haptic feedback
│   │
│   ├── hooks/
│   │   ├── useNativeDraggableCart.ts       # UI-thread Reanimated worklet for drag mechanics
│   │   ├── useLiveOrderTracking.ts         # SSE / WebSocket hook for delivery telemetry
│   │   ├── usePushNotifications.ts         # Expo Notifications listener & token registration
│   │   └── useHaptics.ts                   # Impact & notification feedback wrappers
│   │
│   ├── store/
│   │   ├── useCartStore.ts                 # Zustand cart state with item counting & discount logic
│   │   └── useAuthStore.ts                 # Auth state with expo-secure-store token hydration
│   │
│   ├── services/
│   │   ├── api.ts                          # Axios / Fetch client with dynamic base URL resolver
│   │   ├── menuService.ts                  # React Query hooks for fetching menu items
│   │   ├── orderService.ts                 # Checkout & order dispatch API calls
│   │   └── locationService.ts              # Expo Location background & foreground handlers
│   │
│   ├── types/                              # Shared / Native-specific TypeScript interfaces
│   │   ├── menu.ts                         # Mirrored from web: MenuItem, Category, etc.
│   │   ├── order.ts                        # Order, Customer, Pricing, Telemetry
│   │   └── navigation.ts                   # Expo Router typed routes
│   │
│   ├── constants/
│   │   ├── theme.ts                        # Colors (#FF5E00, #1A1311), font families, spacing
│   │   └── config.ts                       # API endpoints, fallback coordinates, timeout rules
│   │
│   └── utils/
│       ├── currency.ts                     # formatINR (₹) helper
│       ├── coordinates.ts                  # Bearing & Haversine distance calculator
│       └── storage.ts                      # SecureStore / MMKV adapter for Zustand
│
├── assets/                                 # App icons, splash screens, custom marker SVGs/PNGs
│   ├── icon.png                            # 1024x1024 App Store / Play Store icon
│   ├── splash.png                          # Native launch splash screen
│   ├── adaptive-icon.png                   # Android 13+ adaptive foreground
│   └── marker-scooter.png                  # High-DPI courier vehicle marker
│
├── app.json                                # Expo configuration (permissions, plugins, schemes)
├── eas.json                                # EAS build profiles (development, preview, production)
├── tailwind.config.js                      # NativeWind styling tokens
├── tsconfig.json                           # Strict TypeScript configuration
└── package.json
```

---

## 3. Required Native Libraries & Dependency Stack

| Category | Package Name | Purpose / Role |
| :--- | :--- | :--- |
| **Core & Routing** | `expo` (~52.0.0)<br>`expo-router` (~4.0.0) | App runtime, native modules, file-based routing with deep linking |
| **Styling** | `nativewind` (^4.0.1)<br>`tailwindcss` (^3.4.0) | Tailwind CSS compile-time styling optimized for React Native |
| **Gestures & Motion** | `react-native-reanimated` (~3.16.0)<br>`react-native-gesture-handler` (~2.20.0) | 60fps UI-thread pan gesture for Drag-to-Cart & Shared Element Transitions |
| **Native Maps** | `react-native-maps` (^1.18.0) | Apple Maps (iOS MKMapView) & Google Maps (Android) with custom marker |
| **State & Cache** | `zustand` (^5.0.0)<br>`@tanstack/react-query` (^5.60.0)<br>`@react-native-async-storage/async-storage` | Global state + offline data query caching and revalidation |
| **Security & Auth** | `expo-secure-store` (~14.0.0)<br>`expo-crypto` (~14.0.0) | Encrypted keychain/keystore token storage for JWT sessions |
| **Notifications & Audio** | `expo-notifications` (~0.29.0)<br>`expo-haptics` (~14.0.0) | Push notification order status alerts & tactile drag/drop feedback |
| **Hardware & Location**| `expo-location` (~18.0.0) | Foreground device location for delivery address autofill & background GPS |
| **Build & Release** | `eas-cli`<br>`expo-updates` (~0.26.0) | Cloud binary builds, Over-the-Air runtime updates without store review |

---

## 4. Phase Breakdown & Implementation Steps

### Phase 1: Native Architecture & Routing
- Initialize the Expo Router template with TypeScript strict mode.
- Configure `NativeWind` v4 with Tailwind presets matching CurryCraft (`#FF5E00` brand orange, `#1A1311` dark graphite, `#FFFDF9` background).
- Build the persistent bottom navigation tabs with custom safe-area styling and dynamic badges.
- Implement the Zustand `useCartStore` with quantity management, `ROYAL50` coupon calculation, and persistence.

### Phase 2: Fluid Touch UI & Reanimated Gestures
- **Drag-to-Cart Worklet**: Build `DraggableFoodCard` with `Gesture.Pan()`:
  - Long-press activation to prevent conflict with vertical list scrolling.
  - Coordinate translation executed purely on the UI thread via `useAnimatedStyle`.
  - Hit-test detection against the persistent bottom cart zone.
  - Elastic spring bounce (`withSpring`) on the cart dock upon drop.
  - Smooth origin snapback with zero lingering transforms.
  - Haptic feedback (`Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)`) on successful drop.
- **Shared Element Transitions**: Smooth zoom transition from menu card to full dish detail modal.

### Phase 3: Live Delivery Tracking (Native Maps)
- Integrate `react-native-maps` with native platform providers:
  - iOS: Native Apple Maps.
  - Android: Google Maps SDK with custom map style JSON.
- Implement `RiderMarker` with smooth coordinate interpolation:
  - Use Reanimated `interpolate` or animated coordinates to smoothly glide the courier marker along the delivery route.
  - Rotate the marker in real time based on heading/bearing angle.
- Render dynamic route polylines and estimated arrival times inside an interactive bottom sheet.

### Phase 4: Backend API & Push Notification Integration
- Configure dynamic API base URL:
  - In development: resolves to local machine IP or tunnel.
  - In production: points to live production deployment.
- Integrate `@tanstack/react-query` for menu caching, enabling offline browsing of Indian dishes.
- Configure `expo-notifications` for real-time order pipeline alerts (`Confirmed` -> `Preparing` -> `Out for Delivery` -> `Delivered`).

### Phase 5: Production Builds & Deployment
- Configure `eas.json` for development, preview, and production profiles.
- Configure `expo-updates` channel for instant Over-The-Air bug fixes and menu adjustments.
- Complete `app.json` with permissions, splash screens, camera/location strings, and iOS/Android bundle identifiers ready for App Store and Google Play review.
