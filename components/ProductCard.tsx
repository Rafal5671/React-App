import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { Card, Title, Button, Text } from "react-native-paper";
import { Product } from "@/types/Product";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [open, setOpen] = useState<boolean>(false);

    const addToCartHandler = () => {
        console.log(`Dodano do koszyka: ${product.productName}`);
        setOpen(true);
    };

    return (
        <Card style={styles.card}>
            <TouchableOpacity onPress={() => alert(`Zobacz szczegóły produktu: ${product.productName}`)} style={styles.row}>
                {/* Product Image on the Left */}
                <Image source={{ uri: product.image }} style={styles.image} />
                
                {/* Product Details on the Right */}
                <Card.Content style={styles.content}>
                    <Title style={styles.title}>{product.productName}</Title>
                    
                    {/* Ratings and Reviews */}
                    

                    {/* Price Section */}
                    {product.cutPrice && (
                        <Text style={styles.cutPrice}>{product.cutPrice} zł</Text>
                    )}
                    <Text style={styles.price}>{product.price} zł</Text>
                    
                    {/* Add to Cart Button */}
                    <Button mode="contained" onPress={addToCartHandler} style={styles.button}>
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
        height: 200, // Fixed height for all cards
        borderRadius: 10,
        backgroundColor: '#333333', // Dark gray background color
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        height: '100%', // Make the row container fill the card height
    },
    image: {
        width: 120,  // Fixed width for the image
        height: '100%', // Make image fill the entire card height
        resizeMode: "cover",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginRight: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center', // Center content vertically within fixed height
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF', // White text color for better contrast on dark background
        marginBottom: 4,
    },
    cutPrice: {
        textDecorationLine: 'line-through',
        color: '#888', // Slightly lighter gray for the cut price
        fontSize: 14,
        marginTop: 2,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF', // White text color for better contrast on dark background
        marginBottom: 6,
    },
    button: {
        backgroundColor: '#007AFF',
        marginTop: 10,
    },
});

export default ProductCard;
