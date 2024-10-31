import React from 'react';
import { ScrollView, useColorScheme } from 'react-native';
import { View, Text, StyleSheet,TextInput } from 'react-native';
import {Icon } from 'react-native-paper';
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
                <View style={[styles.searchContainer, { backgroundColor: themeColors.background }]}>
                    <Icon source="magnify" size={20} color={themeColors.icon}/>
                    <TextInput
                        style={[styles.searchInput, { color: themeColors.text }]}
                        placeholder="Wyszukaj produkty..."
                        placeholderTextColor="#888"
                        selectionColor="#fff"
                    />
                </View>
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
        borderRadius: 8,
        paddingHorizontal: 10,
        color: '#fff',
    },
    categoryList: {
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
});
