import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme
} from "react-native";
import { Avatar, List, Divider, Text, IconButton } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import ProfileOrders from "@/components/ProfileOrders"; // Import ProfileOrders
import ProfileComments from "@/components/ProfileComments"; // Import ProfileComments

interface User {
  name: string;
  lastName: string;
  email: string;
}

interface ProfileZoneProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: "regulations" | "aboutUs") => void;
}

const ProfileZone: React.FC<ProfileZoneProps> = ({ user, onLogout, onNavigate }) => {
  const [view, setView] = useState<"profile" | "orders" | "comments">("profile");
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {view === "orders" && user ? (
        <ProfileOrders
          userEmail={user.email}
          onBack={() => setView("profile")} // Powrót do widoku głównego
        />
      ) : view === "comments" && user ? (
        <ProfileComments
          userEmail={user.email} // Pass userEmail here
          onBack={() => setView("profile")}
        />
      ) : (
        <>
          {/* Główny widok profilu */}
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

          {/* Sekcja zakupów */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Zakupy</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setView("orders")}>
              <List.Item
                title="Zamówienia"
                titleStyle={{ color: colors.text }}
                left={() => <List.Icon icon="clipboard-list" color={colors.icon} />}
                right={() => <List.Icon icon="chevron-right" color={colors.icon} />}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setView("comments")}>
              <List.Item
                title="Opinie"
                titleStyle={{ color: colors.text }}
                left={() => <List.Icon icon="star-outline" color={colors.icon} />}
                right={() => <List.Icon icon="chevron-right" color={colors.icon} />}
              />
            </TouchableOpacity>
          </View>

          <Divider style={[styles.divider, { backgroundColor: colors.icon }]} />

          {/* Sekcja pomocy */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Pomoc</Text>

            <TouchableOpacity activeOpacity={0.8} onPress={() => onNavigate("regulations")}>
              <List.Item
                title="Regulamin"
                titleStyle={{ color: colors.text }}
                left={() => (
                  <List.Icon icon="help-circle-outline" color={colors.icon} />
                )}
                right={() => <List.Icon icon="chevron-right" color={colors.icon} />}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => onNavigate("aboutUs")}>
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

          {/* Przycisk wylogowania */}
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
});

export default ProfileZone;
