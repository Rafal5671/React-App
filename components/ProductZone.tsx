import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView, Image, Text, useColorScheme,TouchableOpacity  } from "react-native";
import { Product } from "@/types/Product";
import { Card, Title, Paragraph } from 'react-native-paper';
import { Colors } from "@/constants/Colors";

const sampleProducts: Product[] = [
    {
        id: 1,
        productName: "Przykładowy produkt 1",
        image: "https://via.placeholder.com/150",
        price: 20.00,
        cutPrice: 25.00,
        quantity: 5,
        description: "Ekran: 6.5 cala OLED, Procesor: Octa-Core 3.0GHz, RAM: 8 GB, Pamięć: 128 GB"
    },
    {
        id: 2,
        productName: "Przykładowy produkt 2",
        image: "https://via.placeholder.com/150",
        price: 15.00,
        cutPrice: null,
        quantity: 0,
        description: "Ekran: 6.5 cala OLED, Procesor: Octa-Core 3.0GHz, RAM: 8 GB, Pamięć: 128 GB"
    },
    {
        id: 3,
        productName: "Przykładowy produkt 3",
        image: "https://via.placeholder.com/150",
        price: 30.00,
        cutPrice: 35.00,
        quantity: 10,
        description: "Ekran: 6.5 cala OLED, Procesor: Octa-Core 3.0GHz, RAM: 8 GB, Pamięć: 128 GB"
    },
];

const ProductCard: React.FC<{ product: Product; colorScheme: 'light' | 'dark' }> = ({ product, colorScheme }) => {
    const colors = Colors[colorScheme];

    return (
        <TouchableOpacity onPress={() => console.log(`Clicked on ${product.productName}`)}>
        <Card style={[styles.productCard, { backgroundColor: colors.cardbackground }]}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <Card.Content>
                <Title style={{ color: colors.text }}>{product.productName}</Title>
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

const ProductZone: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([]);
    const colorScheme = useColorScheme() || 'light';

    useEffect(() => {
        const fetchProducts = () => {
            setTimeout(() => {
                setProducts(sampleProducts);
                setLoading(false);
            }, 1000);
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
        marginLeft:15,
        marginTop:10,
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
        width: 150,
        height:270,
        marginRight: 12,
        borderRadius: 8,
    },
    productImage: {
        width: 150,
        height: 150,
        borderRadius: 8,
    },
    cutPrice: {
        textDecorationLine: 'line-through',
    },
});

export default ProductZone;
