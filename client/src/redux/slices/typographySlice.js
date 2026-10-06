import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTypographies } from "../../api/typographyApi";

export const fetchTypographies = createAsyncThunk(
  "typography/fetchTypographies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTypographies();

      console.log("TYPOGRAPHIES API:", response);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch typographies"
      );
    }
  }
);

const initialState = {
  typographies: [],
  loading: false,
  error: null,
};

const typographySlice = createSlice({
  name: "typography",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchTypographies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTypographies.fulfilled, (state, action) => {
        state.loading = false;
        state.typographies = action.payload.typographies;
      })

      .addCase(fetchTypographies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default typographySlice.reducer;