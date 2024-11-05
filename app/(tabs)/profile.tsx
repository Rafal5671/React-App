import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Image,
} from "react-native";
import { TextInput } from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import ProfileZone from "@/components/ProfileZone";
const ProfileScreen: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === "dark";
  const themeColors = isDarkMode ? Colors.dark : Colors.light;
  const router = useRouter();
  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {isLoggedIn ? (
        <View style={{ flex: 1, width: "100%" }}>
          <ProfileZone />
        </View>
      ) : (
        <View style={styles.loginContainer}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Logowanie
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: themeColors.icon,
                backgroundColor: themeColors.background,
                color: themeColors.text,
              },
            ]}
            placeholder="Adres e-mail"
            placeholderTextColor={isDarkMode ? "#9BA1A6" : "#687076"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[
              styles.input,
              {
                borderColor: themeColors.icon,
                backgroundColor: themeColors.background,
                color: themeColors.text,
              },
            ]}
            placeholder="Hasło"
            placeholderTextColor={isDarkMode ? "#9BA1A6" : "#687076"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity>
            <Text
              style={[styles.forgotPasswordText, { color: themeColors.tint }]}
            >
              Nie pamiętasz hasła?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: themeColors.tint }]}
          >
            <Text style={[styles.loginText, { color: themeColors.background }]}>
              Zaloguj się
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoggedIn && (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[styles.registerButton, { borderColor: themeColors.icon }]}
            onPress={() => router.push("/register")}
          >
            <Text style={[styles.registerText, { color: themeColors.text }]}>
              Zarejestruj się
            </Text>
          </TouchableOpacity>
          <Text style={[styles.infoText, { color: themeColors.icon }]}>
            Dlaczego warto mieć konto?
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  loginContainer: {
    marginTop: "15%",
    width: "100%",
    padding: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  forgotPasswordText: {
    textAlign: "right",
    marginBottom: 12,
  },
  loginButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: "10%",
  },
  registerButton: {
    marginTop: 20,
    padding: 12,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
  loginText: {
    fontWeight: "bold",
  },
  registerText: {
    fontWeight: "bold",
  },
  infoText: {
    marginTop: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 18,
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileSubText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  sectionContainer: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  menuText: {
    fontSize: 16,
  },
  notificationBadge: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  notificationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 16,
    alignItems: "center",
  },
  versionText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
});

export default ProfileScreen;
