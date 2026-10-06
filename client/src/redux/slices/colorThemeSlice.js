import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getColorThemes } from "../../api/colorThemeApi";

export const fetchColorThemes = createAsyncThunk(
  "colorThemes/fetchColorThemes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getColorThemes();

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch color themes"
      );
    }
  }
);

const initialState = {
  themes: [],
  count: 0,
  loading: false,
  error: null,
};

const colorThemeSlice = createSlice({
  name: "colorThemes",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchColorThemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchColorThemes.fulfilled, (state, action) => {
        state.loading = false;

        state.themes = action.payload.themes;
        state.count = action.payload.count;
      })

      .addCase(fetchColorThemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default colorThemeSlice.reducer;