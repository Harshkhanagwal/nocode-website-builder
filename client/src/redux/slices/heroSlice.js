
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createHeroSectionApi,
  updateHeroSectionApi,
  deleteHeroSectionApi,
} from "../../api/heroApi";

// Create hero section
export const createHeroSection = createAsyncThunk(
  "hero/createHeroSection",
  async ({ websiteId, sectionData }, { rejectWithValue }) => {
    try {
      const response = await createHeroSectionApi(
        websiteId,
        sectionData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create hero section"
      );
    }
  }
);

// Update hero section
export const saveHeroSection = createAsyncThunk(
  "hero/saveHeroSection",
  async ({ websiteId, sectionData }, { rejectWithValue }) => {
    try {
      const response = await updateHeroSectionApi(
        websiteId,
        sectionData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update hero section"
      );
    }
  }
);

// Delete hero section
export const deleteHeroSection = createAsyncThunk(
  "hero/deleteHeroSection",
  async ({ websiteId }, { rejectWithValue }) => {
    try {
      const response = await deleteHeroSectionApi(websiteId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete hero section"
      );
    }
  }
);

const initialState = {
  loading: false,
  saving: false,
  deleting: false,
  error: null,
  lastResponse: null,
};

const heroSlice = createSlice({
  name: "hero",
  initialState,

  reducers: {
    clearHeroError: (state) => {
      state.error = null;
    },

    resetHeroStatus: (state) => {
      state.loading = false;
      state.saving = false;
      state.deleting = false;
      state.error = null;
      state.lastResponse = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Create hero
      .addCase(createHeroSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHeroSection.fulfilled, (state, action) => {
        state.loading = false;
        state.lastResponse = action.payload;
      })
      .addCase(createHeroSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update hero
      .addCase(saveHeroSection.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveHeroSection.fulfilled, (state, action) => {
        state.saving = false;
        state.lastResponse = action.payload;
      })
      .addCase(saveHeroSection.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
      })

      // Delete hero
      .addCase(deleteHeroSection.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteHeroSection.fulfilled, (state, action) => {
        state.deleting = false;
        state.lastResponse = action.payload;
      })
      .addCase(deleteHeroSection.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearHeroError, resetHeroStatus } = heroSlice.actions;

export default heroSlice.reducer;
