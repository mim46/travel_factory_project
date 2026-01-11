import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  countries: [],
  currentCountry: null,
  loading: false,
  error: null,
};

// Fetch all countries
export const fetchCountries = createAsyncThunk(
  'countries/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/countries');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch countries');
    }
  }
);

// Create country
export const createCountry = createAsyncThunk(
  'countries/create',
  async (countryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/countries', countryData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create country');
    }
  }
);

// Update country
export const updateCountry = createAsyncThunk(
  'countries/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/countries/${id}?_method=PUT`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update country');
    }
  }
);

// Delete country
export const deleteCountry = createAsyncThunk(
  'countries/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/countries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete country');
    }
  }
);

const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCountry: (state, action) => {
      state.currentCountry = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch countries
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create country
      .addCase(createCountry.fulfilled, (state, action) => {
        state.countries.push(action.payload);
      })
      // Update country
      .addCase(updateCountry.fulfilled, (state, action) => {
        const index = state.countries.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.countries[index] = action.payload;
        }
      })
      // Delete country
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.countries = state.countries.filter(c => c.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentCountry } = countrySlice.actions;
export default countrySlice.reducer;
