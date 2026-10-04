import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { KitchenHub } from '@/types/hub';
import {
  DEFAULT_KITCHEN_HUB,
  findNearestHub,
  matchAreaToHub,
  calculateHaversineDistance
} from '@/lib/kitchenHubs';

interface KitchenStoreState {
  selectedHub: KitchenHub;
  userCoords: { lat: number; lng: number } | null;
  userAddress: string | null;
  distanceKm: number | null;
  etaMinutes: number;
  isDetectingLocation: boolean;
  locationError: string | null;

  // Actions
  setSelectedHub: (hub: KitchenHub) => void;
  detectLocationViaGps: () => Promise<{ success: boolean; message: string }>;
  setManualArea: (area: string) => void;
}

export const useKitchenStore = create<KitchenStoreState>()(
  persist(
    (set, get) => ({
      selectedHub: DEFAULT_KITCHEN_HUB,
      userCoords: null,
      userAddress: null,
      distanceKm: 2.4, // standard default Indiranagar delivery radius
      etaMinutes: 25,
      isDetectingLocation: false,
      locationError: null,

      setSelectedHub: (hub: KitchenHub) => {
        const state = get();
        let dist = state.distanceKm ?? 2.4;
        let eta = hub.waitMinutes + 5;

        if (state.userCoords) {
          dist = calculateHaversineDistance(
            state.userCoords.lat,
            state.userCoords.lng,
            hub.coordinates.lat,
            hub.coordinates.lng
          );
          eta = hub.waitMinutes + Math.round(dist * 2.5);
        }

        set({
          selectedHub: hub,
          distanceKm: dist,
          etaMinutes: eta
        });
      },

      detectLocationViaGps: async () => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
          set({ locationError: 'Geolocation is not supported by your browser.' });
          return { success: false, message: 'Geolocation unsupported' };
        }

        set({ isDetectingLocation: true, locationError: null });

        return new Promise<{ success: boolean; message: string }>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              const result = findNearestHub(latitude, longitude);

              set({
                selectedHub: result.hub,
                userCoords: { lat: latitude, lng: longitude },
                userAddress: `${result.distanceKm} km from ${result.hub.area}`,
                distanceKm: result.distanceKm,
                etaMinutes: result.etaMinutes,
                isDetectingLocation: false,
                locationError: null
              });

              resolve({
                success: true,
                message: `Routed to closest kitchen: ${result.hub.name} (${result.distanceKm} km away)`
              });
            },
            (err) => {
              // On GPS denial or timeout, keep existing hub
              set({
                isDetectingLocation: false,
                locationError: err.message || 'Location permission denied'
              });
              resolve({
                success: false,
                message: 'Location access denied. Using Indiranagar Flagship Kitchen.'
              });
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
          );
        });
      },

      setManualArea: (area: string) => {
        const matchedHub = matchAreaToHub(area);
        set({
          selectedHub: matchedHub,
          userAddress: area,
          distanceKm: 3.2,
          etaMinutes: matchedHub.waitMinutes + 8
        });
      }
    }),
    {
      name: 'currycraft-kitchen-hub',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedHub: state.selectedHub,
        distanceKm: state.distanceKm,
        etaMinutes: state.etaMinutes,
        userAddress: state.userAddress
      })
    }
  )
);
