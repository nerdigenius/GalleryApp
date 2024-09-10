import React, { useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/hooks/redux/store';

import { fetchImages } from '@/hooks/redux/store';

const numColumns = 3;
const { width } = Dimensions.get('window');
const itemWidth = width / numColumns;

const ImageGrid: React.FC = () => {
  const dispatch = useDispatch();
  const images = useSelector((state: RootState) => state.images);

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  const renderItem = ({ item }: { item: { id: number; thumbnailUrl: string; url: string } }) => (
    <TouchableOpacity
      style={styles.item}
      
    >
      <Image source={{ uri: item.thumbnailUrl }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  item: {
    flex: 1,
    margin: 2,
  },
  image: {
    width: itemWidth - 4, // Adjust for margin
    height: itemWidth - 4, // Make the image square
    resizeMode: 'cover',
  },
});

export default ImageGrid;