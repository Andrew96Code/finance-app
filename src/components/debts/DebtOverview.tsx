import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    LinearProgress,
    Tooltip,
    IconButton,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { Chart } from '../common/Chart';
import { SummaryCard } from '../common/SummaryCard';
import { formatCurrency } from '../../utils/formatters';

interface DebtSummary {
    totalDebt: number;
    totalMinimumPayments: number;
    weightedAverageInterest: number;
    monthlyInterestTotal: number;
    debtToIncomeRatio: number;
    monthlyIncome: number;
}

interface DebtByType {
    type: string;
    amount: number;
    percentage: number;
    count: number;
    averageInterest: number;
}

interface DebtPayoffStrategy {
    name: string;
    debts: {
        creditor: string;
        balance: number;
        interestRate: number;
        minimumPayment: number;
        monthsToPayoff: number;
        totalInterest: number;
    }[];
    totalMonthsToPayoff: number;
    totalInterestPaid: number;
}

interface DebtOverviewProps {
    summary: DebtSummary;
    debtsByType: DebtByType[];
    payoffStrategies: {
        avalanche: DebtPayoffStrategy;
        snowball: DebtPayoffStrategy;
    };
    paymentTrend: {
        labels: string[];
        principal: number[];
        interest: number[];
    };
}

export const DebtOverview: React.FC<DebtOverviewProps> = ({
    summary,
    debtsByType,
    payoffStrategies,
    paymentTrend,
}) => {
    const debtTypeData = {
        labels: debtsByType.map((debt) => debt.type),
        datasets: [
            {
                data: debtsByType.map((debt) => debt.amount),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
            },
        ],
    };

    const paymentTrendData = {
        labels: paymentTrend.labels,
        datasets: [
            {
                label: 'Principal',
                data: paymentTrend.principal,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                label: 'Interest',
                data: paymentTrend.interest,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Debt Overview
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <SummaryCard
                        title="Total Debt"
                        value={formatCurrency(summary.totalDebt)}
                        subtitle={`${summary.debtToIncomeRatio.toFixed(1)}x Annual Income`}
                        color={summary.debtToIncomeRatio > 2 ? 'error' : 'warning'}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <SummaryCard
                        title="Monthly Payments"
                        value={formatCurrency(summary.totalMinimumPayments)}
                        subtitle={`${((summary.totalMinimumPayments / summary.monthlyIncome) * 100).toFixed(1)}% of Income`}
                        color={summary.totalMinimumPayments / summary.monthlyIncome > 0.4 ? 'error' : 'warning'}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <SummaryCard
                        title="Monthly Interest"
                        value={formatCurrency(summary.monthlyInterestTotal)}
                        subtitle={`${summary.weightedAverageInterest.toFixed(1)}% Avg Rate`}
                        color={summary.weightedAverageInterest > 15 ? 'error' : 'warning'}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Debt Distribution by Type
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="doughnut" data={debtTypeData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Principal vs Interest Payments
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="bar" data={paymentTrendData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="h6">
                                    Debt Payoff Strategies
                                </Typography>
                                <Tooltip title="Comparison of debt avalanche (highest interest first) vs snowball (lowest balance first) methods">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Grid container spacing={3}>
                                {['avalanche', 'snowball'].map((strategy) => (
                                    <Grid item xs={12} md={6} key={strategy}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {strategy.charAt(0).toUpperCase() + strategy.slice(1)} Method
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                Total Months: {payoffStrategies[strategy].totalMonthsToPayoff}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                Total Interest: {formatCurrency(payoffStrategies[strategy].totalInterestPaid)}
                                            </Typography>
                                            {payoffStrategies[strategy].debts.map((debt, index) => (
                                                <Box key={debt.creditor} sx={{ mt: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="body2">
                                                            {index + 1}. {debt.creditor}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {debt.monthsToPayoff} months
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Balance: {formatCurrency(debt.balance)}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Rate: {debt.interestRate}%
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={100}
                                                        sx={{ height: 4, borderRadius: 2 }}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="h6">
                                    Debt Analysis by Type
                                </Typography>
                                <Tooltip title="Detailed breakdown of debts by type">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Grid container spacing={2}>
                                {debtsByType.map((debt) => (
                                    <Grid item xs={12} sm={6} md={4} key={debt.type}>
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="subtitle2">
                                                    {debt.type}
                                                </Typography>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    {debt.count} {debt.count === 1 ? 'account' : 'accounts'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="body2">
                                                    {formatCurrency(debt.amount)}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {debt.percentage.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" color="textSecondary">
                                                Avg Interest: {debt.averageInterest.toFixed(1)}%
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={debt.percentage}
                                                sx={{ height: 4, borderRadius: 2 }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}; 