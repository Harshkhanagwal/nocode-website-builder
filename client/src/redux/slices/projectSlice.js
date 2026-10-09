import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createWebsite,
  getUserWebsites,
} from "../../api/websiteApi";

// Create website
export const createNewWebsite = createAsyncThunk(
  "project/createWebsite",
  async (websiteData, { rejectWithValue }) => {
    try {
      const data = await createWebsite(websiteData);

      console.log("WEBSITE CREATED:", data);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create website"
      );
    }
  }
);

// Fetch user's websites
export const fetchUserWebsites = createAsyncThunk(
  "project/fetchUserWebsites",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserWebsites();

      console.log("USER WEBSITES:", data);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch websites"
      );
    }
  }
);

const initialState = {
  projects: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Create website
      .addCase(createNewWebsite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createNewWebsite.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.website) {
          state.projects.push(action.payload.website);
        }
      })

      .addCase(createNewWebsite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user websites
      .addCase(fetchUserWebsites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUserWebsites.fulfilled, (state, action) => {
        state.loading = false;

        state.projects = action.payload.websites;
      })

      .addCase(fetchUserWebsites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default projectSlice.reducer;