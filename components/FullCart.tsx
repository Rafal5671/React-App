import React from 'react';
import { View, StyleSheet, FlatList, Image, useColorScheme, Alert } from 'react-native';
import { Text, IconButton, Divider, Button } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const FullCart: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { isLoggedIn } = useAuth();

  const totalAmount = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      Alert.alert(
        "Musisz być zalogowany",
        "Zaloguj się, aby kontynuować do kasy.",
        [{ text: "OK" }]
      );
      return;
    }
    router.push('/delivery');
  };

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
              <Text style={[styles.productPrice, { color: colors.text }]}>
                {item.price} zł x {item.quantity}
              </Text>
              <View style={styles.quantityContainer}>
                <IconButton
                  icon="minus-circle-outline"
                  iconColor={colors.tint}
                  size={24}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                />
                <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>
                <IconButton
                  icon="plus-circle-outline"
                  iconColor={colors.tint}
                  size={24}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                />
              </View>
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
        onPress={handleCheckout}
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
    padding: 16,
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 8,
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