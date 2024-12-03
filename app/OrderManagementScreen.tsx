import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ScrollView
} from "react-native";
import { Product } from "@/types/Product";
import { Stack } from "expo-router";
import { CONFIG } from "@/constants/config";
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "expo-router";

const issueTypes = [
  { label: 'Brak produktu', value: 'NO_PRODUCT' },
  { label: 'Uszkodzony produkt', value: 'DAMAGED_PRODUCT' },
  { label: 'Błąd w danych zamówienia', value: 'INCORRECT_DATA' },
  { label: 'Inny', value: 'ANOTHER' },
];

const OrderManagementScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedIssueType, setSelectedIssueType] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isMissingModalVisible, setMissingModalVisible] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [missingType, setMissingType] = useState('');
  const [products, setProducts] = useState([]);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://${CONFIG.serverIp}/api/order/all`); // Zmień URL na odpowiedni
        if (!response.ok) {
          throw new Error('Nie udało się załadować zamówień');
        }
        const data = await response.json();

        // Sortowanie zamówień według daty
        const sortedOrders = data.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        Alert.alert('Błąd', error.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http:///${CONFIG.serverIp}/api/products/dto`
        );
        if (!response.ok) {
          throw new Error('Nie udało się załadować produktów');
        }
        const data = await response.json();

        // Sortowanie produktów według ID
        const sortedProducts = data.sort((a, b) => a.id - b.id);
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Błąd', 'Nie udało się załadować produktów');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`http://${CONFIG.serverIp}/api/logout`, {
        method: "GET",
        credentials: "include",
      });
      logout(); // Use logout function from AuthContext
      Alert.alert("Success", "Logged out successfully!");
      router.replace("/profile"); // Redirect to ProfileScreen
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  // Aktualizacja statusu zamówienia
  const updateOrderStatus = async (id, newState) => {
    try {
      const response = await fetch(
        `http://${CONFIG.serverIp}/api/order/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: newState }),
        }
      );
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

  // Zgłaszanie braków produktów
  const reportMissingProduct = async () => {
    if (selectedProductIds.length === 0 || !missingType) {
      Alert.alert('Błąd', 'Wybierz co najmniej jeden produkt i typ braku.');
      return;
    }

    let newQuantityState;
    if (missingType === 'ProductMissing') {
      newQuantityState = 'NONE';
    } else if (missingType === 'LowStock') {
      newQuantityState = 'FEW';
    } else {
      Alert.alert('Błąd', 'Nieprawidłowy typ braków.');
      return;
    }

    const productsToUpdate = selectedProductIds.map((productId) => ({
      id: productId.toString(),
      quantityType: newQuantityState,
    }));

    try {
      const response = await fetch(`http://${CONFIG.serverIp}/api/products/quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productsToUpdate),
      });

      if (!response.ok) {
        throw new Error('Nie udało się zaktualizować stanów produktów');
      }
      Alert.alert('Sukces', 'Stany produktów zostały zaktualizowane.');

      // Reset formularza i stanu
      setSelectedProductIds([]);
      setMissingType('');
      setMissingModalVisible(false);
    } catch (error) {
      console.error('Error updating product quantities:', error);
      Alert.alert('Błąd', 'Nie udało się zaktualizować stanów produktów.');
    }
  };

  // Zgłaszanie nieścisłości
const reportIssue = async () => {
  if (!selectedOrderId || !selectedIssueType) {
    Alert.alert('Błąd', 'Wybierz zamówienie i typ nieścisłości.');
    return;
  }

  if (!customMessage.trim()) {
    Alert.alert('Błąd', 'Opis nieścisłości jest wymagany.');
    return;
  }

  try {
    const response = await fetch(
      `http://${CONFIG.serverIp}/api/order/${selectedOrderId}/add-issue`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderIssueType: selectedIssueType,
          description: customMessage.trim(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Nie udało się zaktualizować problemu w zamówieniu');
    }

    const updatedOrder = await response.json();

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrderId ? updatedOrder : order
      )
    );

    Alert.alert(
      'Sukces',
      `Problem dla zamówienia został zaktualizowany na: ${selectedIssueType}`
    );
    setModalVisible(false);
  } catch (error) {
    console.error('Error updating order issue:', error);
    Alert.alert(
      'Błąd',
      'Nie udało się zaktualizować problemu w zamówieniu.'
    );
  }
};


  // Renderowanie pojedynczego zamówienia
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderText}>
        <Text style={styles.bold}>ID:</Text> {item.id}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.bold}>Data zamówienia:</Text> {new Date(item.orderDate).toLocaleString()}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.bold}>Status:</Text> {item.state}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.bold}>Data wysyłki:</Text>{' '}
        {item.shipDate ? new Date(item.shipDate).toLocaleString() : 'Nie wysłano'}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.bold}>Typ dostawy:</Text> {item.deliveryType}
      </Text>
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

  if (loadingOrders) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Ładowanie zamówień...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>Zarządzanie Zamówieniami</Text>
        <FlatList
          data={orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.list}
        />
        <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.floatingButtonText}>Zgłoś nieścisłości</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryFloatingButton}
          onPress={() => setMissingModalVisible(true)}
        >
          <Text style={styles.floatingButtonText}>Zgłoś braki</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Wyloguj</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Zgłoś Nieścisłość</Text>

              <Text style={styles.modalLabel}>Wybierz zamówienie:</Text>
              <Picker
                selectedValue={selectedOrderId}
                onValueChange={(itemValue) => setSelectedOrderId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Wybierz zamówienie" value={null} />
                {orders.map((order) => (
                  <Picker.Item key={order.id} label={`Zamówienie ${order.id}`} value={order.id} />
                ))}
              </Picker>

              <Text style={styles.modalLabel}>Typ nieścisłości:</Text>
              <Picker
                selectedValue={selectedIssueType}
                onValueChange={(itemValue) => setSelectedIssueType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Wybierz typ nieścisłości" value="" />
                {issueTypes.map((issueType) => (
                  <Picker.Item
                    key={issueType.value}
                    label={issueType.label}
                    value={issueType.value}
                  />
                ))}
              </Picker>

              <Text style={styles.modalLabel}>Wiadomość:</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                value={customMessage}
                onChangeText={setCustomMessage}
                placeholder="Wpisz szczegóły..."
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Anuluj</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={reportIssue}>
                  <Text style={styles.buttonText}>Wyślij</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal zgłaszania braków */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isMissingModalVisible}
          onRequestClose={() => setMissingModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Zgłoś Braki</Text>

              {loadingProducts ? (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" color="#0000ff" />
                  <Text>Ładowanie produktów...</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.modalLabel}>Wybierz produkty:</Text>
                  <View style={styles.productListContainer}>
                    <ScrollView style={{ maxHeight: 200 }}>
                      {products.map((product) => (
                        <TouchableOpacity
                          key={product.id}
                          style={[
                            styles.productItem,
                            selectedProductIds.includes(product.id) && styles.selectedProductItem,
                          ]}
                          onPress={() => {
                            if (selectedProductIds.includes(product.id)) {
                              setSelectedProductIds(
                                selectedProductIds.filter((id) => id !== product.id)
                              );
                            } else {
                              setSelectedProductIds([...selectedProductIds, product.id]);
                            }
                          }}
                        >
                          <Text style={styles.productLabel}>
                            [{product.id}] {product.productName}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <Text style={styles.modalLabel}>Typ braków:</Text>
                  <Picker
                    selectedValue={missingType}
                    onValueChange={(itemValue) => setMissingType(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Wybierz typ braków" value="" />
                    <Picker.Item label="Brak produktu" value="ProductMissing" />
                    <Picker.Item label="Pozostało mało sztuk" value="LowStock" />
                  </Picker>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setMissingModalVisible(false)}
                    >
                      <Text style={styles.buttonText}>Anuluj</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton} onPress={reportMissingProduct}>
                      <Text style={styles.buttonText}>Wyślij</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </>
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
  logoutButton: {
    position: "absolute",
    right: 20,
    top: 40, // Ustaw przycisk w odpowiednim miejscu, np. w prawym górnym rogu
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
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
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  secondaryFloatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    backgroundColor: '#FFC107',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    marginVertical: 5,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#5cb85c',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  productListContainer: {
    marginBottom: 10,
  },
  productItem: {
    padding: 10,
    borderRadius: 5,
  },
  selectedProductItem: {
    backgroundColor: '#e0e0e0',
  },
  productLabel: {
    fontSize: 16,
  },
});

export default OrderManagementScreen;
