import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Product } from "@/types/Product";
import { Stack } from "expo-router";

const issueTypes = [
  { label: "Brak produktu", value: "ProductMissing" },
  { label: "Uszkodzony produkt", value: "ProductDamaged" },
  { label: "Błąd w danych zamówienia", value: "DataError" },
  { label: "Inny", value: "Other" },
];

const OrderManagementScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedIssueType, setSelectedIssueType] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isMissingModalVisible, setMissingModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [missingType, setMissingType] = useState(""); // 'ProductMissing' or 'LowStock'
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://192.168.1.101:8082/api/order/all"); // Zmień URL na odpowiedni
        if (!response.ok) {
          throw new Error("Nie udało się załadować zamówień");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        Alert.alert("Błąd", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http:///192.168.1.101:8082/api/products/dto`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products. Please check your network connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  // Update order status
  const updateOrderStatus = async (id, newState) => {
    try {
      const response = await fetch(
        `http://192.168.1.101:8082/api/order/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: newState }),
        }
      );

      if (!response.ok) {
        throw new Error("Nie udało się zaktualizować statusu zamówienia");
      }

      const updatedOrder = await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id
            ? { ...order, state: newState, ...updatedOrder }
            : order
        )
      );

      Alert.alert(
        "Sukces",
        `Zamówienie zostało zaktualizowane do stanu: ${newState}`
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      Alert.alert("Błąd", "Nie udało się zaktualizować statusu zamówienia");
    }
  };
  const reportMissingProduct = () => {
    if (!selectedProductId || !missingType) {
      Alert.alert("Błąd", "Wybierz produkt i typ braku.");
      return;
    }

    const missingDetails = {
      productId: selectedProductId,
      issueType: missingType,
    };

    console.log("Zgłoszono braki:", missingDetails);
    Alert.alert("Zgłoszenie wysłane", "Dziękujemy za zgłoszenie braków.");

    // Reset formularza
    setSelectedProductId(null);
    setMissingType("");
    setMissingModalVisible(false);
  };

  const reportIssue = () => {
    if (!selectedOrderId || !selectedIssueType) {
      Alert.alert("Błąd", "Wybierz zamówienie i typ nieścisłości.");
      return;
    }

    if (!customMessage.trim()) {
      Alert.alert("Błąd", "Opis nieścisłości jest wymagany.");
      return;
    }

    const issueDetails = {
      orderId: selectedOrderId,
      issueType: selectedIssueType,
      message: customMessage,
    };

    // Symulacja wysyłania zgłoszenia
    console.log("Zgłoszono nieścisłość:", issueDetails);
    Alert.alert("Zgłoszenie wysłane", "Dziękujemy za zgłoszenie nieścisłości.");

    // Resetowanie formularza
    setSelectedOrderId(null);
    setSelectedIssueType("");
    setCustomMessage("");
    setModalVisible(false);
  };

  // Kod do zgłoszenia nieścisłości i modal pozostaje taki sam

  // Render pojedyncze zamówienie
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderText}>
        <Text style={styles.bold}>ID:</Text> {item.id}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.bold}>Data zamówienia:</Text>{" "}
        {new Date(item.orderDate).toLocaleString()}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.bold}>Status:</Text> {item.state}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.bold}>Data wysyłki:</Text>{" "}
        {item.shipDate
          ? new Date(item.shipDate).toLocaleString()
          : "Nie wysłano"}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.bold}>Typ dostawy:</Text> {item.deliveryType}
      </Text>
      <View style={styles.actions}>
        {item.state === "PENDING" && (
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={() => updateOrderStatus(item.id, "CONFIRMED")}
          >
            <Text style={styles.buttonText}>Potwierdź</Text>
          </TouchableOpacity>
        )}
        {item.state === "CONFIRMED" && (
          <TouchableOpacity
            style={[styles.button, styles.shipButton]}
            onPress={() => updateOrderStatus(item.id, "SHIPPED")}
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
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>Zarządzanie Zamówieniami</Text>
        <FlatList
          data={orders.sort(
            (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.list}
        />
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.floatingButtonText}>Zgłoś nieścisłości</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryFloatingButton}
          onPress={() => setMissingModalVisible(true)}
        >
          <Text style={styles.floatingButtonText}>Zgłoś braki</Text>
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

              {/* Wybór zamówienia */}
              <Text style={styles.modalLabel}>Wybierz zamówienie:</Text>
              <Picker
                selectedValue={selectedOrderId}
                onValueChange={(itemValue) => setSelectedOrderId(itemValue)}
                style={styles.picker}
              >
                {orders.map((order) => (
                  <Picker.Item
                    key={order.id}
                    label={`Zamówienie ${order.id}`}
                    value={order.id}
                  />
                ))}
              </Picker>

              {/* Typ nieścisłości */}
              <Text style={styles.modalLabel}>Typ nieścisłości:</Text>
              <Picker
                selectedValue={selectedIssueType}
                onValueChange={(itemValue) => setSelectedIssueType(itemValue)}
                style={styles.picker}
              >
                {issueTypes.map((issueType) => (
                  <Picker.Item
                    key={issueType.value}
                    label={issueType.label}
                    value={issueType.value}
                  />
                ))}
              </Picker>

              {/* Dodatkowa wiadomość */}
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
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={reportIssue}
                >
                  <Text style={styles.buttonText}>Wyślij</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isMissingModalVisible}
          onRequestClose={() => setMissingModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Zgłoś Braki</Text>

              {/* Wybór produktu */}
              <Text style={styles.modalLabel}>Wybierz produkt:</Text>
              <Picker
                selectedValue={selectedProductId}
                onValueChange={(itemValue) => setSelectedProductId(itemValue)}
                style={styles.picker}
              >
                {products.map((product) => (
                  <Picker.Item
                    key={product.id}
                    label={`[${product.id}] ${product.productName}`}
                    value={product.id}
                  />
                ))}
              </Picker>

              {/* Typ braków */}
              <Text style={styles.modalLabel}>Typ braków:</Text>
              <Picker
                selectedValue={missingType}
                onValueChange={(itemValue) => setMissingType(itemValue)}
                style={styles.picker}
              >
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
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={reportMissingProduct}
                >
                  <Text style={styles.buttonText}>Wyślij</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  shipButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  secondaryFloatingButton: {
    position: "absolute",
    right: 20,
    bottom: 90, // Dodaj odpowiednią wartość, aby przycisk był wyżej niż pierwszy
    backgroundColor: "#FFC107",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  floatingButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    marginVertical: 5,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#5cb85c",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
});

export default OrderManagementScreen;
