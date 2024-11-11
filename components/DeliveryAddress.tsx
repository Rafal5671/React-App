import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface DeliveryAddressProps {
  onAddressChange: (address: { street: string; city: string; postalCode: string }) => void;
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = ({ onAddressChange }) => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleStreetChange = (value: string) => {
    setStreet(value);
    onAddressChange({ street: value, city, postalCode });
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    onAddressChange({ street, city: value, postalCode });
  };

  const handlePostalCodeChange = (value: string) => {
    setPostalCode(value);
    onAddressChange({ street, city, postalCode: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ulica</Text>
      <TextInput
        style={styles.input}
        placeholder="Podaj ulicę"
        value={street}
        onChangeText={handleStreetChange}
      />
      <Text style={styles.label}>Miasto</Text>
      <TextInput
        style={styles.input}
        placeholder="Podaj miasto"
        value={city}
        onChangeText={handleCityChange}
      />
      <Text style={styles.label}>Kod pocztowy</Text>
      <TextInput
        style={styles.input}
        placeholder="Podaj kod pocztowy"
        value={postalCode}
        onChangeText={handlePostalCodeChange}
        keyboardType="numeric"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
});

export default DeliveryAddress;
