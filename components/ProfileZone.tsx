import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { Avatar, List, Divider, Text } from "react-native-paper";
import { Colors } from "@/constants/Colors";

const ProfileZone = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[styles.profileSection, { backgroundColor: colors.background }]}
      >
        <Avatar.Text
          size={64}
          label="JK"
          style={[styles.avatar, { backgroundColor: colors.tint }]}
        />
        <Text style={[styles.profileName, { color: colors.text }]}>
          Jan Kowalski
        </Text>
        <Text style={[styles.profileSubtext, { color: colors.icon }]}>
          Dane konta i ustawienia
        </Text>
      </View>

      <Divider style={[styles.divider, { backgroundColor: colors.icon }]} />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Zakupy
        </Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
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

      <Divider style={styles.divider} />

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

      <TouchableOpacity activeOpacity={0.8} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Wyloguj się</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.icon }]}>Wersja 1.0.0</Text>
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
    backgroundColor: "#FF5A5F",
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
