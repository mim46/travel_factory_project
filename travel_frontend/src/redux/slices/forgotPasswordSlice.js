import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Send OTP
export const sendOtp = createAsyncThunk(
  'forgotPassword/sendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
  'forgotPassword/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'forgotPassword/resetPassword',
  async ({ email, otp, password, password_confirmation }, { rejectWithValue }) => {
    try {
      const response = await api.post('/reset-password', {
        email,
        otp,
        password,
        password_confirmation
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState: {
    loading: false,
    error: null,
    success: false,
    step: 'email', // email, otp, reset
    email: '',
    message: '',
    debugOtp: null, // For development only
  },
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    resetForgotPassword: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.step = 'email';
      state.email = '';
      state.message = '';
      state.debugOtp = null;
    },
  },
  extraReducers: (builder) => {
    // Send OTP
    builder.addCase(sendOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      state.debugOtp = action.payload.otp; // Store OTP for debug mode
      state.step = 'otp';
    });
    builder.addCase(sendOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Verify OTP
    builder.addCase(verifyOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      state.step = 'reset';
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Reset Password
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setStep, setEmail, resetForgotPassword } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
