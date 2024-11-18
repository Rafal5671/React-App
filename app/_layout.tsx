import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { StripeProvider } from '@stripe/stripe-react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <GestureHandlerRootView>
         <StripeProvider publishableKey="pk_test_51PQtgQ03dG9DcKmUHYPxw5W8tRpSdhpIuHvWH5KRsSi7WXxvD32zFrpWTM43eBLZJfWWh7vbzrJi9rrO2BviI6pK00bBqaArZu">
           <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
             <Stack>
               <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
               <Stack.Screen name="success" options={{ headerShown: false }} />
               <Stack.Screen name="cancel" options={{ headerShown: false }} />
               <Stack.Screen name="+not-found" />
             </Stack>
           </ThemeProvider>
          </StripeProvider>
        </GestureHandlerRootView>
      </CartProvider>
    </AuthProvider>
  );
}
