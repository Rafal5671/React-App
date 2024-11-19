import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator,useColorScheme } from "react-native";
import { List, Divider, Text, IconButton } from "react-native-paper";
import { Colors } from "@/constants/Colors";

interface Order {
  id: number;
  orderDate: string;
  state: string;
  basket: {
    totalPrice: number;
  };
}

interface ProfileOrdersProps {
  userEmail: string;
  onBack: () => void;
}

const ProfileOrders: React.FC<ProfileOrdersProps> = ({ userEmail, onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const colors = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const response = await fetch(
          `http:///192.168.100.8:8082/api/order/user/${userEmail}`
        );
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={onBack}
        style={[styles.backButton, { tintColor: colors.text }]}
      />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Twoje zamówienia
      </Text>
      {loadingOrders ? (
        <ActivityIndicator size="large" color={colors.tint} />
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <View key={order.id}>
            <List.Item
              title={`Zamówienie #${order.id}`}
              description={`Data: ${order.orderDate.substring(
                0,
                10
              )} | Status: ${order.state}`}
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.icon }}
              left={() => <List.Icon icon="package" color={colors.icon} />}
              right={() => (
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>
                    {order.basket.totalPrice.toFixed(2)} zł
                  </Text>
                </View>
              )}
            />
            <Divider
              style={[styles.divider, { backgroundColor: colors.icon }]}
            />
          </View>
        ))
      ) : (
        <Text style={{ color: colors.text, paddingLeft: 16 }}>
          Brak zamówień do wyświetlenia.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 16,
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  priceBadge: {
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  priceText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
  },
});

export default ProfileOrders;
