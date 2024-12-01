import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  useColorScheme,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useCart } from "@/context/CartContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Opinion from "@/components/Opinion";

interface Comment {
  id: number;
  rating: number;
  description: string;
  username: string;
}

const ProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(true);
 
  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await fetch(`http:///192.168.100.9:8082/api/comments/product/${id}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http:///192.168.100.9:8082/api/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
      fetchComments();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      Alert.alert("Sukces", "Produkt dodany do koszyka!");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starRating = index + 1;
      const starColor = "#FFD700";

      if (rating >= starRating) {
        return (
          <MaterialCommunityIcons
            key={index}
            name="star"
            size={24}
            color={starColor}
          />
        );
      }
      if (rating >= starRating - 0.5) {
        return (
          <MaterialCommunityIcons
            key={index}
            name="star-half-full"
            size={24}
            color={starColor}
          />
        );
      }
      return (
        <MaterialCommunityIcons
          key={index}
          name="star-outline"
          size={24}
          color={starColor}
        />
      );
    });
  };

  const formatDescription = (description: string) => {
    const cleanedDescription = description.replace(/\\r\\n|\\n/g, "\n");
    const lines = cleanedDescription.split("\n");

    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      const colonIndex = trimmedLine.indexOf(":");
      if (colonIndex !== -1) {
        const beforeColon = trimmedLine.substring(0, colonIndex + 1);
        const afterColon = trimmedLine.substring(colonIndex + 1).trim();

        return (
          <View key={index} style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={{ fontWeight: "bold", color: "#000" }}>{beforeColon} </Text>
            <Text style={{ color: "#666" }}>{afterColon}</Text>
          </View>
        );
      }

      return (
        <Text key={index} style={{ marginBottom: 8, color: "#666" }}>
          {trimmedLine}
        </Text>
      );
    });
  };

  const calculateAverageRating = (comments: Comment[]) => {
    if (comments.length === 0) return 0;
    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    return totalRating / comments.length;
  };

  const averageRating = calculateAverageRating(comments);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={{ color: colors.text }}>Ładowanie produktu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.text }}>{error}</Text>
        <Button onPress={() => router.back()}>Powrót</Button>
      </View>
    );
  }

  if (!product) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.text }}>Produkt nie znaleziony</Text>
        <Button onPress={() => router.back()}>Powrót</Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Image
        source={{ uri: product.image }}
        style={{ width: "100%", height: 300, borderRadius: 8, marginBottom: 16 }}
        resizeMode="contain"
      />

      {/* Nazwa produktu */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: colors.text,
          marginBottom: 8,
        }}
      >
        {product.productName}
      </Text>

      {/* Gwiazdki i liczba ocen */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <View style={{ flexDirection: "row", marginRight: 8 }}>
          {renderStars(averageRating)}
        </View>
        <Text style={{ fontSize: 16, color: colors.text }}>
          {comments.length} ocen
        </Text>
      </View>

      {/* Cena */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: colors.text,
          marginBottom: 16,
        }}
      >
        Cena: {product.price} zł
      </Text>
      <Button
        mode="contained"
        onPress={handleAddToCart}
        style={{ marginBottom: 16, backgroundColor: colors.tint }}
        labelStyle={{ color: colors.background, fontWeight: "bold" }}
        icon="cart"
      >
        Dodaj do koszyka
      </Button>

      <View style={{ marginBottom: 24 }}>{formatDescription(product.description)}</View>

      {/* Include the Opinion component and pass fetchComments */}
      <Opinion productId={id} onOpinionAdded={fetchComments} />

      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: colors.text,
          marginBottom: 16,
        }}
      >
        Opinie:
      </Text>
      {commentsLoading ? (
        <ActivityIndicator size="small" color={colors.tint} />
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <View
            key={comment.id}
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 8,
              backgroundColor: colors.cardbackground,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: "bold" }}>
              {comment.username}
            </Text>
            <View style={{ flexDirection: "row", marginVertical: 8 }}>
              {renderStars(comment.rating)}
            </View>
            <Text style={{ color: colors.text }}>{comment.description}</Text>
          </View>
        ))
      ) : (
        <Text style={{ color: colors.text }}>Brak opinii dla tego produktu.</Text>
      )}
    </ScrollView>
  );
};

export default ProductScreen;
