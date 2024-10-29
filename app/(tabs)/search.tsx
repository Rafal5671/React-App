import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, useColorScheme,TextInput } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import { Colors } from '@/constants/Colors';

const categories = [
    { title: 'Laptopy i komputery', icon: 'laptop' },
    { title: 'Smartfony i smartwatche', icon: 'cellphone' },
    { title: 'Podzespoły komputerowe', icon: 'memory' },
    { title: 'Gaming i streaming', icon: 'gamepad-variant' },
];

export default function SearchScreen() {
    const colorScheme = useColorScheme();
    const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: themeColors.text }]}>Wszystkie kategorie</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Wyszukaj produkty..."
                    placeholderTextColor="#888"
                    selectionColor="#fff"
                />
            </View>
            <View style={styles.categoryList}>
                {categories.map((category, index) => (
                    <List.Item
                        key={index}
                        title={category.title}
                        titleStyle={{ color: themeColors.text }}
                        style={[styles.listItem, { backgroundColor: themeColors.cardbackground }]}
                        left={() => <List.Icon icon={category.icon} color={themeColors.icon} />}
                        right={() => <IconButton icon="chevron-right" />}
                    />
                ))}
                <List.Item
                    title="Trendy, promocje i nowości"
                    titleStyle={[styles.promoTitle, { color: themeColors.tint }]}
                    right={() => <IconButton icon="chevron-right"/>}
                    style={[styles.listItem, { backgroundColor: themeColors.background }]}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        marginTop: 30,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        color: '#fff',
    },
    categoryList: {
        marginTop: 10,
    },
    listItem: {
        marginVertical: 4,
        borderRadius: 8,
    },
    promoTitle: {
        fontWeight: 'bold',
    },
});
