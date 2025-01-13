import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';
import { User } from '../../types';

interface AuthState {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    user: null,
    isLoading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }) => {
        const response = await api.login(email, password);
        localStorage.setItem('token', response.access_token);
        const user = await api.getCurrentUser();
        return { token: response.access_token, user };
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: { email: string; password: string; full_name: string; monthly_income: number }) => {
        const user = await api.register(userData);
        const response = await api.login(userData.email, userData.password);
        localStorage.setItem('token', response.access_token);
        return { token: response.access_token, user };
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('token');
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Login failed';
            })
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Registration failed';
            })
            .addCase(logout.fulfilled, (state) => {
                state.token = null;
                state.user = null;
            });
    },
});

export default authSlice.reducer; 