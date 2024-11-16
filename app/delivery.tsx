import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import ShopsDelivery from '@/components/ShopsDelivery';
import DeliveryAddress from '@/components/DeliveryAddress';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const DeliveryScreen: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'shipping' | 'pickup'>('shipping');
  const [address, setAddress] = useState({ street: '', city: '', postalCode: '' });
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  // Include updateBasketId in the destructuring
  const { isLoggedIn, user, basketId, updateBasketId } = useAuth();
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  const handleOptionChange = (option: 'shipping' | 'pickup') => {
    setSelectedOption(option);
  };

  const handleAddressChange = (newAddress: { street: string; city: string; postalCode: string }) => {
    setAddress(newAddress);
  };

  const handleSubmitOrder = async () => {
    if (!isLoggedIn || !user || !basketId) {
      Alert.alert("Błąd", "Musisz być zalogowany, aby złożyć zamówienie.");
      return;
    }

    if (selectedOption === 'shipping' && (!address.street || !address.city || !address.postalCode)) {
      Alert.alert("Błąd", "Proszę wypełnić wszystkie pola adresu.");
      return;
    }

    const orderDetails = {
      email: user.email,
      basketId: basketId,
      address: selectedOption === 'shipping' ? address : null,
      products: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
    };

    try {
      const response = await fetch("http://192.168.100.9:8082/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails)
      });

      if (!response.ok) {
        throw new Error("Order creation failed");
      }

      Alert.alert("Sukces", "Zamówienie zostało pomyślnie złożone.");

      // Clear the cart after a successful order
      clearCart();

      // Fetch the new basket ID
      const basketResponse = await fetch(`http://192.168.100.9:8082/api/basket/user/${user.id}`);
      const newBasket = await basketResponse.json();

      if (newBasket && newBasket.id) {
        // Update the basket ID in the Auth context
        updateBasketId(newBasket.id);
      }

      router.push("/tabs/product/index");

    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Błąd", "Nie udało się złożyć zamówienia.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Wybierz opcję dostawy</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'shipping' && { borderColor: themeColors.tint },
          ]}
          onPress={() => handleOptionChange('shipping')}
        >
          <Text style={[styles.optionText, { color: themeColors.text }]}>Wysyłka</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'pickup' && { borderColor: themeColors.tint },
          ]}
          onPress={() => handleOptionChange('pickup')}
        >
          <Text style={[styles.optionText, { color: themeColors.text }]}>Odbiór w sklepie</Text>
        </TouchableOpacity>
      </View>

      {/* Render DeliveryAddress or ShopsDelivery based on the selected option */}
      {selectedOption === 'shipping' && <DeliveryAddress onAddressChange={handleAddressChange} />}
      {selectedOption === 'pickup' && <ShopsDelivery />}

      <Link href="/" style={styles.link}>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: themeColors.tint }]}
          onPress={handleSubmitOrder}
        >
          <Text style={[styles.continueButtonText, { color: themeColors.background }]}>
            Kontynuuj
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  optionButton: {
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
  },
  continueButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DeliveryScreen;
