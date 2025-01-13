import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionAnalysis } from '../components/transactions/TransactionAnalysis';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from '../store/slices/transactionSlice';

export const Transactions: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading: isAuthLoading } = useProtectedRoute();
    const [showForm, setShowForm] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [activeFilters, setActiveFilters] = useState({});

    const {
        transactions,
        isLoading,
        error
    } = useAppSelector((state) => state.transactions);

    const { monthlyIncome } = useAppSelector((state) => state.user.dashboard || {});

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    const handleAddTransaction = () => {
        setSelectedTransaction(null);
        setShowForm(true);
    };

    const handleEditTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setShowForm(true);
    };

    const handleDeleteTransaction = async (id) => {
        await dispatch(deleteTransaction(id));
        dispatch(fetchTransactions());
    };

    const handleSubmitTransaction = async (values) => {
        if (selectedTransaction) {
            await dispatch(updateTransaction({ id: selectedTransaction.id, ...values }));
        } else {
            await dispatch(createTransaction(values));
        }
        setShowForm(false);
        dispatch(fetchTransactions());
    };

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
        setShowFilters(false);
    };

    if (isAuthLoading || isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h5" color="error">
                    Error: {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4">
                        Transaction Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddTransaction}
                    >
                        Add Transaction
                    </Button>
                </Box>

                <TransactionAnalysis
                    transactions={transactions}
                    timeframe="month"
                    previousPeriodComparison={{
                        totalSpending: 5000,
                        categoryChanges: {
                            housing: 10,
                            transportation: -5,
                            food: 2,
                        }
                    }}
                />

                <Box sx={{ mt: 4 }}>
                    <TransactionList
                        transactions={transactions}
                        onAddTransaction={handleAddTransaction}
                        onEditTransaction={handleEditTransaction}
                        onDeleteTransaction={handleDeleteTransaction}
                        onShowFilters={() => setShowFilters(true)}
                        activeFilters={activeFilters}
                    />
                </Box>

                {showForm && (
                    <TransactionForm
                        open={showForm}
                        onClose={() => setShowForm(false)}
                        onSubmit={handleSubmitTransaction}
                        initialValues={selectedTransaction}
                        isEditing={!!selectedTransaction}
                        monthlyIncome={monthlyIncome}
                    />
                )}

                {showFilters && (
                    <TransactionFilters
                        onClose={() => setShowFilters(false)}
                        onApplyFilters={handleApplyFilters}
                        initialFilters={activeFilters}
                    />
                )}
            </Box>
        </Container>
    );
}; 