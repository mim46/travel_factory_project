import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Fetch reviews for a specific package
export const fetchPackageReviews = createAsyncThunk(
  'reviews/fetchPackageReviews',
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/packages/${packageId}/reviews`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch reviews');
    }
  }
);

// Fetch featured reviews for landing page
export const fetchFeaturedReviews = createAsyncThunk(
  'reviews/fetchFeaturedReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/reviews/featured`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch featured reviews');
    }
  }
);

// Submit a new review
export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/reviews`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to submit review');
    }
  }
);

// Fetch user's own reviews
export const fetchMyReviews = createAsyncThunk(
  'reviews/fetchMyReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/my-reviews`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch my reviews');
    }
  }
);

// Update a review
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/reviews/${id}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update review');
    }
  }
);

// Delete a review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete review');
    }
  }
);

// Admin: Fetch all reviews
export const fetchAllReviews = createAsyncThunk(
  'reviews/fetchAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/reviews`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch all reviews');
    }
  }
);

// Admin: Fetch pending reviews
export const fetchPendingReviews = createAsyncThunk(
  'reviews/fetchPendingReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/reviews/pending`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch pending reviews');
    }
  }
);

// Admin: Approve review
export const approveReview = createAsyncThunk(
  'reviews/approveReview',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/admin/reviews/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to approve review');
    }
  }
);

// Admin: Delete review
export const adminDeleteReview = createAsyncThunk(
  'reviews/adminDeleteReview',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/admin/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    packageReviews: [],
    averageRating: 0,
    totalReviews: 0,
    featuredReviews: [],
    myReviews: [],
    allReviews: [],
    pendingReviews: [],
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
      // Fetch package reviews
      .addCase(fetchPackageReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.packageReviews = action.payload.reviews;
        state.averageRating = action.payload.average_rating;
        state.totalReviews = action.payload.total_reviews;
      })
      .addCase(fetchPackageReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch featured reviews
      .addCase(fetchFeaturedReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredReviews = action.payload;
      })
      .addCase(fetchFeaturedReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit review
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch my reviews
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = action.payload;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = state.myReviews.filter(review => review.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin: Fetch all reviews
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.allReviews = action.payload;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin: Fetch pending reviews
      .addCase(fetchPendingReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingReviews = action.payload;
      })
      .addCase(fetchPendingReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin: Approve review
      .addCase(approveReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pendingReviews.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.pendingReviews.splice(index, 1);
        }
      })
      .addCase(approveReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin: Delete review
      .addCase(adminDeleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDeleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.allReviews = state.allReviews.filter(review => review.id !== action.payload);
        state.pendingReviews = state.pendingReviews.filter(review => review.id !== action.payload);
      })
      .addCase(adminDeleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
