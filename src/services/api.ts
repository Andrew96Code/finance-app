import axios from 'axios';
import {
    User,
    Transaction,
    Debt,
    FinancialGoal,
    Budget,
    DashboardData,
    BudgetAnalysis,
    DebtSummary,
    AuthResponse
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    const response = await api.post<AuthResponse>('/token', formData);
    return response.data;
};

export const register = async (userData: {
    email: string;
    password: string;
    full_name: string;
    monthly_income: number;
}): Promise<User> => {
    const response = await api.post<User>('/register', userData);
    return response.data;
};

// User API
export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
};

export const updateUser = async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/users/me', userData);
    return response.data;
};

export const getDashboard = async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>('/users/me/dashboard');
    return response.data;
};

// Transactions API
export const getTransactions = async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>('/transactions');
    return response.data;
};

export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions', transaction);
    return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`);
};

// Budget API
export const getBudget = async (): Promise<Budget> => {
    const response = await api.get<Budget>('/budgets');
    return response.data;
};

export const createBudget = async (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Budget> => {
    const response = await api.post<Budget>('/budgets', budget);
    return response.data;
};

export const updateBudget = async (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Budget> => {
    const response = await api.put<Budget>('/budgets', budget);
    return response.data;
};

export const getBudgetAnalysis = async (): Promise<BudgetAnalysis> => {
    const response = await api.get<BudgetAnalysis>('/budgets/analysis');
    return response.data;
};

// Goals API
export const getGoals = async (): Promise<FinancialGoal[]> => {
    const response = await api.get<FinancialGoal[]>('/goals');
    return response.data;
};

export const createGoal = async (goal: Omit<FinancialGoal, 'id' | 'user_id' | 'created_at'>): Promise<FinancialGoal> => {
    const response = await api.post<FinancialGoal>('/goals', goal);
    return response.data;
};

export const updateGoal = async (id: number, goal: Omit<FinancialGoal, 'id' | 'user_id' | 'created_at'>): Promise<FinancialGoal> => {
    const response = await api.put<FinancialGoal>(`/goals/${id}`, goal);
    return response.data;
};

export const deleteGoal = async (id: number): Promise<void> => {
    await api.delete(`/goals/${id}`);
};

// Debts API
export const getDebts = async (): Promise<Debt[]> => {
    const response = await api.get<Debt[]>('/debts');
    return response.data;
};

export const createDebt = async (debt: Omit<Debt, 'id' | 'user_id' | 'created_at'>): Promise<Debt> => {
    const response = await api.post<Debt>('/debts', debt);
    return response.data;
};

export const updateDebt = async (id: number, debt: Omit<Debt, 'id' | 'user_id' | 'created_at'>): Promise<Debt> => {
    const response = await api.put<Debt>(`/debts/${id}`, debt);
    return response.data;
};

export const deleteDebt = async (id: number): Promise<void> => {
    await api.delete(`/debts/${id}`);
};

export const getDebtSummary = async (): Promise<DebtSummary> => {
    const response = await api.get<DebtSummary>('/debts/summary');
    return response.data;
}; 