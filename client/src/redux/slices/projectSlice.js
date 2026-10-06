import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createWebsite } from "../../api/websiteApi";

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
      });
  },
});

export default projectSlice.reducer;