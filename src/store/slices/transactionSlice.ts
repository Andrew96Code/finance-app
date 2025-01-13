import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';
import { Transaction } from '../../types';

interface TransactionState {
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;
}

const initialState: TransactionState = {
    transactions: [],
    isLoading: false,
    error: null,
};

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchAll',
    async () => {
        return await api.getTransactions();
    }
);

export const createTransaction = createAsyncThunk(
    'transactions/create',
    async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
        return await api.createTransaction(transaction);
    }
);

export const deleteTransaction = createAsyncThunk(
    'transactions/delete',
    async (id: number) => {
        await api.deleteTransaction(id);
        return id;
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Transactions
            .addCase(fetchTransactions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch transactions';
            })
            // Create Transaction
            .addCase(createTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions.push(action.payload);
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create transaction';
            })
            // Delete Transaction
            .addCase(deleteTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = state.transactions.filter(
                    (transaction) => transaction.id !== action.payload
                );
            })
            .addCase(deleteTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to delete transaction';
            });
    },
});

export default transactionSlice.reducer; 