import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Image } from './types';

const initialState: Image[] = [];

export const fetchImages = createAsyncThunk('images/fetchImages', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/photos');
  const data = await response.json();
  return data;
});

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchImages.fulfilled, (state, action) => action.payload);
  },
});

export const store = configureStore({
  reducer: {
    images: imagesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;