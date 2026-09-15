import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssignmentFilter, AssignmentState, Priority } from './types';
import {
  createAssignmentThunk,
  deleteAssignmentThunk,
  fetchAssignmentsThunk,
  resetSeedThunk,
  toggleAssignmentThunk,
  updateAssignmentThunk,
} from './assignmentsThunks';

const initialState: AssignmentState = {
  items: [],
  loading: false,
  error: null,
  filter: 'all',
  searchQuery: '',
  selectedPriority: 'all',
};

export const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<AssignmentFilter>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedPriority: (state, action: PayloadAction<Priority | 'all'>) => {
      state.selectedPriority = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchAssignmentsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAssignmentsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchAssignmentsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Không thể tải danh sách bài tập';
    });

    // Create
    builder.addCase(createAssignmentThunk.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    // Update
    builder.addCase(updateAssignmentThunk.fulfilled, (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    // Toggle
    builder.addCase(toggleAssignmentThunk.fulfilled, (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    // Delete
    builder.addCase(deleteAssignmentThunk.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });

    // Reset Seed
    builder.addCase(resetSeedThunk.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { setFilter, setSearchQuery, setSelectedPriority, clearError } = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
