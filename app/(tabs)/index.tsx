import React, { useState, useEffect } from 'react';
import { ScrollView, useColorScheme } from 'react-native';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Icon } from 'react-native-paper';
import ProductZone from '@/components/ProductZone';
import CarouselSlider from '@/components/Slider';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme || 'light'];

    // Stan do kontrolowania wyświetlania komponentów
    const [showCarousel, setShowCarousel] = useState(false);
    const [showProductZone, setShowProductZone] = useState(false);

    useEffect(() => {
        // Opóźnienie dla CarouselSlider
        const carouselTimer = setTimeout(() => {
            setShowCarousel(true);
        }, 2000); // Opóźnienie 2 sekundy

        // Opóźnienie dla ProductZone
        const productZoneTimer = setTimeout(() => {
            setShowProductZone(true);
        }, 4000); // Opóźnienie 4 sekundy

        // Czyszczenie timerów po odmontowaniu komponentu
        return () => {
            clearTimeout(carouselTimer);
            clearTimeout(productZoneTimer);
        };
    }, []);

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
            {/* Warunkowe renderowanie komponentów po opóźnieniu */}
            {showCarousel && <CarouselSlider />}
            {showProductZone && <ProductZone />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingRight: 10, // czarny bok po prawej
    },
    header: {
        marginBottom: 7,
        padding: 16,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 15,
    },
    searchInput: {
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 10,
        color: '#fff',
    },
    categoryList: {},
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
