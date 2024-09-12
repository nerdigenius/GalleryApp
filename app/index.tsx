import ImageGrid from "@/components/ImageGrid";
import { Text, View,StyleSheet  } from "react-native";



export default function Index() {
  return (
    <View style={styles.container}>
      <ImageGrid/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes full height for proper scrolling
    justifyContent: 'center', // Optional: Center children vertically
    alignItems: 'center', // Optional: Center children horizontally
  },
});