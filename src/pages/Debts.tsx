import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { DebtForm } from '../components/debts/DebtForm';
import { DebtOverview } from '../components/debts/DebtOverview';
import { DebtAnalysis } from '../components/debts/DebtAnalysis';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
    fetchDebts,
    createDebt,
    updateDebt,
    deleteDebt,
    fetchDebtSummary,
} from '../store/slices/debtSlice';

export const Debts: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading: isAuthLoading } = useProtectedRoute();
    const [showForm, setShowForm] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState(null);

    const {
        debts,
        summary,
        isLoading,
        error
    } = useAppSelector((state) => state.debts);

    const { monthlyIncome } = useAppSelector(
        (state) => state.user.dashboard || { monthlyIncome: 0 }
    );

    useEffect(() => {
        dispatch(fetchDebts());
        dispatch(fetchDebtSummary());
    }, [dispatch]);

    const handleAddDebt = () => {
        setSelectedDebt(null);
        setShowForm(true);
    };

    const handleEditDebt = (debt) => {
        setSelectedDebt(debt);
        setShowForm(true);
    };

    const handleDeleteDebt = async (id) => {
        await dispatch(deleteDebt(id));
        dispatch(fetchDebts());
        dispatch(fetchDebtSummary());
    };

    const handleSubmitDebt = async (values) => {
        if (selectedDebt) {
            await dispatch(updateDebt({ id: selectedDebt.id, ...values }));
        } else {
            await dispatch(createDebt(values));
        }
        setShowForm(false);
        dispatch(fetchDebts());
        dispatch(fetchDebtSummary());
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
                        Debt Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddDebt}
                    >
                        Add Debt
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    {/* Debt Overview */}
                    <Grid item xs={12}>
                        <DebtOverview
                            summary={{
                                totalDebt: summary.totalDebt,
                                minimumPayments: summary.minimumPayments,
                                weightedAverageInterest: summary.weightedAverageInterest,
                                monthlyInterestTotal: summary.monthlyInterestTotal,
                                debtToIncomeRatio: summary.debtToIncomeRatio,
                                monthlyIncome: monthlyIncome
                            }}
                            debts={debts}
                            onEditDebt={handleEditDebt}
                            onDeleteDebt={handleDeleteDebt}
                        />
                    </Grid>

                    {/* Debt Analysis */}
                    <Grid item xs={12}>
                        <DebtAnalysis
                            metrics={{
                                debtToIncomeRatio: summary.debtToIncomeRatio,
                                debtServiceRatio: summary.debtServiceRatio,
                                creditUtilization: summary.creditUtilization,
                                averageInterestRate: summary.weightedAverageInterest,
                                totalInterestPaid: summary.totalInterestPaid,
                                payoffProjection: summary.payoffProjection
                            }}
                            riskFactors={summary.riskFactors}
                            adjustments={summary.adjustments}
                            monthlyIncome={monthlyIncome}
                            projections={summary.projections}
                        />
                    </Grid>
                </Grid>

                {showForm && (
                    <DebtForm
                        open={showForm}
                        onClose={() => setShowForm(false)}
                        onSubmit={handleSubmitDebt}
                        initialValues={selectedDebt}
                        isEditing={!!selectedDebt}
                        monthlyIncome={monthlyIncome}
                    />
                )}
            </Box>
        </Container>
    );
}; 