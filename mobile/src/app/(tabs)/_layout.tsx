import React from 'react';
import { Tabs } from 'expo-router';
import { Home, UtensilsCrossed, Clock, User } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size - 2} color={color} />
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, size }) => <UtensilsCrossed size={size - 2} color={color} />
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => <Clock size={size - 2} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size - 2} color={color} />
        }}
      />
    </Tabs>
  );
}
