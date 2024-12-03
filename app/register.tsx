import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter, Stack } from "expo-router";
import { Checkbox, IconButton } from "react-native-paper";
import { CONFIG } from "@/constants/config";
import Terms from "@/components/Terms"; // Import Terms component

const RegisterScreen: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [dataConsent, setDataConsent] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"register" | "terms">("register"); // Add this state
  const colorScheme = useColorScheme();
  const router = useRouter();

  const isDarkMode = colorScheme === "dark";
  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  const handleRegister = async () => {
    // Basic validation
    if (password !== confirmPassword) {
      alert("Hasła nie są zgodne!");
      return;
    }

    if (!acceptTerms || !dataConsent) {
      alert("Proszę zaakceptować regulamin i wyrazić zgodę na przetwarzanie danych.");
      return;
    }

    // Prepare user data
    const userData = {
      name: firstName,
      lastName: lastName,
      email: email,
      phone: phoneNumber,
      password: password,
    };

    try {
      const response = await fetch(`http://${CONFIG.serverIp}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // If the user is successfully registered, navigate to the profile screen
        alert("Rejestracja zakończona sukcesem!");
        router.push("/profile");
      } else {
        // If there's an error with the registration, show it
        alert(data.message || "Wystąpił błąd podczas rejestracji.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Wystąpił błąd. Spróbuj ponownie.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {currentView === "register" ? (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Rejestracja
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: themeColors.icon, color: themeColors.text, backgroundColor: themeColors.background }
            ]}
            placeholder="Imię"
            placeholderTextColor={isDarkMode ? "#9BA1A6" : "#687076"}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: themeColors.icon, color: themeColors.text, backgroundColor: themeColors.background }
            ]}
            placeholder="Nazwisko"
            placeholderTextColor={isDarkMode ? "#9BA1A6" : "#687076"}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: themeColors.icon, color: themeColors.text, backgroundColor: themeColors.background }
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
              { borderColor: themeColors.icon, color: themeColors.text, backgroundColor: themeColors.background }
            ]}
            placeholder="Numer telefonu"
            placeholderTextColor={isDarkMode ? "#9BA1A6" : "#687076"}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: themeColors.icon, color: themeColors.text, backgroundColor: themeColors.background }
            ]}
            placeholder="Hasło"
            placeholderTextColor={isDarkMode ? "#9BA1A6" : "#687076"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: themeColors.icon, color: themeColors.text, backgroundColor: themeColors.background }
            ]}
            placeholder="Potwierdź hasło"
            placeholderTextColor={isDarkMode ? "#9BA1A6" : "#687076"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* Checkbox for Terms and Conditions */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <Text style={[styles.checkboxLabel, { color: themeColors.text }]}>
              Akceptuję{" "}
              <Text
                style={[styles.linkText, { color: "#007AFF" }]}
                onPress={() => setCurrentView("terms")} // Navigate to Terms view
              >
                regulamin
              </Text>
            </Text>
            <Checkbox.Android
              status={acceptTerms ? "checked" : "unchecked"}
              onPress={() => setAcceptTerms(!acceptTerms)}
              color={themeColors.tint}
            />
          </TouchableOpacity>

          {/* Checkbox for Data Processing Consent */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setDataConsent(!dataConsent)}
          >
            <Text style={[styles.checkboxLabel, { color: themeColors.text }]}>
              Wyrażam zgodę na przetwarzanie danych
            </Text>
            <Checkbox.Android
              status={dataConsent ? "checked" : "unchecked"}
              onPress={() => setDataConsent(!dataConsent)}
              color={themeColors.tint}
            />
          </TouchableOpacity>

          {/* Register Button at Bottom */}
          <TouchableOpacity
            style={[styles.registerButton, { backgroundColor: themeColors.tint }]}
            onPress={handleRegister}
          >
            <Text style={[styles.registerButtonText, { color: themeColors.background }]}>
              Zarejestruj się
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Show Terms component when currentView is "terms"
        <Terms onBack={() => setCurrentView("register")} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  checkboxContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
    justifyContent: "flex-end",
  },
  checkboxLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  linkText: {
    textDecorationLine: "underline",
  },
  registerButton: {
    position: "absolute",
    bottom: 20, // Distance from the bottom of the screen
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  registerButtonText: {
    fontWeight: "bold",
  },
});

export default RegisterScreen;
