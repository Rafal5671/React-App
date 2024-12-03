import React, { useEffect, useState } from "react";
import { View, StyleSheet, useColorScheme, Alert, TouchableOpacity, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import ProfileZone from "@/components/ProfileZone";
import Regulations from "@/components/Regulations"; // Import Regulations component
import AboutUs from "@/components/AboutUs"; // Import AboutUs component
import Login from "@/components/Login";
import { useAuth } from "@/context/AuthContext";
import { CONFIG } from "@/constants/config";

const ProfileScreen: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth(); // Use AuthContext
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const themeColors = isDarkMode ? Colors.dark : Colors.light;
  const router = useRouter();

  const [currentView, setCurrentView] = useState<"profile" | "regulations" | "aboutUs">("profile");

  useEffect(() => {
    if (isLoggedIn && user?.userType === "WORKER") {
      router.replace("/OrderManagementScreen");
    }
  }, [isLoggedIn, user, router]);

  const handleLogout = async () => {
    try {
      await fetch(`http://${CONFIG.serverIp}/api/logout`, {
        method: "GET",
        credentials: "include",
      });
      logout(); // Use logout from AuthContext
      Alert.alert("Sukces", "Wylogowano pomyślnie!");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Błąd", "Nie udało się wylogować.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {isLoggedIn ? (
        currentView === "profile" ? (
          <View style={{ flex: 1, width: "100%" }}>
            <ProfileZone
              user={user}
              onLogout={handleLogout}
              onNavigate={setCurrentView} // Pass the navigation function
            />
          </View>
        ) : currentView === "regulations" ? (
          <Regulations onBack={() => setCurrentView("profile")} />
        ) : currentView === "aboutUs" ? (
          <AboutUs onBack={() => setCurrentView("profile")} />
        ) : null
      ) : (
        <Login />
      )}

      {!isLoggedIn && (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[styles.registerButton, { borderColor: themeColors.icon }]}
            onPress={() => router.push("/register")}
          >
            <Text style={[styles.registerText, { color: themeColors.text }]}>Zarejestruj się</Text>
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
  registerText: {
    fontWeight: "bold",
  },
  infoText: {
    marginTop: 10,
    textAlign: "center",
  },
});

export default ProfileScreen;
