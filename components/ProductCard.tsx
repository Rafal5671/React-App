import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Image, View, useColorScheme } from "react-native";
import { Card, Title, Button, Text } from "react-native-paper";
import { Product } from "@/types/Product";
import { Colors } from "@/constants/Colors";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [open, setOpen] = useState<boolean>(false);
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    const addToCartHandler = () => {
        console.log(`Dodano do koszyka: ${product.productName}`);
        setOpen(true);
    };

    return (
        <Card style={[styles.card, { backgroundColor: themeColors.cardbackground, shadowColor: themeColors.icon }]}>
            <TouchableOpacity onPress={() => alert(`Zobacz szczegóły produktu: ${product.productName}`)} style={styles.row}>
                {/* Product Image on the Left */}
                <Image source={{ uri: product.image }} style={styles.image} />
                
                {/* Product Details on the Right */}
                <Card.Content style={styles.content}>
                    <Title style={[styles.title, { color: themeColors.text }]}>{product.productName}</Title>
                    
                    {/* Price Section */}
                    {product.cutPrice && (
                        <Text style={[styles.cutPrice, { color: themeColors.icon }]}>{product.cutPrice} zł</Text>
                    )}
                    <Text style={[styles.price, { color: themeColors.text }]}>{product.price} zł</Text>
                    
                    {/* Add to Cart Button */}
                    <Button
                        mode="contained"
                        onPress={addToCartHandler}
                        style={[styles.button, { backgroundColor: themeColors.tint }]}
                        labelStyle={{ color: themeColors.background }}
                    >
                        Dodaj do koszyka
                    </Button>
                </Card.Content>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        width: '100%',
        height: 200,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        height: '100%',
    },
    image: {
        width: 120,
        height: '100%',
        resizeMode: "cover",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginRight: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    cutPrice: {
        textDecorationLine: 'line-through',
        fontSize: 14,
        marginTop: 2,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    button: {
        marginTop: 10,
    },
});

export default ProductCard;
