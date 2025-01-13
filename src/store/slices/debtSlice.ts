import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';
import { Debt, DebtSummary } from '../../types';

interface DebtState {
    debts: Debt[];
    summary: DebtSummary | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: DebtState = {
    debts: [],
    summary: null,
    isLoading: false,
    error: null,
};

export const fetchDebts = createAsyncThunk('debts/fetchAll', async () => {
    return await api.getDebts();
});

export const createDebt = createAsyncThunk(
    'debts/create',
    async (debt: Omit<Debt, 'id' | 'user_id' | 'created_at'>) => {
        return await api.createDebt(debt);
    }
);

export const updateDebt = createAsyncThunk(
    'debts/update',
    async ({ id, debt }: { id: number; debt: Omit<Debt, 'id' | 'user_id' | 'created_at'> }) => {
        return await api.updateDebt(id, debt);
    }
);

export const deleteDebt = createAsyncThunk(
    'debts/delete',
    async (id: number) => {
        await api.deleteDebt(id);
        return id;
    }
);

export const fetchDebtSummary = createAsyncThunk(
    'debts/fetchSummary',
    async () => {
        return await api.getDebtSummary();
    }
);

const debtSlice = createSlice({
    name: 'debts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Debts
            .addCase(fetchDebts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDebts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.debts = action.payload;
            })
            .addCase(fetchDebts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch debts';
            })
            // Create Debt
            .addCase(createDebt.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createDebt.fulfilled, (state, action) => {
                state.isLoading = false;
                state.debts.push(action.payload);
            })
            .addCase(createDebt.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create debt';
            })
            // Update Debt
            .addCase(updateDebt.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateDebt.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.debts.findIndex((debt) => debt.id === action.payload.id);
                if (index !== -1) {
                    state.debts[index] = action.payload;
                }
            })
            .addCase(updateDebt.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to update debt';
            })
            // Delete Debt
            .addCase(deleteDebt.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteDebt.fulfilled, (state, action) => {
                state.isLoading = false;
                state.debts = state.debts.filter((debt) => debt.id !== action.payload);
            })
            .addCase(deleteDebt.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to delete debt';
            })
            // Fetch Debt Summary
            .addCase(fetchDebtSummary.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDebtSummary.fulfilled, (state, action) => {
                state.isLoading = false;
                state.summary = action.payload;
            })
            .addCase(fetchDebtSummary.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch debt summary';
            });
    },
});

export default debtSlice.reducer; 