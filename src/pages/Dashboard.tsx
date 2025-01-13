import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { DashboardOverview } from '../components/dashboard/DashboardOverview';
import { ExpenseAnalysis } from '../components/dashboard/ExpenseAnalysis';
import { FinancialHealth } from '../components/dashboard/FinancialHealth';
import { FinancialRecommendations } from '../components/dashboard/FinancialRecommendations';
import { GoalOverview } from '../components/goals/GoalOverview';
import { GoalAnalysis } from '../components/goals/GoalAnalysis';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { fetchDashboard } from '../store/slices/userSlice';
import { fetchGoals } from '../store/slices/goalSlice';

export const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading } = useProtectedRoute();
    const [selectedTimeframe, setSelectedTimeframe] = useState('month');
    
    const {
        dashboard,
        isLoading: isDashboardLoading,
    } = useAppSelector((state) => state.user);
    
    const {
        goals,
        analysis: goalAnalysis,
        isLoading: isGoalsLoading
    } = useAppSelector((state) => state.goals);

    useEffect(() => {
        dispatch(fetchDashboard());
        dispatch(fetchGoals());
    }, [dispatch]);

    if (isLoading || isDashboardLoading || isGoalsLoading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!dashboard) {
        return (
            <Container>
                <Typography variant="h5" color="error">
                    Error loading dashboard data
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4">
                        Financial Dashboard
                    </Typography>
                    <Box>
                        <Button
                            variant={selectedTimeframe === 'month' ? 'contained' : 'outlined'}
                            onClick={() => setSelectedTimeframe('month')}
                            sx={{ mr: 1 }}
                        >
                            Monthly
                        </Button>
                        <Button
                            variant={selectedTimeframe === 'year' ? 'contained' : 'outlined'}
                            onClick={() => setSelectedTimeframe('year')}
                        >
                            Yearly
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    {/* Overview Section */}
                    <Grid item xs={12}>
                        <DashboardOverview
                            monthlyIncome={dashboard.monthlyIncome}
                            monthlyExpenses={dashboard.monthlyExpenses}
                            totalSavings={dashboard.totalSavings}
                            totalDebt={dashboard.totalDebt}
                            debtToIncomeRatio={dashboard.debtToIncomeRatio}
                        />
                    </Grid>

                    {/* Expense Analysis */}
                    <Grid item xs={12} md={6}>
                        <ExpenseAnalysis
                            monthlyExpenses={dashboard.expensesByCategory}
                            monthlyTrend={dashboard.expenseTrends}
                        />
                    </Grid>

                    {/* Financial Health */}
                    <Grid item xs={12} md={6}>
                        <FinancialHealth
                            ratios={{
                                savingsRate: dashboard.savingsRate,
                                debtToIncome: dashboard.debtToIncomeRatio,
                                emergencyFundRatio: dashboard.emergencyFundRatio,
                                housingExpenseRatio: dashboard.housingExpenseRatio,
                                investmentAllocation: dashboard.investmentAllocation
                            }}
                        />
                    </Grid>

                    {/* Goals Section */}
                    <Grid item xs={12}>
                        <GoalOverview
                            summary={{
                                totalGoals: goals.length,
                                totalTargetAmount: goals.reduce((sum, goal) => sum + goal.targetAmount, 0),
                                totalCurrentAmount: goals.reduce((sum, goal) => sum + goal.currentAmount, 0),
                                averageProgress: goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount * 100), 0) / goals.length,
                                onTrackCount: goals.filter(goal => goal.isOnTrack).length,
                                atRiskCount: goals.filter(goal => !goal.isOnTrack).length
                            }}
                            goals={goals}
                            trends={goalAnalysis.trends}
                            monthlyIncome={dashboard.monthlyIncome}
                        />
                    </Grid>

                    {/* Goal Analysis */}
                    <Grid item xs={12}>
                        <GoalAnalysis
                            metrics={goalAnalysis.metrics}
                            riskFactors={goalAnalysis.riskFactors}
                            adjustments={goalAnalysis.adjustments}
                            monthlyIncome={dashboard.monthlyIncome}
                            savingsCapacity={dashboard.savingsCapacity}
                            projections={goalAnalysis.projections}
                        />
                    </Grid>

                    {/* Recommendations */}
                    <Grid item xs={12}>
                        <FinancialRecommendations
                            recommendations={dashboard.recommendations}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}; 