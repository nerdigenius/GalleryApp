import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ImageDetailScreen: { imageUrl: string; title: string };
};

interface RenderItemProps {
  item: {
    id: number;
    thumbnailUrl: string;
    url: string;
    title: string;
    albumId: number;
  };
  itemWidth: number;
}

export default function RenderItem({ item, itemWidth }: RenderItemProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ImageDetailScreen'>>();

  const handleError = (event: any) => {
    setLoading(false);
    setError(event.nativeEvent.error);
  };

  return (
    
    <Pressable
      style={[styles.item, { width: itemWidth }]}
      onPress={() => navigation.navigate('ImageDetailScreen', { imageUrl: item.url, title: item.title })}
    >
      {loading && !error && (
        <ActivityIndicator size="small" color="#0000ff" />
      )}
      {error ? (
        <Text style={styles.errorText}>Error loading image: {error}</Text>
      ) : (
        <ExpoImage
          source={{ uri: item.thumbnailUrl }}
          cachePolicy="disk"
          style={styles.image}
          onLoadStart={() => {
            setLoading(true);
            setError(null);
          }}
          onLoadEnd={() => setLoading(false)}
          onError={handleError}
        />
      )}
      <Text>Title: {item.title}</Text>
      <Text>Album Id: {item.albumId}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    margin: 2,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
