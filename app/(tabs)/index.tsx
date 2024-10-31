import React from 'react';
import { ScrollView, useColorScheme } from 'react-native';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ProductZone from '@/components/ProductZone';
import CarouselSlider from '@/components/Slider';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme || 'light'];

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.greeting, { color: themeColors.text }]}>Dzień dobry</Text>
                <TextInput
                    style={[styles.searchInput, { backgroundColor: themeColors.cardbackground, color: themeColors.text, borderColor: themeColors.icon }]}
                    placeholder="Wyszukaj produkty..."
                    placeholderTextColor={themeColors.icon}
                    selectionColor={themeColors.tint}
                />
            </View>
            <CarouselSlider />
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
        marginTop:10
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
});
