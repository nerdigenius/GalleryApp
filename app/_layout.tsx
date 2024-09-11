import { store } from "@/hooks/redux/store";
import { Stack } from "expo-router";
import React from "react";
import { Provider } from "react-redux";
import ImageDetailScreen from "./ImageDetailScreen";



export default function RootLayout() {
  return (
    <Provider store={store}>
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="ImageDetailScreen"  />
    </Stack>
    </Provider>
  );
}
