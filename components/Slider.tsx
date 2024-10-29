import React, { useRef } from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList } from 'react-native';

const { width: viewportWidth } = Dimensions.get('window');

interface Slide {
  title: string;
  color: string;
}

const DATA: Slide[] = [
  { title: 'Slide 1', color: '#ff9999' },
  { title: 'Slide 2', color: '#99ff99' },
  { title: 'Slide 3', color: '#9999ff' },
];

const CarouselSlider: React.FC = () => {
  const flatListRef = useRef<FlatList<Slide>>(null);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  const onMomentumScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (viewportWidth * 0.75)); // Szerokość slajdu
    scrollToIndex(index); // Przewijanie do najbliższego slajdu
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { backgroundColor: item.color }]}>
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={DATA}
      renderItem={renderItem}
      keyExtractor={(item) => item.title}
      horizontal
      pagingEnabled={false} // Wyłączamy domyślne snapowanie
      showsHorizontalScrollIndicator={false}
      style={styles.carousel}
      contentContainerStyle={{ paddingHorizontal: 20 }} // Dostosowanie przestrzeni po bokach
      onMomentumScrollEnd={onMomentumScrollEnd} // Przewijanie do slajdu
      snapToInterval={viewportWidth * 0.75} // Ustawienie szerokości slajdu do snappowania
      decelerationRate="fast" // Szybkie przewijanie
    />
  );
};

const styles = StyleSheet.create({
  carousel: {
    height: 200,
  },
  slide: {
    width: viewportWidth * 0.75, // Ustaw szerokość slajdu
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    marginRight: 10, // Odstęp między slajdami
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CarouselSlider;
