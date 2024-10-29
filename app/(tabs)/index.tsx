import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ProductZone from '@/components/ProductZone';
import CarouselSlider from '@/components/Slider';

export default function HomeScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Dzień dobry</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Wyszukaj produkty..."
                    placeholderTextColor="#888"
                    selectionColor="#fff"
                />
            </View>
            <CarouselSlider/>
            <ProductZone />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        marginBottom: 16,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        color: '#fff',
    },
});
