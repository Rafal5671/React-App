import React, { useState, useEffect, useCallback, useRef } from "react";
import { FlatList, StyleSheet, View, Text, ScrollView } from "react-native";
import {
  Appbar,
  Button,
  IconButton,
  TextInput,
  Checkbox,
  RadioButton,
} from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import SearchProductCard from "@/components/SearchProductCard";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Product } from "@/types/Product";
import {CONFIG} from "@/constants/config";

const ResultScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [producers, setProducers] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{
    min: number | null;
    max: number | null;
  }>({ min: null, max: null });
  const [hideUnavailable, setHideUnavailable] = useState<boolean>(false);
  const [filterSelectedProducers, setFilterSelectedProducers] = useState<
    string[]
  >([]);
  const [selectedSort, setSelectedSort] = useState<string>(
    "Ocena klientów: od najlepszej"
  );
  const [currentView, setCurrentView] = useState<
    "main" | "categories" | "producers"
  >("main");
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const categoryIds = searchParams.categoryIds || "";
  const searchQuery = searchParams.searchQuery || "";
  const producerParam = searchParams.producer || "";
  const shouldIncludeG4M3R = searchParams.shouldIncludeG4M3R === "true"; // Extract and convert to boolean

  const [selectedProducers, setSelectedProducers] = useState<string[]>(
    producerParam ? [producerParam] : []
  );

  console.log({ categoryIds, searchQuery, producerParam, shouldIncludeG4M3R });

  const categoryIdArray = categoryIds
    ? categoryIds.split(",").map((id) => parseInt(id))
    : [];

  // Function to fetch producers from the backend
  const fetchProducers = async () => {
    let url = `http://${CONFIG.serverIp}/api/products/producers?`;

    if (categoryIds) {
      const ids = categoryIds.split(",");
      ids.forEach((id) => {
        url += `categoryIds=${id}&`;
      });
    }
    if (searchQuery) {
      url += `searchQuery=${encodeURIComponent(searchQuery)}&`;
    }

    console.log("Fetching producers from URL:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setProducers(data);
    } catch (error) {
      console.error("Error fetching producers:", error);
    }
  };

  // Function to fetch products from the backend
  const fetchProducts = async () => {
    let url = `http://${CONFIG.serverIp}/api/products/filter?`;

    if (categoryIds) {
      const ids = categoryIds.split(",");
      ids.forEach((id) => {
        url += `categoryIds=${id}&`;
      });
    }
    if (selectedProducers.length > 0) {
      selectedProducers.forEach((producer) => {
        url += `producers=${encodeURIComponent(producer)}&`;
      });
    }
    if (searchQuery) {
      url += `searchQuery=${encodeURIComponent(searchQuery)}&`;
    }
    if (priceRange.min !== null) {
      url += `minPrice=${encodeURIComponent(priceRange.min.toString())}&`;
    }
    if (priceRange.max !== null) {
      url += `maxPrice=${encodeURIComponent(priceRange.max.toString())}&`;
    }

    console.log("Fetching products from URL:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    // Initialize selected producers based on navigation params
    if (shouldIncludeG4M3R) {
      setSelectedProducers(["G4M3R"]);
      setFilterSelectedProducers(["G4M3R"]);
    } else {
      setSelectedProducers(producerParam ? [producerParam] : []);
      setFilterSelectedProducers(producerParam ? [producerParam] : []);
    }

    // Reset other filters
    setHideUnavailable(false);
    setPriceRange({ min: null, max: null }); // Set default values to null
    setSelectedSort("Ocena klientów: od najlepszej");
  }, [categoryIds, searchQuery, producerParam, shouldIncludeG4M3R]);

  useEffect(() => {
    fetchProducts();
    fetchProducers();
  }, [categoryIds, searchQuery, selectedProducers, priceRange]);

  useEffect(() => {
    applySorting();
  }, [products, selectedSort]);

  const handleProducerToggle = (producer: string) => {
    if (filterSelectedProducers.includes(producer)) {
      setFilterSelectedProducers(
        filterSelectedProducers.filter((p) => p !== producer)
      );
    } else {
      setFilterSelectedProducers([...filterSelectedProducers, producer]);
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
    sortSheetRef.current?.close();
    filterSheetRef.current?.expand();
    setCurrentView("main");
    setFilterSelectedProducers(selectedProducers); // Initialize temporary state
  };

  const handleOpenSort = () => {
    filterSheetRef.current?.close();
    sortSheetRef.current?.expand();
  };

  const applyFilters = () => {
    if (!shouldIncludeG4M3R) {
      setSelectedProducers(filterSelectedProducers);
    }
    filterSheetRef.current?.close();
    fetchProducts(); // Fetch products after applying filters
  };

  const applySorting = useCallback(() => {
    let sorted = [...products];
    switch (selectedSort) {
      case "Ocena klientów: od najlepszej":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "Cena: od najtańszych":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "Cena: od najdroższych":
        sorted.sort((a, b) => b.price - a.price);
        break;
    }
    setSortedProducts(sorted);
  }, [products, selectedSort]);

  // Apply sorting from the bottom sheet
  const handleApplySort = () => {
    applySorting(); // Update sorted list
    sortSheetRef.current?.close();
  };

  const renderProducersFilter = () => (
    <>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Wybierz producenta</Text>
        <IconButton
          icon="arrow-left"
          onPress={() => setCurrentView("main")}
          size={24}
        />
      </View>
      <ScrollView>
        {shouldIncludeG4M3R ? (
          // Only display G4M3R, disabled and checked
          <View style={styles.checkboxContainer} key="G4M3R">
            <Checkbox status="checked" disabled={true} />
            <Text style={{ color: "gray" }}>G4M3R</Text>
          </View>
        ) : (
          // Display all producers normally
          producers.map((producer) => (
            <View style={styles.checkboxContainer} key={producer}>
              <Checkbox
                status={
                  filterSelectedProducers.includes(producer)
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => handleProducerToggle(producer)}
              />
              <Text>{producer}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );

  const renderMainFilters = () => (
    <>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Filtry</Text>
        <IconButton
          icon="close"
          onPress={() => filterSheetRef.current?.close()}
          size={24}
        />
      </View>

      <Text style={styles.filterSubtitle}>Cena</Text>
      <View style={styles.priceRange}>
        <TextInput
          label="Min"
          value={priceRange.min !== null ? String(priceRange.min) : ""}
          keyboardType="numeric"
          onChangeText={(text) =>
            setPriceRange({
              ...priceRange,
              min: text !== "" ? Number(text) : null,
            })
          }
          style={styles.input}
        />
        <Text style={styles.toText}>-</Text>
        <TextInput
          label="Max"
          value={priceRange.max !== null ? String(priceRange.max) : ""}
          keyboardType="numeric"
          onChangeText={(text) =>
            setPriceRange({
              ...priceRange,
              max: text !== "" ? Number(text) : null,
            })
          }
          style={styles.input}
        />
      </View>

      {/* Hide the "Wybierz producenta" button when shouldIncludeG4M3R is true */}
      {!shouldIncludeG4M3R && (
        <>
          <Text style={styles.filterSubtitle}>Producent</Text>
          <Button
            mode="outlined"
            style={styles.categoryButton}
            onPress={() => setCurrentView("producers")}
          >
            Wybierz producenta
          </Button>
        </>
      )}

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={hideUnavailable ? "checked" : "unchecked"}
          onPress={() => setHideUnavailable(!hideUnavailable)}
        />
        <Text>Ukryj niedostępne</Text>
      </View>

      <Button mode="contained" onPress={applyFilters}>
        Zastosuj
      </Button>
    </>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction
          onPress={() => {
            const sourceScreen = searchParams.sourceScreen || "home"; // Default to "home" if not provided
            if (sourceScreen === "search") {
              router.push("/(tabs)/search");
            } else {
              router.push("/"); // Navigate back to the homepage
            }
          }}
        />
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

      {/* Product List */}
      <FlatList
        data={sortedProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productList}
      />

      {/* BottomSheet for filters */}
      <BottomSheet
        ref={filterSheetRef}
        index={-1}
        snapPoints={["80%"]}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          {currentView === "main" && renderMainFilters()}
          {currentView === "producers" && renderProducersFilter()}
        </BottomSheetView>
      </BottomSheet>

      {/* BottomSheet for sorting */}
      <BottomSheet
        ref={sortSheetRef}
        index={-1}
        snapPoints={["45%"]}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Sortowanie</Text>
            <IconButton
              icon="close"
              onPress={() => sortSheetRef.current?.close()}
              size={24}
            />
          </View>

          <RadioButton.Group
            onValueChange={(value) => setSelectedSort(value)}
            value={selectedSort}
          >
            <RadioButton.Item
              label="Ocena klientów: od najlepszej"
              value="Ocena klientów: od najlepszej"
            />
            <RadioButton.Item
              label="Cena: od najtańszych"
              value="Cena: od najtańszych"
            />
            <RadioButton.Item
              label="Cena: od najdroższych"
              value="Cena: od najdroższych"
            />
          </RadioButton.Group>

          <Button mode="contained" onPress={handleApplySort}>
            Zastosuj
          </Button>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  appbarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonsContainer: { flexDirection: "row", marginLeft: "auto" },
  filterButton: { marginHorizontal: 5, width: 90 },
  sortButton: { marginHorizontal: 5, width: 90 },
  productList: { padding: 10 },
  contentContainer: { padding: 20 },
  sheetHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  filterSubtitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  priceRange: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  input: { flex: 1, marginHorizontal: 5 },
  toText: { fontSize: 16 },
  categoryButton: { width: "100%", marginBottom: 10 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
});

export default ResultScreen;
