import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
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

const ShopsDelivery: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch shop data from the backend API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('http://192.168.100.8:8082/api/shop'); // Replace with your backend IP if needed
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

  return (
    <View style={styles.mapContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.tint} />
      ) : (
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
            >
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{store.street}</Text>
                  <Text style={styles.calloutText}>{store.city}, {store.postalCode}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    marginTop: 16,
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
});

export default ShopsDelivery;
