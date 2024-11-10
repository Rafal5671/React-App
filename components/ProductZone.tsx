import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView, Image, Text, useColorScheme, TouchableOpacity } from "react-native";
import { Product } from "@/types/Product";
import { Card, Title, Paragraph } from 'react-native-paper';
import { Colors } from "@/constants/Colors";


const ProductCard: React.FC<{ product: Product; colorScheme: 'light' | 'dark' }> = ({ product, colorScheme }) => {
    const colors = Colors[colorScheme];

    return (
        <TouchableOpacity onPress={() => console.log(`Clicked on ${product.productName}`)}>
            <Card style={[styles.productCard, { backgroundColor: colors.cardbackground }]}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <Card.Content>
                    <Title
                        style={{ color: colors.text }}
                        numberOfLines={2}              // Limit title to 2 lines
                        ellipsizeMode="tail"           // Show ellipsis if text overflows
                    >
                        {product.productName}
                    </Title>
                    <Paragraph style={{ color: colors.text }}>{product.price} zł</Paragraph>
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

// Product Carousel Component
const ProductCarousel: React.FC<{ title: string; products: Product[]; colorScheme: 'light' | 'dark' }> = ({ title, products, colorScheme }) => {
    const colors = Colors[colorScheme];

    return (
        <View style={styles.carouselContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} colorScheme={colorScheme} />
                ))}
            </ScrollView>
        </View>
    );
};

// Main Product Zone Component
const ProductZone: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([]);
    const colorScheme = useColorScheme() || "light";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://192.168.100.8:8082/api/products"); // Replace with your actual backend IP
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

    const colors = Colors[colorScheme];

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.tint} />
                <Text style={{ color: colors.text }}>Ładowanie produktów...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <ProductCarousel title="Bestsellery" products={products} colorScheme={colorScheme} />
            <ProductCarousel title="Polecamy" products={products} colorScheme={colorScheme} />
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    carouselContainer: {
        marginBottom: 16,
    },
    carousel: {
        flexDirection: 'row',
    },
    productCard: {
        width: 300,
        height: 370,
        marginRight: 12,
        borderRadius: 8,
    },
    productImage: {
        width: 300,
        height: 250,
        borderRadius: 8,
    },
    cutPrice: {
        textDecorationLine: 'line-through',
    },
});

export default ProductZone;
