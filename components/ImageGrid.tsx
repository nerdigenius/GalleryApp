import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/hooks/redux/store';
import { fetchImages } from '@/hooks/redux/store';
import { Image } from 'expo-image';

type RootStackParamList = {
  ImageDetailScreen: { imageUrl: string; title: string };
};

const numColumns = 3;

const ImageGrid: React.FC = () => {
  const dispatch = useDispatch();
  const images = useSelector((state: RootState) => state.images);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ImageDetailScreen'>>();
  const [itemWidth, setItemWidth] = useState(Dimensions.get('window').width / numColumns);
  const [isLoading, setIsLoading] = useState(false); // Loading state for lazy loading
  const [page, setPage] = useState(1); // Track the page number for lazy loading

  useEffect(() => {
    loadImages(); // Initial load

    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      setItemWidth(width / numColumns);
    };

    // Add event listener for orientation changes
    const subscription = Dimensions.addEventListener('change', updateLayout);

    // Cleanup the listener on unmount
    return () => {
      subscription?.remove();
    };
  }, [dispatch]);

  const loadImages = async () => {
    if (isLoading) return; // Prevent multiple fetches
    setIsLoading(true);
    await dispatch(fetchImages(page)); // Fetch images for the current page
    setIsLoading(false);
  };

  const handleEndReached = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page number
    loadImages(); // Load next set of images
  };

  const renderItem = ({ item }: { item: { id: number; thumbnailUrl: string; url: string; title: string } }) => (
    <TouchableOpacity
      style={[styles.item, { width: itemWidth, height: itemWidth }]}
      onPress={() => navigation.navigate('ImageDetailScreen', { imageUrl: item.url, title: item.title })}
    >
      <Image source={{ uri: item.thumbnailUrl }} cachePolicy="disk" style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      key={itemWidth} // Ensures FlatList re-renders on orientation change
      onEndReached={handleEndReached} // Trigger loading more items when the end is reached
      onEndReachedThreshold={0.5} // Trigger when half the list height is reached
      ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null} // Show loading spinner
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  item: {
    margin: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default ImageGrid;
