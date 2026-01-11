import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  places: [],
  currentPlace: null,
  loading: false,
  error: null,
};

// Fetch all places
export const fetchPlaces = createAsyncThunk(
  'places/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/places');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch places');
    }
  }
);

// Create place
export const createPlace = createAsyncThunk(
  'places/create',
  async (placeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/places', placeData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create place');
    }
  }
);

// Update place
export const updatePlace = createAsyncThunk(
  'places/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/places/${id}?_method=PUT`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update place');
    }
  }
);

// Delete place
export const deletePlace = createAsyncThunk(
  'places/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/places/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete place');
    }
  }
);

const placeSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPlace: (state, action) => {
      state.currentPlace = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch places
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create place
      .addCase(createPlace.fulfilled, (state, action) => {
        state.places.push(action.payload);
      })
      // Update place
      .addCase(updatePlace.fulfilled, (state, action) => {
        const index = state.places.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.places[index] = action.payload;
        }
      })
      // Delete place
      .addCase(deletePlace.fulfilled, (state, action) => {
        state.places = state.places.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentPlace } = placeSlice.actions;
export default placeSlice.reducer;
