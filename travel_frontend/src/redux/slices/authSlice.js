import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Initial State
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  loading: false,
  error: null,
};

// =============================
// ASYNC THUNKS (API Calls)
// =============================

// Login User
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('🔵 Login attempt:', { email, password });
      
      //  Remove CSRF cookie fetch
      
      const response = await api.post('/login', { email, password });
      console.log('✅ Login response:', response.data);
      
      // Save to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', response.data.role);
      
      return response.data;
    } catch (error) {
      console.error('❌ Login Error:', error);
      console.error('Error response:', error.response);
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Login failed');
      }
      return rejectWithValue('Network error. Please check your connection.');
    }
  }
);

// Register User
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('🔵 Registration attempt:', userData);
      
      //  Remove CSRF cookie fetch
      
      const response = await api.post('/register', userData);
      console.log('✅ Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration Error:', error);
      console.error('Error response:', error.response);
      if (error.response) {
        if (error.response.data.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          return rejectWithValue(errors.join(', '));
        }
        return rejectWithValue(error.response.data.message || 'Registration failed');
      }
      return rejectWithValue('Network error. Please check your connection.');
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      
      return null;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// =============================
// AUTH SLICE
// =============================
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.role = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.role = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;