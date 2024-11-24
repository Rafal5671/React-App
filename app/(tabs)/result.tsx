import React, { useState, useEffect, useCallback, useRef } from "react";
import { FlatList, StyleSheet, View, Text, ScrollView } from "react-native";
import { Appbar, Button, IconButton, TextInput, Checkbox, RadioButton } from "react-native-paper";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import SearchProductCard from "@/components/SearchProductCard";
import { Product } from "@/types/Product";

const ResultScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [hideUnavailable, setHideUnavailable] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProducers, setSelectedProducers] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("Ocena klientów: od najlepszej");
  const [currentView, setCurrentView] = useState<"main" | "categories" | "producers">("main");

  const dummyProducts: Product[] = [
    { id: 1, productName: "Produkt 1", price: 99.99, rating: 4.5, image: "https://via.placeholder.com/150", quantity: 0, description: "", reviewCount: 0 },
    { id: 2, productName: "Produkt 2", price: 199.99, rating: 4.0, image: "https://via.placeholder.com/150", quantity: 0, description: "", reviewCount: 0 },
    { id: 3, productName: "Produkt 3", price: 149.99, rating: 5.0, image: "https://via.placeholder.com/150", quantity: 0, description: "", reviewCount: 0 },
    { id: 4, productName: "Produkt 4", price: 50.00, rating: 3.5, image: "https://via.placeholder.com/150", quantity: 0, description: "", reviewCount: 0 },
    { id: 5, productName: "Produkt 5", price: 300.00, rating: 4.8, image: "https://via.placeholder.com/150", quantity: 0, description: "", reviewCount: 0 }
  ];

  const categories = ["Elektronika", "Odzież", "Sport", "Dom i Ogród", "Zabawki"];
  const producers = ["Sony", "Samsung", "Apple", "LG", "Panasonic"];

  useEffect(() => {
    setProducts(dummyProducts);
  }, []);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleProducerToggle = (producer: string) => {
    if (selectedProducers.includes(producer)) {
      setSelectedProducers(selectedProducers.filter((p) => p !== producer));
    } else {
      setSelectedProducers([...selectedProducers, producer]);
    }
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    return <SearchProductCard product={item} />;
  };

  const filterSheetRef = useRef<BottomSheet>(null);
  const sortSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("Bottom sheet state changed:", index);
  }, []);

  const handleOpenFilter = () => {
    sortSheetRef.current?.close(); // Close the sort sheet if open
    filterSheetRef.current?.expand(); // Open the filter sheet
    setCurrentView("main");
  };
  
  const handleOpenSort = () => {
    filterSheetRef.current?.close(); // Close the filter sheet if open
    sortSheetRef.current?.expand(); // Open the sort sheet
  };

  const applySorting = () => {
    let sortedProducts = [...products];
    switch (selectedSort) {
      case "Ocena klientów: od najlepszej":
        sortedProducts = sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "Cena: od najtańszych":
        sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "Cena: od najdroższych":
        sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
        break;
    }
    setProducts(sortedProducts);
    sortSheetRef.current?.close();
  };

  const renderCategoriesFilter = () => (
    <>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Wybierz kategorię</Text>
        <IconButton icon="arrow-left" onPress={() => setCurrentView("main")} size={24} />
      </View>
      <ScrollView>
        {categories.map((category) => (
          <View style={styles.checkboxContainer} key={category}>
            <Checkbox
              status={selectedCategories.includes(category) ? "checked" : "unchecked"}
              onPress={() => handleCategoryToggle(category)}
            />
            <Text>{category}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );

  const renderProducersFilter = () => (
    <>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Wybierz producenta</Text>
        <IconButton icon="arrow-left" onPress={() => setCurrentView("main")} size={24} />
      </View>
      <ScrollView>
        {producers.map((producer) => (
          <View style={styles.checkboxContainer} key={producer}>
            <Checkbox
              status={selectedProducers.includes(producer) ? "checked" : "unchecked"}
              onPress={() => handleProducerToggle(producer)}
            />
            <Text>{producer}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );

  const renderMainFilters = () => (
    <>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Filtry</Text>
        <IconButton icon="close" onPress={() => filterSheetRef.current?.close()} size={24} />
      </View>

      <Text style={styles.filterSubtitle}>Cena</Text>
      <View style={styles.priceRange}>
        <TextInput
          label="Min"
          value={String(priceRange.min)}
          keyboardType="numeric"
          onChangeText={(text) => setPriceRange({ ...priceRange, min: Number(text) })}
          style={styles.input}
        />
        <Text style={styles.toText}>-</Text>
        <TextInput
          label="Max"
          value={String(priceRange.max)}
          keyboardType="numeric"
          onChangeText={(text) => setPriceRange({ ...priceRange, max: Number(text) })}
          style={styles.input}
        />
      </View>

      <Text style={styles.filterSubtitle}>Kategoria</Text>
      <Button
        mode="outlined"
        style={styles.categoryButton}
        onPress={() => setCurrentView("categories")}
      >
        Wybierz kategorię
      </Button>

      <Text style={styles.filterSubtitle}>Producent</Text>
      <Button
        mode="outlined"
        style={styles.categoryButton}
        onPress={() => setCurrentView("producers")}
      >
        Wybierz producenta
      </Button>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={hideUnavailable ? "checked" : "unchecked"}
          onPress={() => setHideUnavailable(!hideUnavailable)}
        />
        <Text>Ukryj niedostępne</Text>
      </View>

      <Button mode="contained" onPress={() => filterSheetRef.current?.close()}>
        Zastosuj
      </Button>
    </>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.Content title="Wyniki wyszukiwania" />
        <View style={styles.buttonsContainer}>
          <Button
            mode="outlined"
            onPress={handleOpenFilter}
            style={styles.filterButton}
            icon="filter"
          >
            Filtry
          </Button>

          <Button
            mode="outlined"
            onPress={handleOpenSort}
            style={styles.sortButton}
            icon="sort"
          >
            Sortuj
          </Button>
        </View>
      </Appbar.Header>

      {/* Product list */}
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productList}
      />

      {/* BottomSheet for filters */}
      <BottomSheet
        ref={filterSheetRef}
        index={-1}
        snapPoints={['80%']}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          {currentView === "main" && renderMainFilters()}
          {currentView === "categories" && renderCategoriesFilter()}
          {currentView === "producers" && renderProducersFilter()}
        </BottomSheetView>
      </BottomSheet>

      {/* BottomSheet for sorting */}
      <BottomSheet
        ref={sortSheetRef}
        index={-1}
        snapPoints={['45%']}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Sortowanie</Text>
            <IconButton icon="close" onPress={() => sortSheetRef.current?.close()} size={24} />
          </View>

          <RadioButton.Group
            onValueChange={(value) => setSelectedSort(value)}
            value={selectedSort}
          >
            <RadioButton.Item label="Ocena klientów: od najlepszej" value="Ocena klientów: od najlepszej" />
            <RadioButton.Item label="Cena: od najtańszych" value="Cena: od najtańszych" />
            <RadioButton.Item label="Cena: od najdroższych" value="Cena: od najdroższych" />
          </RadioButton.Group>

          <Button mode="contained" onPress={applySorting}>
            Zastosuj
          </Button>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  appbarHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  buttonsContainer: { flexDirection: "row", marginLeft: "auto" },
  filterButton: { marginHorizontal: 5, width: 90 },
  sortButton: { marginHorizontal: 5, width: 90 },
  productList: { padding: 10 },
  contentContainer: { padding: 20 },
  sheetHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  sheetTitle: { fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center" },
  filterSubtitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  priceRange: { flexDirection: "row", justifyContent: "space-between" },
  input: { width: '45%', marginBottom: 10 },
  toText: { alignSelf: "center", fontSize: 16 },
  categoryButton: { width: "100%", marginBottom: 10 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginTop: 20 },
});

export default ResultScreen;
