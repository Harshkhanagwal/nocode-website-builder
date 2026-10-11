import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import colorThemeReducer from "./slices/colorThemeSlice";
import typographyReducer from "./slices/typographySlice";
import projectReducer from "./slices/projectSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    colorThemes: colorThemeReducer,
    typography: typographyReducer,
    project: projectReducer,
  },
});