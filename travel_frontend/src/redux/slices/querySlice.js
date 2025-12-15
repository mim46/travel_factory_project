import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  queries: [],
  messages: [],
  loading: false,
  error: null,
};

// Submit Query (Public)
export const submitQuery = createAsyncThunk(
  'query/submit',
  async (queryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/queries', queryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit query');
    }
  }
);

// Submit Contact (Public)
export const submitContact = createAsyncThunk(
  'query/submitContact',
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

// Fetch All Queries (Admin)
export const fetchAllQueries = createAsyncThunk(
  'query/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/queries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch queries');
    }
  }
);

// Fetch All Messages (Admin)
export const fetchAllMessages = createAsyncThunk(
  'query/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

// Mark Query as Read (Admin)
export const markQueryAsRead = createAsyncThunk(
  'query/markRead',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.patch(`/admin/queries/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

// Delete Query (Admin)
export const deleteQuery = createAsyncThunk(
  'query/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/queries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete query');
    }
  }
);

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Submit Query
    builder
      .addCase(submitQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuery.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Submit Contact
    builder
      .addCase(submitContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitContact.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Queries
    builder
      .addCase(fetchAllQueries.fulfilled, (state, action) => {
        state.queries = action.payload;
      });

    // Fetch Messages
    builder
      .addCase(fetchAllMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      });

    // Mark as Read
    builder
      .addCase(markQueryAsRead.fulfilled, (state, action) => {
        const index = state.queries.findIndex(q => q.id === action.payload.query.id);
        if (index !== -1) {
          state.queries[index] = action.payload.query;
        }
      });

    // Delete Query
    builder
      .addCase(deleteQuery.fulfilled, (state, action) => {
        state.queries = state.queries.filter(q => q.id !== action.payload);
      });
  },
});

export const { clearError } = querySlice.actions;
export default querySlice.reducer;
