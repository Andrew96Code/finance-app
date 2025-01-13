import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';
import { User, DashboardData } from '../../types';

interface UserState {
    profile: User | null;
    dashboard: DashboardData | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    profile: null,
    dashboard: null,
    isLoading: false,
    error: null,
};

export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async () => {
    return await api.getCurrentUser();
});

export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (userData: Partial<User>) => {
        return await api.updateUser(userData);
    }
);

export const fetchDashboard = createAsyncThunk('user/fetchDashboard', async () => {
    return await api.getDashboard();
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch profile';
            })
            // Update Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to update profile';
            })
            // Fetch Dashboard
            .addCase(fetchDashboard.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dashboard = action.payload;
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch dashboard';
            });
    },
});

export default userSlice.reducer; 