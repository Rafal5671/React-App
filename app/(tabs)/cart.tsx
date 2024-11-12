import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmptyCart from '@/components/EmptyCart';
import FullCart from '@/components/FullCart';
import { Product } from '@/types/Product';

const CartScreen: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await AsyncStorage.getItem('cart');
        if (cartData) {
          setCartItems(JSON.parse(cartData));
        }
      } catch (error) {
        console.error("Error loading cart data:", error);
      }
    };

    loadCart();
  }, []);

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId);
      AsyncStorage.setItem('cart', JSON.stringify(updatedItems)); // Save the updated cart back to AsyncStorage
      return updatedItems;
    });
  };

  return cartItems.length > 0 ? (
    <FullCart cartItems={cartItems} removeFromCart={handleRemoveFromCart} />
  ) : (
    <EmptyCart />
  );
};

export default CartScreen;
