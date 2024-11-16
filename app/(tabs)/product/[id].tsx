import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, useColorScheme, ActivityIndicator, ScrollView, Alert } from "react-native";
import { Text, Button, Divider, Card } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Product } from "@/types/Product";
import { useCart } from "@/context/CartContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const parseDescription = (description: string) => {
    // Usuń znaki "\n" i rozdziel na linie
    const lines = description.replace(/\\n/g, '\n').split('\n');
  
    // Przetwarzaj każdą linię, aby wyglądała jak "Klucz: Wartość"
    return lines.map((line, index) => {
      const [key, ...value] = line.split(':');
      if (value.length > 0) {
        return (
          <Text key={index} style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>{key.trim()}:</Text> {value.join(':').trim()}
          </Text>
        );
      }
      return (
        <Text key={index} style={{ marginBottom: 8 }}>
          {line.trim()}
        </Text>
      );
    });
  };
  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`http://192.168.1.100:8082/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch {
        Alert.alert("Error", "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://192.168.1.100:8082/api/comments/product/${id}`);
        const data = await response.json();
        setComments(data);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchProductData();
    fetchComments();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      Alert.alert("Success", "Produkt dodany do koszyka!");
    }
  };

  const renderStars = (rating: number) => (
    Array.from({ length: 5 }, (_, i) => (
      <MaterialCommunityIcons
        key={i}
        name={rating > i ? (rating >= i + 1 ? "star" : "star-half-full") : "star-outline"}
        size={18}
        color={colors.tint}
      />
    ))
  );

  const formatDescription = (description: string) =>
    description.replace(/\\r\\n/g, '\n').split('\n').map((line, i) => (
      <Text key={i} style={[styles.description, { color: colors.text }]}>
        {line.trim()}
      </Text>
    ));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ color: colors.text }}>Ładowanie produktu...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      {product && (
        <>
          <Text style={[styles.header, { color: colors.text }]}>{product.productName}</Text>
          <Divider style={styles.divider} />

          <Image source={{ uri: product.image }} style={styles.productImage} />

          <Text style={[styles.price, { color: colors.text }]}>Cena: {product.price} zł</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.starContainer}>{renderStars(product.rating)}</View>
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {product.comments.length} ocen
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={handleAddToCart}
            style={[styles.addToCartButton, { backgroundColor: colors.tint }]}
            labelStyle={{ color: colors.background }}
          >
            Dodaj do koszyka
          </Button>

          <View style={styles.descriptionContainer}>
            {parseDescription(product.description)}
          </View>

          <Text style={[styles.sectionHeader, { color: colors.text }]}>Opinie:</Text>
          {commentsLoading ? (
            <ActivityIndicator size="small" color={colors.tint} />
          ) : comments.length ? (
            comments.map((comment) => (
              <Card key={comment.id} style={styles.commentCard}>
                <Card.Content>
                  <Text style={[styles.commentUser, { color: colors.text }]}>{comment.user.username}</Text>
                  <View style={styles.starContainer}>{renderStars(comment.rating)}</View>
                  <Text style={[styles.commentText, { color: colors.text }]}>{comment.description}</Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={{ color: colors.text }}>Brak opinii dla tego produktu.</Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  divider: {
    marginVertical: 16,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 20,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  starContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  descriptionContainer: {
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  addToCartButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  commentCard: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentText: {
    fontSize: 16,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductScreen;
