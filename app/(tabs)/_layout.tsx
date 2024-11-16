import { Tabs } from 'expo-router';
import React, { useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View } from 'react-native';
import { Badge } from 'react-native-paper';
import { useCart } from '@/context/CartContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { cartItems } = useCart();

  // Obliczenie liczby produktów w koszyku
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'search' : 'search'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <View style={{ position: 'relative' }}>
            <FontAwesome name="shopping-cart" size={28} color={color} />
            {cartCount > 0 && (
              <Badge
                size={18}
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: 'red',
                }}
              >
                {cartCount}
              </Badge>
            )}
          </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="product/[id]"
        options={{
          href: null, // To spowoduje, że zakładka nie pojawi się na pasku
        }}
      />
    </Tabs>
  );
}
