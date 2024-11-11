import React, { useState } from "react";
import { View, StyleSheet, Image, useColorScheme } from "react-native";
import { Text, Button, Divider } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

const products: Record<string, { name: string; price: string; description: string; image: string }> = {
  '1': {
    name: "ASUS ExpertBook B1502CVA i5-1335U/16GB/512/Win11P",
    price: "2 799,00 zł",
    description: "ASUS ExpertBook to nowoczesny laptop biznesowy wyposażony w procesor Intel i5 oraz 16 GB RAM.",
    image: "https://via.placeholder.com/300",
  },
  '2': {
    name: "Dell Vostro 3520 i5-1235U/16GB/512/Win11P",
    price: "2 599,00 zł",
    description: "Dell Vostro to niezawodny laptop biznesowy z procesorem Intel i5 i dyskiem SSD 512 GB.",
    image: "https://via.placeholder.com/300",
  },
};


const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  const product = id ? products[id] : null;

  const [cartItems, setCartItems] = useState<string[]>([]);

  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={{ color: colors.text }}>Produkt nie znaleziony</Text>
        <Button onPress={() => router.back()}>Powrót</Button>
      </View>
    );
  }

  const addToCart = () => {
    setCartItems([...cartItems, product.name]);
    alert("Produkt dodany do koszyka!");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Nazwa produktu */}
      <Text style={[styles.header, { color: colors.text }]}>
        {product.name}
      </Text>
      <Divider />

      {/* Zdjęcie produktu */}
      <Image source={{ uri: product.image }} style={styles.productImage} />

      {/* Cena produktu */}
      <Text style={[styles.price, { color: colors.text }]}>
        Cena: {product.price}
      </Text>

      {/* Opis produktu */}
      <Text style={[styles.description, { color: colors.text }]}>
        {product.description}
      </Text>

      {/* Przycisk dodania do koszyka */}
      <Button
        mode="contained"
        onPress={addToCart}
        style={[styles.addToCartButton, { backgroundColor: colors.tint }]}
        labelStyle={{ color: colors.background }}
      >
        Dodaj do koszyka
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
  },
  addToCartButton: {
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductScreen;
