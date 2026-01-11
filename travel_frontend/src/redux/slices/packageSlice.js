import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  packages: [],
  currentPackage: null,
  loading: false,
  error: null,
};

// =============================
// ASYNC THUNKS
// =============================

// Get All Packages
export const fetchPackages = createAsyncThunk(
  'packages/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/packages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch packages');
    }
  }
);

// Get Single Package
export const fetchPackageById = createAsyncThunk(
  'packages/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch package');
    }
  }
);

// Create Package
export const createPackage = createAsyncThunk(
  'packages/create',
  async (packageData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/packages', packageData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create package');
    }
  }
);

// Update Package
export const updatePackage = createAsyncThunk(
  'packages/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/packages/${id}?_method=PUT`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update package');
    }
  }
);

// Delete Package
export const deletePackage = createAsyncThunk(
  'packages/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete package');
    }
  }
);

// =============================
// PACKAGE SLICE
// =============================
const packageSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Packages
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Single Package
    builder
      .addCase(fetchPackageById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPackage = action.payload;
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Package
    builder
      .addCase(createPackage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages.push(action.payload.package);
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Package
    builder
      .addCase(updatePackage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.packages.findIndex(p => p.id === action.payload.package.id);
        if (index !== -1) {
          state.packages[index] = action.payload.package;
        }
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Package
    builder
      .addCase(deletePackage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = state.packages.filter(p => p.id !== action.payload);
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = packageSlice.actions;
export default packageSlice.reducer;
