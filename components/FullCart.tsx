import React from 'react';
import { View, StyleSheet, FlatList, Image, useColorScheme } from 'react-native';
import { Text, Button, IconButton, Divider } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';

const FullCart: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { cartItems, removeFromCart } = useCart();

  const totalAmount = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Koszyk</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: colors.background }]}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={[styles.productName, { color: colors.text }]}>{item.productName}</Text>
              <Text style={[styles.productPrice, { color: colors.text }]}>{item.price} zł x {item.quantity}</Text>
            </View>
            <IconButton
              icon="trash-can-outline"
              iconColor="red"
              size={24}
              onPress={() => removeFromCart(item.id)}
              style={styles.deleteButton}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
      <View style={styles.totalContainer}>
        <Text style={[styles.totalText, { color: colors.text }]}>Łączna kwota:</Text>
        <Text style={[styles.totalAmount, { color: colors.text }]}>{totalAmount} zł</Text>
      </View>
      <Button
        mode="contained"
        onPress={() => router.push('/delivery')}
        style={[styles.checkoutButton, { backgroundColor: colors.tint }]}
        labelStyle={{ color: colors.background }}
      >
        Przejdź do kasy
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 25,
    marginLeft: 5,
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 22,
    alignItems: 'center',
    minHeight: 100,
    position: 'relative',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    marginVertical: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  totalText: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    margin: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default FullCart;
