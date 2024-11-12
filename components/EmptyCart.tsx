import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const EmptyCart: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Koszyk</Text>
      <View style={styles.iconContainer}>
        <IconButton icon="cart-outline" size={64} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>Twój koszyk jest pusty</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>Szukasz inspiracji?</Text>
      <Button
        mode="contained"
        onPress={() => router.push('/search')}
        style={[styles.button, { backgroundColor: colors.tint }]}
        labelStyle={{ color: colors.background }}
      >
        Wybierz produkty dla siebie
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});

export default EmptyCart;
