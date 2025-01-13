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
import { ExpenseCategory } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatters';

interface CategoryProgress {
    category: ExpenseCategory;
    budgeted: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
}

interface BudgetOverviewProps {
    month: Date;
    totalBudget: number;
    totalSpent: number;
    savingsGoal: number;
    currentSavings: number;
    emergencyFundGoal: number;
    currentEmergencyFund: number;
    categoryProgress: CategoryProgress[];
    spendingTrend: {
        labels: string[];
        budgeted: number[];
        actual: number[];
    };
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
    month,
    totalBudget,
    totalSpent,
    savingsGoal,
    currentSavings,
    emergencyFundGoal,
    currentEmergencyFund,
    categoryProgress,
    spendingTrend,
}) => {
    const remainingBudget = totalBudget - totalSpent;
    const percentageSpent = (totalSpent / totalBudget) * 100;
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const currentDay = new Date().getDate();
    const expectedPercentage = (currentDay / daysInMonth) * 100;

    const spendingStatus = percentageSpent > expectedPercentage ? 'Over' : 'Under';
    const savingsProgress = (currentSavings / savingsGoal) * 100;
    const emergencyFundProgress = (currentEmergencyFund / emergencyFundGoal) * 100;

    const trendData = {
        labels: spendingTrend.labels,
        datasets: [
            {
                label: 'Budgeted',
                data: spendingTrend.budgeted,
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true,
            },
            {
                label: 'Actual',
                data: spendingTrend.actual,
                borderColor: '#f50057',
                backgroundColor: 'rgba(245, 0, 87, 0.1)',
                fill: true,
            },
        ],
    };

    const categoryData = {
        labels: categoryProgress.map((cat) => cat.category),
        datasets: [
            {
                label: 'Budget Used (%)',
                data: categoryProgress.map((cat) => cat.percentageUsed),
                backgroundColor: categoryProgress.map((cat) =>
                    cat.percentageUsed > 100
                        ? 'rgba(244, 67, 54, 0.8)'
                        : cat.percentageUsed > 90
                        ? 'rgba(255, 152, 0, 0.8)'
                        : 'rgba(76, 175, 80, 0.8)'
                ),
            },
        ],
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Budget Overview - {month.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <SummaryCard
                        title="Total Budget"
                        value={formatCurrency(totalBudget)}
                        subtitle={`${formatCurrency(remainingBudget)} remaining`}
                        progress={percentageSpent}
                        color={percentageSpent > expectedPercentage ? 'warning' : 'success'}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <SummaryCard
                        title="Savings Progress"
                        value={formatCurrency(currentSavings)}
                        subtitle={`Goal: ${formatCurrency(savingsGoal)}`}
                        progress={savingsProgress}
                        color={savingsProgress >= 100 ? 'success' : 'info'}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <SummaryCard
                        title="Emergency Fund"
                        value={formatCurrency(currentEmergencyFund)}
                        subtitle={`Target: ${formatCurrency(emergencyFundGoal)}`}
                        progress={emergencyFundProgress}
                        color={emergencyFundProgress >= 100 ? 'success' : 'warning'}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Spending Trend
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="line" data={trendData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Category Progress
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="bar" data={categoryData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="h6">
                                    Category Details
                                </Typography>
                                <Tooltip title="Shows budget usage by category">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Grid container spacing={2}>
                                {categoryProgress.map((category) => (
                                    <Grid item xs={12} sm={6} md={4} key={category.category}>
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="subtitle2">
                                                    {category.category}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle2"
                                                    color={
                                                        category.percentageUsed > 100
                                                            ? 'error'
                                                            : category.percentageUsed > 90
                                                            ? 'warning.main'
                                                            : 'success.main'
                                                    }
                                                >
                                                    {category.percentageUsed.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Math.min(category.percentageUsed, 100)}
                                                color={
                                                    category.percentageUsed > 100
                                                        ? 'error'
                                                        : category.percentageUsed > 90
                                                        ? 'warning'
                                                        : 'success'
                                                }
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                <Typography variant="caption" color="textSecondary">
                                                    Spent: {formatCurrency(category.spent)}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Remaining: {formatCurrency(category.remaining)}
                                                </Typography>
                                            </Box>
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