// ImageDetailScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  ImageDetail: {
    imageUrl: string;
    title: string;
  };
  // other routes can be added here
};

type ImageDetailScreenRouteProp = RouteProp<RootStackParamList, 'ImageDetail'>;

const ImageDetailScreen: React.FC = () => {
  const route = useRoute<ImageDetailScreenRouteProp>();
  const {  title } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Image  style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Button title="Back to Gallery" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
