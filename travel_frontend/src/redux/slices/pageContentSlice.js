import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Fetch page content
export const fetchPageContent = createAsyncThunk(
  'pageContent/fetchPageContent',
  async (page, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/page-content/${page}`);
      return { page, content: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch page content');
    }
  }
);

// Update page content
export const updatePageContent = createAsyncThunk(
  'pageContent/updatePageContent',
  async ({ page, content }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/page-content/${page}`,
        { content },
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return { page, content };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update page content');
    }
  }
);

const pageContentSlice = createSlice({
  name: 'pageContent',
  initialState: {
    home: {},
    about: {},
    contact: {},
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
      // Fetch page content
      .addCase(fetchPageContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageContent.fulfilled, (state, action) => {
        state.loading = false;
        state[action.payload.page] = action.payload.content;
      })
      .addCase(fetchPageContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update page content
      .addCase(updatePageContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePageContent.fulfilled, (state, action) => {
        state.loading = false;
        state[action.payload.page] = action.payload.content;
      })
      .addCase(updatePageContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = pageContentSlice.actions;
export default pageContentSlice.reducer;
