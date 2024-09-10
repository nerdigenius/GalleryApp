import { store } from "@/hooks/redux/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";


export default function RootLayout() {
  return (
    <Provider store={store}>
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
    </Provider>
  );
}
