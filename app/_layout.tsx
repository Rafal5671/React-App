import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { StripeProvider } from '@stripe/stripe-react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load fonts
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Debugging font loading
  console.log('Fonts loaded:', fontsLoaded);

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      } else {
        console.log('Waiting for fonts to load...');
      }
    }

    prepare();
  }, [fontsLoaded]);


  if (!fontsLoaded) {
    return null; // Prevent rendering until fonts are loaded
  }

  return (
    <AuthProvider>
      <CartProvider>
        <GestureHandlerRootView>
          <StripeProvider publishableKey="your-publishable-key">
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
