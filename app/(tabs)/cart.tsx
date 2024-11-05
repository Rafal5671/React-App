import React, { useState } from 'react';
import EmptyCart from '@/components/EmptyCart';
import FullCart from '@/components/FullCart';
const CartScreen: React.FC = () => {
  const [cartCount, setCartCount] = useState<number>(2);
  const removeFromCart = () => {
    setCartCount(prevCount => Math.max(prevCount - 1, 0)); // Ensure count does not go below 0
  };

  return (
    <>
      {cartCount > 0 ? (
        <FullCart removeFromCart={removeFromCart} />
      ) : (
        <EmptyCart />
      )}
    </>
  );
};

export default CartScreen;
