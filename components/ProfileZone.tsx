import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, ActivityIndicator } from "react-native";
import { Avatar, List, Divider, Text, Button, IconButton } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "@react-navigation/native";

interface User {
  name: string;
  lastName: string;
  email: string;
  // Add any other user properties you might have
}

interface ProfileZoneProps {
  user: User | null;
  onLogout: () => void;
}

interface Order {
  id: number;
  orderDate: string;
  state: string;
  basket: {
    totalPrice: number;
    // Inne pola, jeśli potrzebne
  };
}

const ProfileZone: React.FC<ProfileZoneProps> = ({ user, onLogout }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  useEffect(() => {
    if (showOrders && user) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const response = await fetch(`http://192.168.100.8:8082/api/order/user/${user.email}`);
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
    }
  }, [showOrders, user]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {showOrders ? (
        // Widok zamówień
        <View style={styles.section}>
          {/* Przycisk cofania */}
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => setShowOrders(false)}
            style={styles.backButton}
            color={colors.text}
          />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Twoje zamówienia</Text>
          {loadingOrders ? (
            <ActivityIndicator size="large" color={colors.tint} />
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <View key={order.id}>
                <List.Item
                  title={`Zamówienie #${order.id}`}
                  description={`Data: ${order.orderDate.substring(0, 10)} | Status: ${order.state}`}
                  titleStyle={{ color: colors.text }}
                  descriptionStyle={{ color: colors.icon }}
                  left={() => <List.Icon icon="package" color={colors.icon} />}
                  right={() => (
                    <View style={styles.priceBadge}>
                      <Text style={styles.priceText}>{order.basket.totalPrice.toFixed(2)} zł</Text>
                    </View>
                  )}
                />
                <Divider style={[styles.divider, { backgroundColor: colors.icon }]} />
              </View>
            ))
          ) : (
            <Text style={{ color: colors.text, paddingLeft: 16 }}>Brak zamówień do wyświetlenia.</Text>
          )}
        </View>
      ) : (
        // Widok profilu
        <>
          <View style={[styles.profileSection, { backgroundColor: colors.background }]}>
            <Avatar.Text
              size={64}
              label={`${user?.name?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`}
              style={[styles.avatar, { backgroundColor: colors.tint }]}
            />
            <Text style={[styles.profileName, { color: colors.text }]}>
              {user?.name} {user?.lastName}
            </Text>
            <Text style={[styles.profileSubtext, { color: colors.icon }]}>
              Dane konta i ustawienia
            </Text>
          </View>

          <Divider style={[styles.divider, { backgroundColor: colors.icon }]} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Zakupy</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={() => { setShowOrders(true); }}>
              <List.Item
                title="Zamówienia"
                titleStyle={{ color: colors.text }}
                left={() => <List.Icon icon="clipboard-list" color={colors.icon} />}
                right={() => <List.Icon icon="chevron-right" color={colors.icon} />}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
              <List.Item
                title="Dane do zamówień"
                titleStyle={{ color: colors.text }}
                left={() => (
                  <List.Icon icon="file-document-outline" color={colors.icon} />
                )}
                right={() => <List.Icon icon="chevron-right" color={colors.icon} />}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
              <List.Item
                title="Opinie"
                titleStyle={{ color: colors.text }}
                left={() => <List.Icon icon="star-outline" color={colors.icon} />}
                right={() => (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>2</Text>
                  </View>
                )}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
              <List.Item
                title="Reklamacje i zwroty"
                titleStyle={{ color: colors.text }}
                left={() => (
                  <List.Icon icon="package-variant-closed" color={colors.icon} />
                )}
                right={() => <List.Icon icon="chevron-right" color={colors.icon} />}
              />
            </TouchableOpacity>
          </View>

          <Divider style={[styles.divider, { backgroundColor: colors.icon }]} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Pomoc</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
              <List.Item
                title="Skontaktuj się z nami"
                titleStyle={{ color: colors.text }}
                left={() => <List.Icon icon="headset" color={colors.icon} />}
                right={() => <List.Icon icon="chevron-right" color={colors.icon} />}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
              <List.Item
                title="Centrum pomocy"
                titleStyle={{ color: colors.text }}
                left={() => (
                  <List.Icon icon="help-circle-outline" color={colors.icon} />
                )}
                right={() => <List.Icon icon="chevron-right" color={colors.icon} />}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
              <List.Item
                title="O nas"
                titleStyle={{ color: colors.text }}
                left={() => (
                  <List.Icon icon="information-outline" color={colors.icon} />
                )}
                right={() => <List.Icon icon="chevron-right" color={colors.icon} />}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.logoutButton, { backgroundColor: "#FF5A5F" }]}
            onPress={onLogout}
          >
            <Text style={styles.logoutText}>Wyloguj się</Text>
          </TouchableOpacity>

          <Text style={[styles.version, { color: colors.icon }]}>Wersja 1.0.0</Text>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {},
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  profileSubtext: {
    fontSize: 14,
  },
  divider: {
    height: 1,
  },
  section: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 16,
  },
  badge: {
    backgroundColor: "#0a7ea4",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  version: {
    textAlign: "center",
    marginVertical: 10,
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
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 8,
  },
});

export default ProfileZone;