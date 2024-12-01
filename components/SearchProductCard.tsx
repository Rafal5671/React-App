import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    useColorScheme,
} from "react-native";
import { Card, Title, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Product } from "@/types/Product";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

interface ProductCardProps {
    product: Product;
}

const SearchProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? "light"];
    const router = useRouter();

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => {
            const starRating = index + 1;

            if (rating >= starRating) {
                return (
                    <MaterialCommunityIcons
                        key={index}
                        name="star"
                        size={16}
                        color={colors.tint}
                    />
                );
            } else if (rating >= starRating - 0.5) {
                return (
                    <MaterialCommunityIcons
                        key={index}
                        name="star-half-full"
                        size={16}
                        color={colors.tint}
                    />
                );
            } else {
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

    const handlePress = () => {
        router.push(`/product/${product.id}`);
    };

    return (
        <Card
            style={[
                styles.card,
                { backgroundColor: colors.cardbackground, shadowColor: colors.icon },
            ]}
        >
            <TouchableOpacity onPress={handlePress} style={styles.row}>
                {/* Obrazek produktu */}
                <Image
                    source={{
                        uri: product.image
                            ? product.image
                            : `https://via.placeholder.com/120x200?text=Brak+zdjęcia`,
                    }}
                    style={styles.image}
                />

                {/* Szczegóły produktu */}
                <Card.Content style={styles.content}>
                    <Title style={[styles.title, { color: colors.text }]}>
                        {product.productName || "Nieznany produkt"}
                    </Title>

                    {/* Sekcja ocen */}
                    <View style={styles.ratingContainer}>
                        {renderStars(product.rating || 0)}
                        <Text style={[styles.ratingText, { color: colors.icon }]}>
                            ({product.rating?.toFixed(1) || "0.0"})
                        </Text>
                    </View>

                    {/* Cena */}
                    {product.cutPrice && (
                        <Text style={[styles.cutPrice, { color: colors.icon }]}>
                            {product.cutPrice} zł
                        </Text>
                    )}
                    <Text style={[styles.price, { color: colors.text }]}>
                        {product.price ?? "Brak ceny"} zł
                    </Text>
                </Card.Content>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        width: "100%",
        height: 200,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: "row",
        height: "100%",
    },
    image: {
        width: 120,
        height: "100%",
        resizeMode: "cover",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginRight: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    ratingText: {
        fontSize: 14,
        marginLeft: 4,
    },
    cutPrice: {
        textDecorationLine: "line-through",
        fontSize: 14,
        marginTop: 2,
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
    },
});

export default SearchProductCard;
