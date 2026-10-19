import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createWebsite,
  getUserWebsites,
  getWebsiteById,
  updateWebsite,
  deleteWebsiteById,
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

// Fetch a single website with sections
export const fetchWebsiteById = createAsyncThunk(
  "project/fetchWebsiteById",
  async (websiteId, { rejectWithValue }) => {
    try {
      const data = await getWebsiteById(websiteId);
      return data.website;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch website"
      );
    }
  }
);

export const saveWebsiteSettings = createAsyncThunk(
  "project/updateWebsite",
  async ({ id, ...websiteData }, { rejectWithValue }) => {
    try {
      const data = await updateWebsite(id, websiteData);
      return data.website;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update website");
    }
  }
);

export const removeWebsite = createAsyncThunk(
  "project/deleteWebsite",
  async (websiteId, { rejectWithValue }) => {
    try {
      await deleteWebsiteById(websiteId);
      return websiteId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete website");
    }
  }
);

const initialState = {
  projects: [],
  currentWebsite: null,
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
      })



      // Fetch single website
      .addCase(fetchWebsiteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebsiteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWebsite = action.payload;
      })
      .addCase(fetchWebsiteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveWebsiteSettings.fulfilled, (state, action) => {
        const index = state.projects.findIndex((project) => project._id === action.payload._id);
        if (index !== -1) state.projects[index] = { ...state.projects[index], ...action.payload };
        if (state.currentWebsite?._id === action.payload._id) state.currentWebsite = action.payload;
      })
      .addCase(removeWebsite.fulfilled, (state, action) => {
        state.projects = state.projects.filter((project) => project._id !== action.payload);
        if (state.currentWebsite?._id === action.payload) state.currentWebsite = null;
      })
  },
});

export default projectSlice.reducer;
