import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Colors } from '@/constants/Colors';

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

const ShopsDelivery: React.FC<ShopsDeliveryProps> = ({ onStoreSelect }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Fetch shop data from the backend API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('http://192.168.100.8:8082/api/shop');
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
      onStoreSelect(selectedStore);
    }
  };

  return (
    <View style={styles.mapContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.tint} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 52.2297,
              longitude: 21.0122,
              latitudeDelta: 5,
              longitudeDelta: 5,
            }}
          >
            {stores.map((store) => (
              <Marker
                key={store.id}
                coordinate={{ latitude: store.latitude, longitude: store.longitude }}
                onPress={() => handleStorePress(store)}
              >
                <Callout>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{store.street}</Text>
                    <Text style={styles.calloutText}>
                      {store.city}, {store.postalCode}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          {selectedStore && (
            <View style={styles.selectedStoreContainer}>
              <Text style={styles.selectedStoreTitle}>Wybrany sklep:</Text>
              <Text style={styles.selectedStoreText}>
                {selectedStore.street}, {selectedStore.city}, {selectedStore.postalCode}
              </Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelectStore}
              >
                <Text style={styles.selectButtonText}>Wybierz ten sklep</Text>
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
    backgroundColor: Colors.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShopsDelivery;