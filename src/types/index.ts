export type User = {
    id: number;
    email: string;
    full_name: string;
    monthly_income: number;
    created_at: string;
};

export enum TransactionType {
    INCOME = "income",
    EXPENSE = "expense"
}

export enum ExpenseCategory {
    HOUSING = "housing",
    TRANSPORTATION = "transportation",
    FOOD = "food",
    UTILITIES = "utilities",
    HEALTHCARE = "healthcare",
    ENTERTAINMENT = "entertainment",
    OTHER = "other"
}

export type Transaction = {
    id: number;
    user_id: number;
    amount: number;
    type: TransactionType;
    category: ExpenseCategory;
    description: string;
    date: string;
    created_at: string;
};

export type Debt = {
    id: number;
    user_id: number;
    name: string;
    total_amount: number;
    remaining_amount: number;
    interest_rate: number;
    minimum_payment: number;
    due_date: string;
    created_at: string;
};

export type FinancialGoal = {
    id: number;
    user_id: number;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string;
    created_at: string;
};

export type Budget = {
    id: number;
    user_id: number;
    housing: number;
    transportation: number;
    food: number;
    utilities: number;
    healthcare: number;
    entertainment: number;
    other: number;
    created_at: string;
    updated_at?: string;
};

export type DashboardData = {
    monthly_income: number;
    total_expenses: number;
    monthly_savings: number;
    total_debt: number;
    debt_to_income_ratio: number;
    goals_progress: Array<{
        name: string;
        progress: number;
    }>;
};

export type BudgetAnalysis = {
    budget_comparison: {
        [key in ExpenseCategory]: {
            budgeted: number;
            actual: number;
            difference: number;
        };
    };
    total_budgeted: number;
    total_actual: number;
    total_difference: number;
};

export type DebtSummary = {
    total_debt: number;
    total_minimum_payment: number;
    weighted_average_interest: number;
    number_of_debts: number;
    debt_avalanche_order: Array<{
        name: string;
        amount: number;
        rate: number;
    }>;
    debt_snowball_order: Array<{
        name: string;
        amount: number;
        rate: number;
    }>;
};

export type AuthResponse = {
    access_token: string;
    token_type: string;
}; 