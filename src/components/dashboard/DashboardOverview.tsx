import React from 'react';
import { Grid, Typography } from '@mui/material';
import { SummaryCard } from '../common/SummaryCard';
import {
    AccountBalance,
    TrendingUp,
    TrendingDown,
    Savings,
    CreditCard,
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';

interface DashboardOverviewProps {
    monthlyIncome: number;
    monthlyExpenses: number;
    totalSavings: number;
    totalDebt: number;
    debtToIncomeRatio: number;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
    monthlyIncome,
    monthlyExpenses,
    totalSavings,
    totalDebt,
    debtToIncomeRatio,
}) => {
    const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
    const debtToIncomePercentage = debtToIncomeRatio * 100;

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Financial Overview
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <SummaryCard
                        title="Monthly Income"
                        value={formatCurrency(monthlyIncome)}
                        icon={TrendingUp}
                        color="success"
                        trend={{
                            value: savingsRate,
                            label: 'Savings Rate',
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <SummaryCard
                        title="Monthly Expenses"
                        value={formatCurrency(monthlyExpenses)}
                        icon={TrendingDown}
                        color="error"
                        subtitle={`${((monthlyExpenses / monthlyIncome) * 100).toFixed(1)}% of Income`}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <SummaryCard
                        title="Total Savings"
                        value={formatCurrency(totalSavings)}
                        icon={Savings}
                        color="info"
                        progress={savingsRate}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <SummaryCard
                        title="Total Debt"
                        value={formatCurrency(totalDebt)}
                        icon={CreditCard}
                        color="warning"
                        subtitle="Click for detailed breakdown"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <SummaryCard
                        title="Debt-to-Income Ratio"
                        value={`${debtToIncomePercentage.toFixed(1)}%`}
                        icon={AccountBalance}
                        color={debtToIncomePercentage > 43 ? 'error' : 'success'}
                        subtitle={debtToIncomePercentage > 43 ? 'Above recommended 43%' : 'Within healthy range'}
                        progress={Math.min(debtToIncomePercentage, 100)}
                    />
                </Grid>
            </Grid>
        </div>
    );
}; 