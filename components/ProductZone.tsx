import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator,ScrollView } from "react-native";
import { Product } from "@/types/Product"; 
import ProductGrid from "./ProductGrid";
import { Text } from 'react-native-paper';
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

const ProductZone: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = () => {
            setTimeout(() => {
                setProducts(sampleProducts);
                setLoading(false);
            }, 1000);
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Ładowanie produktów...</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <ProductGrid products={products} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      stepContainer: {
        gap: 8,
        marginBottom: 8,
      },
      reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
      },
});

export default ProductZone;
