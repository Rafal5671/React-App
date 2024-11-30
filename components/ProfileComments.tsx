import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  useColorScheme
} from "react-native";
import { Text, IconButton, Divider, List } from "react-native-paper";
import { Colors } from "@/constants/Colors";

interface Comment {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  rating: number;
  description: string;
}

interface ProfileCommentsProps {
  userEmail: string; // Use userEmail to fetch comments
  onBack: () => void; // Function to go back to the profile
}

const ProfileComments: React.FC<ProfileCommentsProps> = ({ userEmail, onBack }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const colors = isDarkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    const fetchUserComments = async () => {
      setLoading(true); // Ensure loading state is set
      try {
        console.log(`Fetching comments for userEmail: ${userEmail}`);
        const response = await fetch(
          `http:///192.168.100.9:8082/api/comments/user/${userEmail}`
        );
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`HTTP Error: ${response.status} - ${errorDetails}`);
        }
        const data = await response.json();
        console.log(`Comments fetched successfully:`, data);

        setComments(data);
      } catch (error: unknown) { // specify the error type as unknown
        // Use type assertion to tell TypeScript the error is an instance of Error
        const typedError = error as Error;
        console.error("Error fetching user comments:", typedError);
        Alert.alert("Błąd", `Nie udało się załadować komentarzy. Szczegóły: ${typedError.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserComments();
  }, [userEmail]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={onBack}
        style={[styles.backButton, { tintColor: colors.text }]}
      />
      <Text style={[styles.title, { color: colors.text }]}>Twoje Komentarze</Text>
      {loading ? (
        <ActivityIndicator size="large" color={colors.tint} />
      ) : comments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: colors.text, fontSize: 16 }}>
            Nie masz jeszcze żadnych komentarzy.
          </Text>
        </View>
      ) : (
        comments.map((comment) => (
          <View key={comment.id}>
            <List.Item
              title={comment.productName}
              description={comment.description}
              left={() => (
                <List.Icon icon="star-outline" color="#FFD700" />
              )}
              right={() => (
                <View style={styles.ratingContainer}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <List.Icon
                      key={index}
                      icon={index < comment.rating ? "star" : "star-outline"}
                      color="#FFD700"
                    />
                  ))}
                </View>
              )}
            />
            <Divider style={styles.divider} />
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
  },
});

export default ProfileComments;
