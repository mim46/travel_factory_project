import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  dashboardStats: null,
  monthlyBookings: [],
  topPackages: [],
  packageDistribution: [],
  revenue: null,
  loading: false,
  error: null,
};

// Fetch Dashboard Stats
export const fetchDashboardStats = createAsyncThunk(
  'reports/dashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/reports/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

// Fetch Monthly Bookings Chart
export const fetchMonthlyBookings = createAsyncThunk(
  'reports/monthlyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/reports/monthly-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chart data');
    }
  }
);

// Fetch Top Packages
export const fetchTopPackages = createAsyncThunk(
  'reports/topPackages',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/reports/top-packages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top packages');
    }
  }
);

// Fetch Package Distribution
export const fetchPackageDistribution = createAsyncThunk(
  'reports/packageDistribution',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/reports/package-distribution', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch distribution');
    }
  }
);

// Fetch Revenue
export const fetchRevenue = createAsyncThunk(
  'reports/revenue',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/reports/revenue', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchMonthlyBookings.fulfilled, (state, action) => {
        state.monthlyBookings = action.payload;
      });

    builder
      .addCase(fetchTopPackages.fulfilled, (state, action) => {
        state.topPackages = action.payload;
      });

    builder
      .addCase(fetchPackageDistribution.fulfilled, (state, action) => {
        state.packageDistribution = action.payload;
      });

    builder
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.revenue = action.payload;
      });
  },
});

export const { clearError } = reportSlice.actions;
export default reportSlice.reducer;
