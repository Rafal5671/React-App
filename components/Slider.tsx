import React, { useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";

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
  const flatListRef = useRef<FlatList<Slide>>(null);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  const onMomentumScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (viewportWidth * 0.75));
    scrollToIndex(index);
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <ImageBackground
      source={{ uri: "https://via.placeholder.com/150" }}
      style={styles.slide}
      imageStyle={{ borderRadius: 10 }}
    />
  );

  return (
    <FlatList
      ref={flatListRef}
      data={DATA}
      renderItem={renderItem}
      keyExtractor={(item) => item.title}
      horizontal
      pagingEnabled={false}
      showsHorizontalScrollIndicator={false}
      style={styles.carousel}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      onMomentumScrollEnd={onMomentumScrollEnd}
      snapToInterval={viewportWidth * 0.75}
      decelerationRate="fast"
    />
  );
};

const styles = StyleSheet.create({
  carousel: {
    height: 200,
    marginBottom: 8
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
