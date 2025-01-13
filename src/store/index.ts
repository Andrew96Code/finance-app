import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import transactionReducer from './slices/transactionSlice';
import budgetReducer from './slices/budgetSlice';
import goalReducer from './slices/goalSlice';
import debtReducer from './slices/debtSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        transactions: transactionReducer,
        budget: budgetReducer,
        goals: goalReducer,
        debts: debtReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 