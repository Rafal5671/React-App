import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  useColorScheme,
} from "react-native";
import { Card, Title, Text, Paragraph } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // For star ratings
import { Product } from "@/types/Product";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/product/${product.id}`);
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
            size={16}
            color={colors.tint}
          />
        );
      } else if (rating >= starRating - 0.5) {
        // Half star
        return (
          <MaterialCommunityIcons
            key={index}
            name="star-half-full"
            size={16}
            color={colors.tint}
          />
        );
      } else {
        // Empty star
        return (
          <MaterialCommunityIcons
            key={index}
            name="star-outline"
            size={16}
            color={colors.tint}
          />
        );
      }
    });
  };

  return (
    <TouchableOpacity onPress={handleProductClick}>
      <Card
        style={[styles.productCard, { backgroundColor: colors.cardbackground }]}
      >
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <Card.Content>
          <Title
            style={{ color: colors.text }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {product.productName}
          </Title>

          {/* Star Rating and Review Count */}
          <View style={styles.ratingContainer}>
            <View style={styles.starContainer}>{renderStars(product.rating)}</View>
            <Text style={[styles.ratingText, { color: colors.text }]}>
              ({product.reviewCount} ocen)
            </Text>
          </View>

          <Paragraph style={{ color: colors.text }}>
            {product.price} zł
          </Paragraph>
          {product.cutPrice && (
            <Paragraph style={[styles.cutPrice, { color: colors.icon }]}>
              {product.cutPrice} zł
            </Paragraph>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: 300,
    height: 370,
    marginRight: 12,
    borderRadius: 8,
    marginBottom: 16, // Add some margin at the bottom
  },
  productImage: {
    width: 300,
    height: 250,
    borderRadius: 8,
  },
  cutPrice: {
    textDecorationLine: "line-through",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  starContainer: {
    flexDirection: "row",
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default ProductCard;
