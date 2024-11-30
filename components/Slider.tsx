import React from "react";
import { Dimensions, StyleSheet, ScrollView, View, ImageBackground } from "react-native";

const { width: viewportWidth } = Dimensions.get("window");

interface Slide {
  title: string;
  color: string;
}

const DATA: Slide[] = [
  { title: "Slide 1", color: "#ff9999" },
  { title: "Slide 2", color: "#99ff99" },
  { title: "Slide 3", color: "#9999ff" },
];

const CarouselSlider: React.FC = () => {
  return (
    <ScrollView
      horizontal
      pagingEnabled={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carousel}
      snapToInterval={viewportWidth * 0.75}
      decelerationRate="fast"
    >
      {DATA.map((item, index) => (
        <View key={index} style={[styles.slide]}>
          <ImageBackground
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.slide}
            imageStyle={{ borderRadius: 10 }}
          >
          </ImageBackground>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  carousel: {
    paddingHorizontal: 20,
    height: 200,
  },
  slide: {
    width: viewportWidth * 0.75,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    padding: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default CarouselSlider;
