import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';
import { Budget, BudgetAnalysis } from '../../types';

interface BudgetState {
    budget: Budget | null;
    analysis: BudgetAnalysis | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: BudgetState = {
    budget: null,
    analysis: null,
    isLoading: false,
    error: null,
};

export const fetchBudget = createAsyncThunk('budget/fetch', async () => {
    return await api.getBudget();
});

export const createBudget = createAsyncThunk(
    'budget/create',
    async (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
        return await api.createBudget(budget);
    }
);

export const updateBudget = createAsyncThunk(
    'budget/update',
    async (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
        return await api.updateBudget(budget);
    }
);

export const fetchBudgetAnalysis = createAsyncThunk(
    'budget/fetchAnalysis',
    async () => {
        return await api.getBudgetAnalysis();
    }
);

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Budget
            .addCase(fetchBudget.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBudget.fulfilled, (state, action) => {
                state.isLoading = false;
                state.budget = action.payload;
            })
            .addCase(fetchBudget.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch budget';
            })
            // Create Budget
            .addCase(createBudget.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createBudget.fulfilled, (state, action) => {
                state.isLoading = false;
                state.budget = action.payload;
            })
            .addCase(createBudget.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create budget';
            })
            // Update Budget
            .addCase(updateBudget.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateBudget.fulfilled, (state, action) => {
                state.isLoading = false;
                state.budget = action.payload;
            })
            .addCase(updateBudget.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to update budget';
            })
            // Fetch Budget Analysis
            .addCase(fetchBudgetAnalysis.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBudgetAnalysis.fulfilled, (state, action) => {
                state.isLoading = false;
                state.analysis = action.payload;
            })
            .addCase(fetchBudgetAnalysis.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch budget analysis';
            });
    },
});

export default budgetSlice.reducer; 