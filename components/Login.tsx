import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, TextInput, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { Colors } from "@/constants/Colors";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const themeColors = isDarkMode ? Colors.dark : Colors.light;
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await fetch(`http:///192.168.100.9:8082/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(response);

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Login successful!");
        const { user, basketId } = data;
        login(user, basketId);
      } else {
        Alert.alert("Error", data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Unable to login. Please try again later.");
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={[styles.title, { color: themeColors.text }]}>Logowanie</Text>
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
        <Text style={[styles.forgotPasswordText, { color: themeColors.tint }]}>Nie pamiętasz hasła?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: themeColors.tint }]}
        onPress={handleLogin}  // Call the handleLogin function when login button is pressed
      >
        <Text style={[styles.loginText, { color: themeColors.background }]}>Zaloguj się</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    marginTop: "15%",
    width: "100%",
    padding: 16,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
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
  loginText: {
    fontWeight: "bold",
  },
});

export default Login;
