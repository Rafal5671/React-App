import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import ShopsDelivery from '@/components/ShopsDelivery';
import DeliveryAddress from '@/components/DeliveryAddress';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useStripe } from '@stripe/stripe-react-native';

interface Store {
  id: number;
  latitude: number;
  longitude: number;
  city: string;
  street: string;
  postalCode: string;
}

const DeliveryScreen: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'shipping' | 'pickup'>('shipping');
  const [address, setAddress] = useState<{ street: string; city: string; postalCode: string } | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  const { isLoggedIn, user, basketId, updateBasketId } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const router = useRouter();

  const basketTotalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleOptionChange = (option: 'shipping' | 'pickup') => {
    setSelectedOption(option);
    setAddress(null);
    setSelectedStore(null);
  };

  const handleAddressChange = (newAddress: { street: string; city: string; postalCode: string }) => {
    setAddress(newAddress);
  };

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setAddress({
      street: store.street,
      city: store.city,
      postalCode: store.postalCode,
    });
  };

  const handleSubmitOrder = async () => {
    if (!isLoggedIn || !user || !basketId) {
      Alert.alert('Błąd', 'Musisz być zalogowany, aby złożyć zamówienie.');
      return;
    }

    if (selectedOption === 'shipping' && (!address || !address.street || !address.city || !address.postalCode)) {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola adresu.');
      return;
    }

    if (selectedOption === 'pickup' && !selectedStore) {
      Alert.alert('Błąd', 'Proszę wybrać sklep z mapy.');
      return;
    }

    const deliveryType = selectedOption === 'shipping' ? 'DELIVERY' : 'SHOP';

    const orderDetails = {
      email: user.email,
      basketId: basketId,
      address: selectedOption === 'shipping' ? address : null,
      deliveryType: deliveryType,
      shopId: selectedOption === 'pickup' ? selectedStore?.id : null,
      products: cartItems.map((item) => ({ productId: item.id, quantity: item.quantity })),
    };

    try {
      const response = await fetch("http://192.168.1.100:8082/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails)

      });

      if (!response.ok) {
        throw new Error('Order creation failed');
      }

      clearCart();

      // Fetch the new basket ID
      const basketResponse = await fetch(`http://192.168.1.100:8082/api/basket/user/${user.id}`);
      const newBasket = await basketResponse.json();

      if (newBasket && newBasket.id) {
        updateBasketId(newBasket.id);
      }

      const paymentResponse = await fetch('http://192.168.100.8:8082/api/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: basketTotalPrice * 100, currency: 'pln' }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create Payment Intent');
      }

      const { clientSecret } = await paymentResponse.json();

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Your Merchant Name',
      });

      if (initError) {
        console.error('Error initializing payment sheet:', initError);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert('Błąd', `Błąd płatności: ${presentError.message}`);
      } else {
        Alert.alert('Sukces', 'Płatność zakończona powodzeniem!');
        router.push('/success'); // Navigate to success screen
      }
    } catch (error) {
      console.error('Error creating order or initiating payment:', error);
      Alert.alert('Błąd', 'Nie udało się złożyć zamówienia.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        {selectedOption === 'shipping' && <DeliveryAddress onAddressChange={handleAddressChange} />}
        {selectedOption === 'pickup' && <ShopsDelivery onStoreSelect={handleStoreSelect} />}

        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: themeColors.tint }]}
          onPress={handleSubmitOrder}
        >
          <Text style={[styles.continueButtonText, { color: themeColors.background }]}>
            Kontynuuj
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
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
