import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { List, Icon, Divider } from "react-native-paper";
import { Colors } from "@/constants/Colors";

const categories = [
  { title: "Laptopy i komputery", icon: "laptop" },
  { title: "Smartfony i smartwatche", icon: "cellphone" },
  { title: "Podzespoły komputerowe", icon: "memory" },
  { title: "Gaming i streaming", icon: "gamepad-variant" },
];

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Wszystkie kategorie
        </Text>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: themeColors.background },
          ]}
        >
          <Icon source="magnify" size={20} color={themeColors.icon} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text }]}
            placeholder="Wyszukaj produkty..."
            placeholderTextColor="#888"
            selectionColor="#fff"
          />
        </View>
      </View>
      <View style={styles.categoryList}>
        {categories.map((category, index) => (
          <View
            key={index}
            style={[
              styles.listItemContainer,
              { backgroundColor: themeColors.background },
            ]}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
              <List.Item
                title={category.title}
                titleStyle={{ color: themeColors.text }}
                style={styles.listItem}
                left={() => (
                  <List.Icon icon={category.icon} color={themeColors.icon} />
                )}
                right={() => (
                  <List.Icon icon="chevron-right" color={themeColors.icon} />
                )}
              />
            </TouchableOpacity>
            <Divider
              style={[styles.divider, { backgroundColor: themeColors.icon }]}
            />
          </View>
        ))}
        <View
          style={[
            styles.listItemContainer,
            { backgroundColor: themeColors.background },
          ]}
        >
          <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
            <List.Item
              title="Promocje"
              titleStyle={[styles.promoTitle, { color: themeColors.tint }]}
              right={() => (
                <List.Icon icon="chevron-right" color={themeColors.icon} />
              )}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  header: {
    marginTop: 30,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#fff",
  },
  categoryList: {},
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  listItemContainer: {
    marginVertical: 4,
    overflow: "hidden", // Ensures that the divider doesn't extend beyond the rounded corners
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  divider: {
    height: 1,
  },
  promoTitle: {
    fontWeight: "bold",
  },
});
