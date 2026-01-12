import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Fetch all galleries
export const fetchGalleries = createAsyncThunk(
  'gallery/fetchGalleries',
  async (category = 'all', { rejectWithValue }) => {
    try {
      const url = category && category !== 'all' 
        ? `${API_URL}/galleries?category=${category}`
        : `${API_URL}/galleries`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch galleries');
    }
  }
);

// Create gallery
export const createGallery = createAsyncThunk(
  'gallery/createGallery',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/galleries`, formData, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create gallery');
    }
  }
);

// Update gallery
export const updateGallery = createAsyncThunk(
  'gallery/updateGallery',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      // Add _method field for Laravel PUT method spoofing
      if (formData instanceof FormData && !formData.has('_method')) {
        formData.append('_method', 'PUT');
      }
      
      const response = await axios.post(`${API_URL}/galleries/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update gallery');
    }
  }
);

// Delete gallery
export const deleteGallery = createAsyncThunk(
  'gallery/deleteGallery',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/galleries/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete gallery');
    }
  }
);

const gallerySlice = createSlice({
  name: 'gallery',
  initialState: {
    galleries: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch galleries
      .addCase(fetchGalleries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGalleries.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = action.payload;
      })
      .addCase(fetchGalleries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create gallery
      .addCase(createGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries.unshift(action.payload);
      })
      .addCase(createGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update gallery
      .addCase(updateGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGallery.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.galleries.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.galleries[index] = action.payload;
        }
      })
      .addCase(updateGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete gallery
      .addCase(deleteGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.galleries = state.galleries.filter((g) => g.id !== action.payload);
      })
      .addCase(deleteGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = gallerySlice.actions;
export default gallerySlice.reducer;
