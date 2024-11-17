import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmptyCart from '@/components/EmptyCart';
import FullCart from '@/components/FullCart';
import { Product } from '@/types/Product';
import { useCart } from '@/context/CartContext';

const CartScreen: React.FC = () => {
  const { cartItems } = useCart();

  return cartItems.length > 0 ? (
    <FullCart />
  ) : (
    <EmptyCart />
  );
};

export default CartScreen;
