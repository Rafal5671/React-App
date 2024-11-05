import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Image, View, useColorScheme } from "react-native";
import { Card, Title, Text } from "react-native-paper";
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
            <TouchableOpacity activeOpacity={0.8} onPress={() => alert(`Zobacz szczegóły produktu: ${product.productName}`)} style={styles.row}>
                
                {/* Product Image */}
                <Image source={{ uri: product.image }} style={styles.image} />
                
                {/* Product Details */}
                <Card.Content style={styles.content}>
                    {/* Product Name */}
                    <Title style={[styles.title, { color: themeColors.text }]}>{product.productName}</Title>
                    
                    {/* Product Description */}
                    <Text style={[styles.description, { color: themeColors.text }]}>{product.description}</Text>

                    {/* Price Section at the Bottom */}
                    <View style={styles.priceContainer}>
                        {product.cutPrice && (
                            <Text style={[styles.cutPrice, { color: themeColors.icon }]}>{product.cutPrice} zł</Text>
                        )}
                        <Text style={[styles.price, { color: themeColors.text }]}>{product.price} zł</Text>
                    </View>
                </Card.Content>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        width: '100%',
        height: 180,
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
        width: 125,
        height: '100%',
        resizeMode: "cover",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginRight: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        justifyContent: 'space-between', // Space out title, description, and price
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        marginVertical: 8, // Adds space below the title and above the price
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cutPrice: {
        textDecorationLine: 'line-through',
        fontSize: 14,
        marginRight: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProductCard;
