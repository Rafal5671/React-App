import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Product } from "@/types//Product"; // Importuj typ dla produktu
import ProductCard from './ProductCard'; // Importuj ProductCard

interface ProductGridProps {
    products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    return (
        <View style={styles.grid}>
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});

export default ProductGrid;
