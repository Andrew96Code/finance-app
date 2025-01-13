import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';
import { FinancialGoal } from '../../types';

interface GoalState {
    goals: FinancialGoal[];
    isLoading: boolean;
    error: string | null;
}

const initialState: GoalState = {
    goals: [],
    isLoading: false,
    error: null,
};

export const fetchGoals = createAsyncThunk('goals/fetchAll', async () => {
    return await api.getGoals();
});

export const createGoal = createAsyncThunk(
    'goals/create',
    async (goal: Omit<FinancialGoal, 'id' | 'user_id' | 'created_at'>) => {
        return await api.createGoal(goal);
    }
);

export const updateGoal = createAsyncThunk(
    'goals/update',
    async ({ id, goal }: { id: number; goal: Omit<FinancialGoal, 'id' | 'user_id' | 'created_at'> }) => {
        return await api.updateGoal(id, goal);
    }
);

export const deleteGoal = createAsyncThunk(
    'goals/delete',
    async (id: number) => {
        await api.deleteGoal(id);
        return id;
    }
);

const goalSlice = createSlice({
    name: 'goals',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Goals
            .addCase(fetchGoals.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchGoals.fulfilled, (state, action) => {
                state.isLoading = false;
                state.goals = action.payload;
            })
            .addCase(fetchGoals.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch goals';
            })
            // Create Goal
            .addCase(createGoal.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createGoal.fulfilled, (state, action) => {
                state.isLoading = false;
                state.goals.push(action.payload);
            })
            .addCase(createGoal.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create goal';
            })
            // Update Goal
            .addCase(updateGoal.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateGoal.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.goals.findIndex((goal) => goal.id === action.payload.id);
                if (index !== -1) {
                    state.goals[index] = action.payload;
                }
            })
            .addCase(updateGoal.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to update goal';
            })
            // Delete Goal
            .addCase(deleteGoal.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.isLoading = false;
                state.goals = state.goals.filter((goal) => goal.id !== action.payload);
            })
            .addCase(deleteGoal.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to delete goal';
            });
    },
});

export default goalSlice.reducer; 