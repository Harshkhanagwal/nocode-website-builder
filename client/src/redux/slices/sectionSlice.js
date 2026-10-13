
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createSectionApi,
  updateSectionApi,
  deleteSectionApi,
} from "../../api/sectionApi";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong.";

// CREATE
export const createSection = createAsyncThunk(
  "sections/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createSectionApi(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// UPDATE
export const updateSection = createAsyncThunk(
  "sections/update",
  async (payload, { rejectWithValue }) => {
    try {
      return await updateSectionApi(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// DELETE
export const deleteSection = createAsyncThunk(
  "sections/delete",
  async (payload, { rejectWithValue }) => {
    try {
      return {
        ...payload,
        response: await deleteSectionApi(payload),
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  lastAction: null,
  lastResult: null,
};

const sectionSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {
    clearSectionError: (state) => {
      state.error = null;
    },
    clearSectionResult: (state) => {
      state.lastResult = null;
      state.lastAction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = "create";
        state.lastResult = action.payload;
      })
      .addCase(createSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create section.";
      })

      // UPDATE
      .addCase(updateSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = "update";
        state.lastResult = action.payload;
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update section.";
      })

      // DELETE
      .addCase(deleteSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = "delete";
        state.lastResult = action.payload;
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete section.";
      });
  },
});

export const {
  clearSectionError,
  clearSectionResult,
} = sectionSlice.actions;

export default sectionSlice.reducer;
