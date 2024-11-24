import React, { useEffect, useState } from 'react';
import { ScrollView, useColorScheme, StyleSheet, TextInput } from 'react-native';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import ProductZone from '@/components/ProductZone';
import CarouselSlider from '@/components/Slider';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || 'light'];

  const [showCarousel, setShowCarousel] = useState(false);
  const [showProductZone, setShowProductZone] = useState(false);

  useEffect(() => {
    const carouselTimer = setTimeout(() => {
      setShowCarousel(true);
    }, 2000); // 2-second delay

    const productZoneTimer = setTimeout(() => {
      setShowProductZone(true);
    }, 4000); // 4-second delay

    return () => {
      clearTimeout(carouselTimer);
      clearTimeout(productZoneTimer);
    };
  }, []);

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: themeColors.text }]}>Dzień dobry</Text>
        <View style={[styles.searchContainer, { backgroundColor: themeColors.background }]}>
          <Icon source="magnify" size={20} color={themeColors.icon} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text }]}
            placeholder="Wyszukaj produkty..."
            placeholderTextColor="#888"
            selectionColor="#fff"
          />
        </View>
      </View>
      {showCarousel && <CarouselSlider />}
      {showProductZone && <ProductZone />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 10,
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
    flex: 1,
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
});
