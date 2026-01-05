import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  messages: [],
  adminMessages: [],
  queries: [], // ✅ Add queries
  loading: false,
  error: null,
};

// User: Fetch my messages
export const fetchMyMessages = createAsyncThunk(
  'messages/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/my-messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

// User: Send message
export const sendMessage = createAsyncThunk(
  'messages/send',
  async (messageData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/messages', messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

// User: Mark as read
export const markMessageAsRead = createAsyncThunk(
  'messages/markRead',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.patch(`/messages/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

// Admin: Fetch all messages
export const fetchAllMessages = createAsyncThunk(
  'messages/fetchAll',
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

// Admin: Fetch all queries ✅
export const fetchAllQueries = createAsyncThunk(
  'messages/fetchQueries',
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

// Admin: Reply to message
export const replyToMessage = createAsyncThunk(
  'messages/reply',
  async ({ id, admin_reply }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/admin/messages/${id}/reply`, 
        { admin_reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reply');
    }
  }
);

// Admin: Delete message
export const deleteMessage = createAsyncThunk(
  'messages/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete message');
    }
  }
);

// Admin: Delete query ✅
export const deleteQuery = createAsyncThunk(
  'messages/deleteQuery',
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

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch my messages
    builder
      .addCase(fetchMyMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMyMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Mark as read
    builder.addCase(markMessageAsRead.fulfilled, (state, action) => {
      const index = state.messages.findIndex(m => m.id === action.payload.data.id);
      if (index !== -1) {
        state.messages[index] = action.payload.data;
      }
    });

    // Fetch all messages (admin)
    builder.addCase(fetchAllMessages.fulfilled, (state, action) => {
      state.adminMessages = action.payload;
    });

    // Fetch all queries (admin) ✅
    builder.addCase(fetchAllQueries.fulfilled, (state, action) => {
      state.queries = action.payload;
    });

    // Reply to message
    builder.addCase(replyToMessage.fulfilled, (state, action) => {
      const index = state.adminMessages.findIndex(m => m.id === action.payload.data.id);
      if (index !== -1) {
        state.adminMessages[index] = action.payload.data;
      }
    });

    // Delete message
    builder.addCase(deleteMessage.fulfilled, (state, action) => {
      state.adminMessages = state.adminMessages.filter(m => m.id !== action.payload);
    });

    // Delete query ✅
    builder.addCase(deleteQuery.fulfilled, (state, action) => {
      state.queries = state.queries.filter(q => q.id !== action.payload);
    });
  },
});

export const { clearError } = messageSlice.actions;
export default messageSlice.reducer;