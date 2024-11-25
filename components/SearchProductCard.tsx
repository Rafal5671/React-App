import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    useColorScheme,
} from "react-native";
import { Card, Text } from "react-native-paper";
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

    // Define default placeholders
    const defaultProduct = {
        productName: "Ultra-Wydajny Laptop Gamingowy XYZ Pro Max z Procesorem Intel i9 13. generacji i Ekranem OLED 4K UHD",
        rating: 4.5,
        reviews: 152,
        processor: "Intel Core i9-13900H",
        memory: "32GB DDR5",
        graphics: "NVIDIA GeForce RTX 4090",
        displayType: "OLED 4K UHD",
        isPromo: true,
        cutPrice: 15999,
        price: 13999,
        image: `https://via.placeholder.com/120x200?text=Laptop+XYZ+Pro+Max`,
    };
    

    // Merge product data with default placeholders
    const productData = { ...defaultProduct, ...product };

    return (
        <Card
            style={[
                styles.card,
                { backgroundColor: colors.cardbackground, shadowColor: colors.icon },
            ]}
        >
            <TouchableOpacity onPress={handlePress} style={styles.row}>
                {/* Image Section */}
                <Image
                    source={{
                        uri: productData.image,
                    }}
                    style={styles.image}
                />

                {/* Details Section */}
                <View style={styles.content}>
                    {/* Promotion Tag */}
                    {productData.isPromo && (
                        <Text style={[styles.promoTag, { backgroundColor: colors.tint }]}>
                            Promocja
                        </Text>
                    )}

                    {/* Product Name */}
                    <Text style={[styles.title, { color: colors.text }]}>
                        {productData.productName}
                    </Text>

                    {/* Rating Section */}
                    <View style={styles.ratingContainer}>
                        {renderStars(productData.rating)}
                        <Text style={[styles.ratingText, { color: colors.icon }]}>
                            ({productData.reviews} opinie)
                        </Text>
                    </View>

                    {/* Specifications */}
                    <View style={styles.specifications}>
                        <Text style={[styles.specText, { color: colors.icon }]}>
                            Procesor: {productData.processor}
                        </Text>
                        <Text style={[styles.specText, { color: colors.icon }]}>
                            Pamięć: {productData.memory}
                        </Text>
                        <Text style={[styles.specText, { color: colors.icon }]}>
                            Grafika: {productData.graphics}
                        </Text>
                        <Text style={[styles.specText, { color: colors.icon }]}>
                            Typ ekranu: {productData.displayType}
                        </Text>
                    </View>

                    {/* Price Section */}
                    <View>
                        {productData.cutPrice && (
                            <Text style={[styles.cutPrice, { color: colors.icon }]}>
                                {productData.cutPrice} zł
                            </Text>
                        )}
                        <Text style={[styles.price, { color: colors.text }]}>
                            {productData.price} zł
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Card>
    );
};


const styles = StyleSheet.create({
    card: {
        marginVertical: 8, // Odstęp między kartami
        width: "100%", // Szerokość dopasowana do kontenera
        height: 250, // Zwiększona wysokość karty
        borderRadius: 10, // Zaokrąglone rogi
        shadowOffset: { width: 0, height: 2 }, // Cień: przesunięcie
        shadowOpacity: 0.1, // Przezroczystość cienia
        shadowRadius: 4, // Rozmycie cienia
        elevation: 3, // Wysokość dla Androida
    },
    row: {
        flexDirection: "row", // Układ w poziomie
        height: "100%", // Dopasowanie wysokości do karty
    },
    image: {
        width: 180, // Stała szerokość obrazka
        height: "100%", // Dopasowanie wysokości do karty
        resizeMode: "cover", // Przycięcie obrazka
        borderTopLeftRadius: 10, // Zaokrąglenie górnego lewego rogu
        borderBottomLeftRadius: 10, // Zaokrąglenie dolnego lewego rogu
        marginRight: 10, // Odstęp między obrazkiem a treścią
    },
    content: {
        flex: 1, // Rozciąganie na pozostałą szerokość
        paddingHorizontal: 10, // Wewnętrzne odstępy w poziomie
        justifyContent: "space-between", // Rozkład elementów w pionie
        paddingVertical: 8, // Wewnętrzne odstępy w pionie
    },
    promoTag: {
        alignSelf: "flex-start", // Dopasowanie tagu do lewej strony
        paddingHorizontal: 8, // Wewnętrzne odstępy w poziomie
        paddingVertical: 2, // Wewnętrzne odstępy w pionie
        borderRadius: 4, // Zaokrąglenie krawędzi
        color: "white", // Kolor tekstu
        fontSize: 12, // Rozmiar czcionki
        marginBottom: 4, // Odstęp dolny
    },
    title: {
        fontSize: 16, // Rozmiar czcionki
        fontWeight: "600", // Grubość czcionki
        marginBottom: 4, // Odstęp dolny
    },
    ratingContainer: {
        flexDirection: "row", // Układ w poziomie
        alignItems: "center", // Wyrównanie w pionie
        marginBottom: 6, // Odstęp dolny
    },
    ratingText: {
        fontSize: 14, // Rozmiar czcionki
        marginLeft: 4, // Odstęp od ikon gwiazdek
    },
    specifications: {
        marginBottom: 6, // Odstęp dolny między specyfikacjami
    },
    specText: {
        fontSize: 13, // Rozmiar czcionki
        lineHeight: 18, // Odstęp między liniami tekstu
    },
    cutPrice: {
        textDecorationLine: "line-through", // Przekreślenie
        fontSize: 14, // Rozmiar czcionki
        marginBottom: 2, // Odstęp dolny
    },
    price: {
        fontSize: 18, // Rozmiar czcionki
        fontWeight: "bold", // Grubość czcionki
    },
});


export default SearchProductCard;
