import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
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

  useEffect(() => {
    dispatch(fetchImages());

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

  const renderItem = ({ item }: { item: { id: number; thumbnailUrl: string; url: string; title:string} }) => (
    <TouchableOpacity
      style={[styles.item, { width: itemWidth, height: itemWidth }]}
      onPress={() => navigation.navigate('ImageDetailScreen',{ imageUrl: item.url, title: item.title })}
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
