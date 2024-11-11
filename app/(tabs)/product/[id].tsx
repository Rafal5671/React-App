import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, useColorScheme, ActivityIndicator, ScrollView } from "react-native";
import { Text, Button, Divider } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Product } from "@/types/Product"; // Assuming the Product type is defined

const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`http://192.168.100.8:8082/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError("Failed to load product details. Please try again.");
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const [cartItems, setCartItems] = useState<string[]>([]);

  const addToCart = () => {
    if (product) {
      setCartItems([...cartItems, product.productName]);
      alert("Produkt dodany do koszyka!");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ color: colors.text }}>Ładowanie produktu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={{ color: colors.text }}>{error}</Text>
        <Button onPress={() => router.back()}>Powrót</Button>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={{ color: colors.text }}>Produkt nie znaleziony</Text>
        <Button onPress={() => router.back()}>Powrót</Button>
      </View>
    );
  }

  const formatDescription = (description: string) => {
    // Replace all occurrences of literal '\r\n' with actual line breaks '\n'
    const sanitizedDescription = description.replace(/\\r\\n/g, '\n');

    // Split the description into segments separated by '\n'
    const segments = sanitizedDescription.split('\n');

    // Map over each segment
    return segments.map((segment, index) => {
      // Trim the segment to remove any leading/trailing whitespace
      const trimmedSegment = segment.trim();

      // Check if the segment contains a ':'
      const colonIndex = trimmedSegment.indexOf(':');
      if (colonIndex !== -1) {
        // Split into before and after colon
        const beforeColon = trimmedSegment.substring(0, colonIndex + 1); // Include ':'
        const afterColon = trimmedSegment.substring(colonIndex + 1).trim();

        return (
          <Text key={index} style={[styles.description, { color: colors.text }]}>
            <Text>{beforeColon} </Text>
            <Text style={styles.boldText}>{afterColon}</Text>
            {'\n'}
          </Text>
        );
      } else {
        // No colon, render the segment as is
        return (
          <Text key={index} style={[styles.description, { color: colors.text }]}>
            {trimmedSegment}
            {'\n'}
          </Text>
        );
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      {/* Product Name */}
      <Text style={[styles.header, { color: colors.text }]}>{product.productName}</Text>
      <Divider />

      {/* Product Image */}
      <Image source={{ uri: product.image }} style={styles.productImage} />

      {/* Product Price */}
      <Text style={[styles.price, { color: colors.text }]}>Cena: {product.price} zł</Text>

      {/* Product Description */}
      <View style={styles.descriptionContainer}>
        {formatDescription(product.description)}
      </View>

      {/* Add to Cart Button */}
      <Button
        mode="contained"
        onPress={addToCart}
        style={[styles.addToCartButton, { backgroundColor: colors.tint }]}
        labelStyle={{ color: colors.background }}
      >
        Dodaj do koszyka
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40, // Add extra padding at the bottom for comfortable scrolling
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  productImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: "bold",
  },
  addToCartButton: {
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductScreen;
