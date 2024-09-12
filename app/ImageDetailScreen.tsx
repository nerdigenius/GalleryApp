import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
type RootStackParamList = {
  ImageDetail: {
    imageUrl: string;
    title: string;
  };
};

type ImageDetailScreenRouteProp = RouteProp<RootStackParamList, 'ImageDetail'>;

const ImageDetailScreen: React.FC = () => {
  const route = useRoute<ImageDetailScreenRouteProp>();
  const { imageUrl, title } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          cachePolicy="disk"
        />
        <Text style={styles.title}>{title}</Text>
        <Button title="Back to Gallery" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ImageDetailScreen;
