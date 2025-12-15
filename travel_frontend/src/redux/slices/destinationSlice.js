import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  destinations: [],
  currentDestination: null,
  loading: false,
  error: null,
};

// Fetch All Destinations
export const fetchDestinations = createAsyncThunk(
  'destinations/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/destinations');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch destinations');
    }
  }
);

// Create Destination (Admin)
export const createDestination = createAsyncThunk(
  'destinations/create',
  async (destinationData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/admin/destinations', destinationData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create destination');
    }
  }
);

// Update Destination (Admin)
export const updateDestination = createAsyncThunk(
  'destinations/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/admin/destinations/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update destination');
    }
  }
);

// Delete Destination (Admin)
export const deleteDestination = createAsyncThunk(
  'destinations/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/destinations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete destination');
    }
  }
);

const destinationSlice = createSlice({
  name: 'destinations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Destinations
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations = action.payload;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Destination
    builder
      .addCase(createDestination.fulfilled, (state, action) => {
        state.destinations.push(action.payload.destination);
      });

    // Update Destination
    builder
      .addCase(updateDestination.fulfilled, (state, action) => {
        const index = state.destinations.findIndex(d => d.id === action.payload.destination.id);
        if (index !== -1) {
          state.destinations[index] = action.payload.destination;
        }
      });

    // Delete Destination
    builder
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.destinations = state.destinations.filter(d => d.id !== action.payload);
      });
  },
});

export const { clearError } = destinationSlice.actions;
export default destinationSlice.reducer;
