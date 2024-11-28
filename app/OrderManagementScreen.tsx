import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

const OrderManagementScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://192.168.100.8:8082/api/order/all'); // Zmień URL na odpowiedni
        if (!response.ok) {
          throw new Error('Nie udało się załadować zamówień');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        Alert.alert('Błąd', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  // Update order status
  const updateOrderStatus = async (id, newState) => {
    try {
      const response = await fetch(`http://192.168.100.8:8082/api/order/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: newState }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się zaktualizować statusu zamówienia');
      }

      const updatedOrder = await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, state: newState, ...updatedOrder } : order
        )
      );

      Alert.alert('Sukces', `Zamówienie zostało zaktualizowane do stanu: ${newState}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Błąd', 'Nie udało się zaktualizować statusu zamówienia');
    }
  };

  // Render pojedyncze zamówienie
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderText}><Text style={styles.bold}>ID:</Text> {item.id}</Text>
      <Text style={styles.orderText}><Text style={styles.bold}>Data zamówienia:</Text> {new Date(item.orderDate).toLocaleString()}</Text>
      <Text style={styles.orderText}><Text style={styles.bold}>Status:</Text> {item.state}</Text>
      <Text style={styles.orderText}><Text style={styles.bold}>Data wysyłki:</Text> {item.shipDate ? new Date(item.shipDate).toLocaleString() : 'Nie wysłano'}</Text>
      <Text style={styles.orderText}><Text style={styles.bold}>Typ dostawy:</Text> {item.deliveryType}</Text>
      <View style={styles.actions}>
        {item.state === 'PENDING' && (
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={() => updateOrderStatus(item.id, 'CONFIRMED')}
          >
            <Text style={styles.buttonText}>Potwierdź</Text>
          </TouchableOpacity>
        )}
        {item.state === 'CONFIRMED' && (
          <TouchableOpacity
            style={[styles.button, styles.shipButton]}
            onPress={() => updateOrderStatus(item.id, 'SHIPPED')}
          >
            <Text style={styles.buttonText}>Wyślij</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zarządzanie Zamówieniami</Text>
      <FlatList
        data={orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  shipButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderManagementScreen;
