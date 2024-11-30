import React, { useEffect, useState } from 'react';
import { ScrollView, useColorScheme, StyleSheet, TextInput, Button } from 'react-native';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import ProductZone from '@/components/ProductZone';
import CarouselSlider from '@/components/Slider';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
const categories = [
  {
    title: "Laptopy i komputery",
    icon: "laptop",
    categoryIds: [1],
  },
  {
    title: "Smartfony i smartwatche",
    icon: "cellphone",
    categoryIds: [2, 4],
  },
  {
    title: "Monitory",
    icon: "monitor",
    categoryIds: [3],
  },
  {
    title: "Podzespoły komputerowe",
    icon: "memory",
    categoryIds: [5],
  },
  {
    title: "Gaming i streaming",
    icon: "gamepad-variant",
    categoryIds: [1],
    producer: "G4M3R",
    shouldIncludeG4M3R: true,
  },
];
export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme || 'light'];
  const [searchQuery, setSearchQuery] = useState("");
  const [showCarousel, setShowCarousel] = useState(false);
  const [showProductZone, setShowProductZone] = useState(false);
  const router = useRouter();
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
      <Button
      title="Przejdź na /nazwa"
      onPress={() =>  router.push("/OrderManagementScreen")}
    />
        <Text style={[styles.greeting, { color: themeColors.text }]}>Dzień dobry</Text>
        <View style={[styles.searchContainer, { backgroundColor: themeColors.background }]}>
        <Icon source="magnify" size={20} color={themeColors.icon} />
            <TextInput
              style={[styles.searchInput, { color: themeColors.text }]}
              placeholder="Wyszukaj produkty..."
              placeholderTextColor="#888"
              selectionColor="#fff"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                if (searchQuery.trim() !== "") {
                  router.push({
                    pathname: "/(tabs)/result",
                    params: {
                      searchQuery: searchQuery.trim(),
                      shouldIncludeG4M3R: "false",
                      sourceScreen: "home",
                    },
                  });
                }
              }}
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
