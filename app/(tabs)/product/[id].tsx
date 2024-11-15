import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, useColorScheme, ActivityIndicator, ScrollView, Alert } from "react-native";
import { Text, Button, Divider } from "react-native-paper";
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(true);

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

    const fetchComments = async () => {
          try {
            const response = await fetch(`http://192.168.100.8:8082/api/comments/product/${id}`);

            if (!response.ok) {
              throw new Error("Failed to fetch comments");
            }
            const data = await response.json();
            setComments(data);
          } catch (error) {
            console.error("Error fetching comments:", error);
          } finally {
            setCommentsLoading(false);
          }
        };


    if (id) {
      fetchProductData();
      fetchComments();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1); // Pass product and quantity
      Alert.alert("Sukces", "Produkt dodany do koszyka!");
    }
  };

  // Function to render stars based on rating with half-star support
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starRating = index + 1;

      if (rating >= starRating) {
        // Full star
        return (
          <MaterialCommunityIcons
            key={index}
            name="star"
            size={18}
            color={colors.tint}
          />
        );
      } if (rating >= starRating - 0.5) {
        // Half star
        return (
          <MaterialCommunityIcons
            key={index}
            name="star-half-full"
            size={18}
            color={colors.tint}
          />
        );
      } else {
        // Empty star
        return (
          <MaterialCommunityIcons
            key={index}
            name="star-outline"
            size={18}
            color={colors.tint}
          />
        );
      }
    });
  };

  // Helper function to format the description
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

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      {/* Product Name */}
      <Text style={[styles.header, { color: colors.text }]}>{product.productName}</Text>
      <Divider />

      {/* Product Image */}
      <Image source={{ uri: product.image }} style={styles.productImage} />

      {/* Product Price */}
      <Text style={[styles.price, { color: colors.text }]}>Cena: {product.price} zł</Text>

     {/* Rating and Comment Count */}
      <View style={styles.ratingContainer}>
        <View style={styles.starContainer}>{renderStars(product.rating)}</View>
        <Text style={[styles.ratingText, { color: colors.text }]}>
          {product.comments.length} ocen
        </Text>
      </View>

       {/* Add to Cart Button */}
      <Button
        mode="contained"
        onPress={handleAddToCart} // Use handleAddToCart here
        style={[styles.addToCartButton, { backgroundColor: colors.tint }]}
        labelStyle={{ color: colors.background }}
      >
        Dodaj do koszyka
      </Button>

      {/* Product Description */}
      <View style={styles.descriptionContainer}>
        {formatDescription(product.description)}
      </View>

      {/* Comments Section */}
       <Text style={[styles.sectionHeader, { color: colors.text }]}>Opinie:</Text>
       {commentsLoading ? (
         <ActivityIndicator size="small" color={colors.tint} />
       ) : comments.length > 0 ? (
         comments.map((comment) => (
           <View key={comment.id} style={[styles.commentContainer, { backgroundColor: colors.cardbackground }]}>
             <Text style={[styles.commentUser, { color: colors.text }]}>{comment.user.username}</Text>
             <View style={styles.ratingContainer}>
               {renderStars(comment.rating)}
             </View>
             <Text style={[styles.commentText, { color: colors.text }]}>{comment.description}</Text>
           </View>
         ))
       ) : (
         <Text style={{ color: colors.text }}>Brak opinii dla tego produktu.</Text>
       )}



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
  ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    starContainer: {
      flexDirection: "row",
      marginRight: 8,
    },
    ratingText: {
      fontSize: 16,
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