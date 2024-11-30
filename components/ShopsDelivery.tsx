import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, ScrollView, useColorScheme, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Colors } from '@/constants/Colors';
import Svg, { Path } from 'react-native-svg';

interface Store {
  id: number;
  latitude: number;
  longitude: number;
  city: string;
  street: string;
  postalCode: string;
}

interface ShopsDeliveryProps {
  onStoreSelect: (store: Store) => void;
}

// Definicja komponentu PinIcon
const PinIcon = ({ color }) => (
  <Svg width={40} height={40} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
    />
  </Svg>
);

const ShopsDelivery: React.FC<ShopsDeliveryProps> = ({ onStoreSelect }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('Permission status:', status);
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Unable to access location. Using default location.');
          setLocation({ latitude: 52.2297, longitude: 21.0122 });
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        console.log('User location:', userLocation);
        setLocation({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        });
      } catch (error) {
        console.error('Error fetching location:', error);
        setLocation({ latitude: 52.2297, longitude: 21.0122 });
      }
    };

    getLocation();
  }, []);

  // Pobieranie danych sklepów z API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(`http://192.168.100.9:8082/api/shop`);
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleStorePress = (store: Store) => {
    setSelectedStore(store);
  };

  const handleSelectStore = () => {
    if (selectedStore) {
      setSelectedStoreId(selectedStore.id); // Aktualizuj ID wybranego sklepu
      onStoreSelect(selectedStore); // Przekaż wybrany sklep do nadrzędnego komponentu
    }
  };

  if (!location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={themeColors.tint} />
        <Text style={{ color: themeColors.text }}>Pobieranie lokalizacji...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={themeColors.tint} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <MapView
            style={styles.map}
             region={{
               latitude: location.latitude,
               longitude: location.longitude,
               latitudeDelta: 0.05,
               longitudeDelta: 0.05,
             }}
          >
            {stores.map((store) => {
              const isSelected = store.id === selectedStoreId;
              return (
                <Marker
                  key={store.id}
                  coordinate={{ latitude: store.latitude, longitude: store.longitude }}
                  onPress={() => handleStorePress(store)}
                >
                  <PinIcon color={isSelected ? 'blue' : 'red'} />
                  <Callout>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutTitle}>{store.street}</Text>
                      <Text style={styles.calloutText}>
                        {store.city}, {store.postalCode}
                      </Text>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>

          {selectedStore && (
            <View style={styles.selectedStoreContainer}>
              <Text style={styles.selectedStoreTitle}>Wybrany sklep:</Text>
              <Text style={styles.selectedStoreText}>
                {selectedStore.street}, {selectedStore.city}, {selectedStore.postalCode}
              </Text>
              <TouchableOpacity
                style={[styles.selectButton, { backgroundColor: themeColors.tint }]}
                onPress={handleSelectStore}
              >
                <Text style={[styles.selectButtonText, { color: themeColors.background }]}>
                  Wybierz ten sklep
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  map: {
    width: '100%',
    height: Dimensions.get('window').height / 2,
  },
  calloutContainer: {
    width: 200,
    padding: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calloutText: {
    fontSize: 14,
  },
  selectedStoreContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  selectedStoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedStoreText: {
    fontSize: 16,
    marginBottom: 16,
  },
  selectButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShopsDelivery;
