import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  useColorScheme,
} from "react-native";
import { Product } from "@/types/Product";
import { Colors } from "@/constants/Colors";
import ProductCard from "./ProductCard";
import {CONFIG} from "@/constants/config";
const ProductZone: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const colors = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http:///${CONFIG.serverIp}/api/products/dto`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products. Please check your network connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ color: colors.text }}>Ładowanie produktów...</Text>
      </View>
    );
  }

  // Filter products by rating for the "Polecamy" section
  const recommendedProducts = products.filter(
    (product) => product.rating > 4.0
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Bestsellery Section */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Bestsellery
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ScrollView>

      {/* Polecamy Section */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Polecamy
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 15,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cutPrice: {
    textDecorationLine: "line-through",
  },
});

export default ProductZone;
