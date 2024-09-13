import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/hooks/redux/store';
import { fetchImages } from '@/hooks/redux/store';
import RenderItem from './RenderItem'; // Import the RenderItem component

const numColumns = 3;

export default function ImageGrid() {
  const dispatch = useDispatch();
  const images = useSelector((state: RootState) => state.images);
  const [itemWidth, setItemWidth] = useState(Dimensions.get('window').width / numColumns);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredImages, setFilteredImages] = useState(images);

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

  useEffect(() => {
    // Filter images based on search query whenever it changes
    if (searchQuery) {
      const filtered = images.filter(
        (image) =>
          image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          image.albumId.toString().includes(searchQuery)
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(images);
    }
  }, [searchQuery, images]);

  const loadImages = async () => {
    if (isLoading) return; // Prevent multiple fetches
    setIsLoading(true);
    await dispatch(fetchImages(page)); // Fetch images for the current page
    setIsLoading(false);
  };

  const handleEndReached = () => {
    if (!isLoading && !searchQuery) {
      setPage((prevPage) => prevPage + 1); // Increment the page number
      loadImages(); // Load next set of images
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by title or album"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <FlatList
        data={filteredImages}
        renderItem={({ item }) => <RenderItem item={item} itemWidth={itemWidth} />} // Use RenderItem as a component
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        key={itemWidth} // Ensures FlatList re-renders on orientation change
        onEndReached={handleEndReached} // Trigger loading more items when the end is reached
        onEndReachedThreshold={0.5} // Trigger when half the list height is reached
        ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null} // Show loading spinner
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
  },
});
