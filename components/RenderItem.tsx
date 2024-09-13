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
    setError(event.error);
  };
  const handleReload = () => {
    setError(null); // Clear error
    setLoading(true); // Show loading indicator
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
        <Pressable onPress={handleReload} style={styles.reloadContainer}>
        <ExpoImage
          source={require("@/assets/images/reload.svg")} 
          style={styles.reloadIcon}
        />
        <Text style={styles.errorText}>Tap to reload {error}</Text>
      </Pressable>
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
  reloadContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  reloadIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  }
});
