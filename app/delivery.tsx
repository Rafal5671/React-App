import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import ShopsDelivery from '@/components/ShopsDelivery';
import DeliveryAddress from '@/components/DeliveryAddress'; // Import the DeliveryAddress component

const DeliveryScreen: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'shipping' | 'pickup'>('shipping');
  const [address, setAddress] = useState({ street: '', city: '', postalCode: '' });
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  const handleOptionChange = (option: 'shipping' | 'pickup') => {
    setSelectedOption(option);
  };

  const handleAddressChange = (newAddress: { street: string; city: string; postalCode: string }) => {
    setAddress(newAddress);
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

      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: themeColors.tint }]}
        onPress={() => {
          // Handle continue action with the selectedOption and address information
        }}
      >
        <Text style={[styles.continueButtonText, { color: themeColors.background }]}>
          Kontynuuj
        </Text>
      </TouchableOpacity>
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
