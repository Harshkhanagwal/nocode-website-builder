import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    loginUser,
    registerUser,
    getCurrentUser,
    logoutUser,
} from "../../api/authApi";

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginUser(credentials);

            return response.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await registerUser(userData);

            return response.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Registration failed"
            );
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await logoutUser();
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Logout failed"
            );
        }
    }
);


export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCurrentUser();

            return response.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Not authenticated"
            );
        }
    }
);




const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    authChecked: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },

        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })

            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })

            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.authChecked = true;
                state.error = null;
            })

            .addCase(logout.rejected, (state, action) => {
                state.loading = false;

                // Clear local auth state even if the backend request fails.
                state.user = null;
                state.isAuthenticated = false;
                state.authChecked = true;

                state.error = action.payload;
            })
    },
});

export const {
    setUser,
    clearUser,
    setLoading,
    setError,
    clearError,
} = authSlice.actions;

export default authSlice.reducer;