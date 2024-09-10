import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Image {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface ImagesState {
  images: Image[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

const initialState: ImagesState = {
  images: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

export const fetchImages = createAsyncThunk('images/fetchImages', async (page: number) => {
  const response = await axios.get(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=20`);
  return { data: response.data, page };
});

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = [...state.images, ...action.payload.data];
        state.page = action.payload.page;
        state.hasMore = action.payload.data.length > 0;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch images';
      });
  },
});

export const { setSearchTerm } = imagesSlice.actions;
export default imagesSlice.reducer;
