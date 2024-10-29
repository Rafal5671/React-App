import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { TextInput } from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const ProfileScreen: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === "dark";
  const themeColors = isDarkMode ? Colors.dark : Colors.light;
  const router = useRouter();
  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {isLoggedIn ? (
        <View>
          <Text style={[styles.text, { color: themeColors.text }]}>
            User Profile
          </Text>
          <TouchableOpacity>
            <Text style={[styles.logoutText, { color: themeColors.tint }]}>
              Wyloguj się
            </Text>
          </TouchableOpacity>
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
});

export default ProfileScreen;
