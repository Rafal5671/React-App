import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Badge } from 'react-native-paper';
import { useCart } from '@/context/CartContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Import icons
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { cartItems } = useCart();

  // Calculate cart item count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name={focused ? 'home' : 'home'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Szukaj',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="search" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Koszyk',
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
          title: 'Profil',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="result"
        options={{
          href:null,
        }}
      />
      <Tabs.Screen
        name="product/[id]"
        options={{
          href: null, // This prevents the tab from appearing in the tab bar
        }}
      />
      
    </Tabs>
  );
}
