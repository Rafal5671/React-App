import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Alert,useColorScheme } from "react-native";
import { Button, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext"; // Assume AuthContext is available
import { Colors } from "@/constants/Colors";
import {CONFIG} from "@/constants/config";
interface OpinionProps {
  productId: string;
  onOpinionAdded: () => void; // Function to refresh the comment list
}

const Opinion: React.FC<OpinionProps> = ({ productId, onOpinionAdded }) => {
  const { user } = useAuth(); // Check if the user is logged in
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [existingOpinion, setExistingOpinion] = useState<any>(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const colors = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    // Fetch the user's existing opinion for this product
    const fetchUserOpinion = async () => {
      try {
        const response = await fetch(
          `http:///${CONFIG.serverIp}/api/comments/product/${productId}`
        );
        if (!response.ok) throw new Error("Failed to fetch comments");
        const data = await response.json();
        const userOpinion = data.find((comment: any) => comment.username === user?.name);
        if (userOpinion) {
          setExistingOpinion(userOpinion);
          setRating(userOpinion.rating);
          setComment(userOpinion.description);
        }
      } catch (error) {
        console.error("Error fetching user opinion:", error);
      }
    };


    if (user) {
      fetchUserOpinion();
    }
  }, [user, productId]);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert("Błąd", "Ocena musi być w zakresie od 1 do 5");
      return;
    }
    if (comment.trim() === "") {
      Alert.alert("Błąd", "Komentarz nie może być pusty");
      return;
    }

    setLoading(true);

    try {
      const url = isEditing
        ? `http:///${CONFIG.serverIp}/api/comments/${existingOpinion.id}` // Endpoint for editing
        : `http:///${CONFIG.serverIp}/api/comments`; // Endpoint for creating
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          userId: user?.id,
          rating,
          description: comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Nie udało się dodać lub zaktualizować opinii");
      }

      Alert.alert(
        "Sukces",
        isEditing ? "Twoja opinia została zaktualizowana" : "Twoja opinia została dodana"
      );

      // Refresh the user opinion after saving
      const updatedOpinionResponse = await fetch(
        `http:///${CONFIG.serverIp}/api/comments/product/${productId}`
      );
      if (!updatedOpinionResponse.ok) throw new Error("Failed to fetch updated comment");
      const updatedData = await updatedOpinionResponse.json();
      const updatedOpinion = updatedData.find(
        (comment: any) => comment.username === user?.name
      );
      setExistingOpinion(updatedOpinion); // Update the state with the latest opinion
      setRating(updatedOpinion.rating);
      setComment(updatedOpinion.description);

      setIsEditing(false);
      onOpinionAdded(); // Refresh the comments in the parent component
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się dodać lub zaktualizować opinii");
    } finally {
      setLoading(false);
    }
  };


  if (!user) {
    return null; // Do not render if the user is not logged in
  }

  if (existingOpinion && !isEditing) {
    // Display user's existing opinion with "Edit" button
    return (
      <View style={styles.existingOpinionContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Twoja opinia:</Text>
        <View style={styles.stars}>
          {Array.from({ length: 5 }, (_, index) => (
            <MaterialCommunityIcons
              key={index}
              name={index < existingOpinion.rating ? "star" : "star-outline"}
              size={32}
              color="#FFD700"
            />
          ))}
        </View>
        <Text style={{ color: colors.text, marginBottom: 16 }}>
          {existingOpinion.description}
        </Text>
        <Button
          mode="outlined"
          onPress={() => setIsEditing(true)}
          style={[styles.button, { borderColor: colors.tint }]}
          labelStyle={{ color: colors.tint }}
        >
          Edytuj
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {isEditing ? "Edytuj swoją opinię" : "Dodaj opinię"}
      </Text>

      <View style={styles.stars}>
        {Array.from({ length: 5 }, (_, index) => (
          <MaterialCommunityIcons
            key={index}
            name={index < rating ? "star" : "star-outline"}
            size={32}
            color="#FFD700"
            onPress={() => setRating(index + 1)}
          />
        ))}
      </View>

      <TextInput
        style={[styles.textInput, { color: colors.text, borderColor: colors.tint }]}
        value={comment}
        onChangeText={setComment}
        placeholder="Napisz swoją opinię..."
        placeholderTextColor="#888"
        multiline
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        style={[styles.button, { backgroundColor: colors.tint }]}
        labelStyle={{ color: colors.background }}
      >
        {isEditing ? "Zapisz" : "Dodaj opinię"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  existingOpinionContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  stars: {
    flexDirection: "row",
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    alignSelf: "flex-end",
  },
});

export default Opinion;
