import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS } from '@/constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  }
});

export default function RootLayout() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.cream },
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="cart"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }}
          />
          <Stack.Screen
            name="checkout"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }}
          />
          <Stack.Screen
            name="dish/[id]"
            options={{
              presentation: 'modal',
              animation: 'fade_from_bottom'
            }}
          />
          <Stack.Screen
            name="tracking/[orderId]"
            options={{
              presentation: 'card',
              animation: 'slide_from_right'
            }}
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
