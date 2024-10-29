import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { TextInput } from "react-native";
import { useAuth } from "@/context/AuthContext";
const ProfileScreen: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === "dark";

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {isLoggedIn ? (
        <View>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            User Profile
          </Text>
          <TouchableOpacity>
            <Text
              style={[styles.logoutText, isDarkMode && styles.darkLogoutText]}
            >
              Wyloguj się
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loginContainer}>
          <Text style={[styles.title, isDarkMode && styles.darkTitle]}>
            Logowanie
          </Text>
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Adres e-mail"
            placeholderTextColor={isDarkMode ? "lightgray" : "gray"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Hasło"
            placeholderTextColor={isDarkMode ? "lightgray" : "gray"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Nie pamiętasz hasła?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginText}>Zaloguj się</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerText}>Zarejestruj się</Text>
        </TouchableOpacity>
        <Text style={styles.infoText}>Dlaczego warto mieć konto?</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#000",
  },
  darkContainer: {
    backgroundColor: "#000",
  },
  title: {
    fontSize: 30,
    color: "white",
    marginBottom: 20,
  },
  darkTitle: {
    color: "white",
  },
  loginContainer: {
    marginTop:"15%",
    width: "100%",
    padding: 16,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#1E1E1E",
    color: "white",
  },
  darkInput: {
    borderColor: "lightgray",
  },
  forgotPasswordText: {
    color: "lightblue",
    textAlign: "right",
    marginBottom: 12,
  },
  loginButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "gray",
    borderRadius: 10,
    alignItems: "center",
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom:"10%"
  },
  registerButton: {
    marginTop: 20,
    padding: 12,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    width: '90%',
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
  },
  registerText: {
    color: "white",
    fontWeight: "bold",
  },
  infoText: {
    marginTop: 10,
    color: "lightgray",
    textAlign: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    color: "black",
  },
  darkText: {
    color: "white",
  },
  logoutText: {
    fontSize: 18,
    color: "blue",
    marginTop: 20,
  },
  darkLogoutText: {
    color: "lightblue",
  },
});

export default ProfileScreen;
