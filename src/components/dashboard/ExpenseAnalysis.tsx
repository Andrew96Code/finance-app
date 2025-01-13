import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { Chart } from '../common/Chart';
import { formatCurrency } from '../../utils/formatters';

interface ExpenseCategory {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

interface ExpenseAnalysisProps {
    monthlyExpenses: ExpenseCategory[];
    monthlyTrend: {
        labels: string[];
        expenses: number[];
    };
}

export const ExpenseAnalysis: React.FC<ExpenseAnalysisProps> = ({
    monthlyExpenses,
    monthlyTrend,
}) => {
    const doughnutData = {
        labels: monthlyExpenses.map((expense) => expense.category),
        datasets: [
            {
                data: monthlyExpenses.map((expense) => expense.amount),
                backgroundColor: monthlyExpenses.map((expense) => expense.color),
                borderWidth: 1,
            },
        ],
    };

    const trendData = {
        labels: monthlyTrend.labels,
        datasets: [
            {
                label: 'Monthly Expenses',
                data: monthlyTrend.expenses,
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true,
            },
        ],
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Expense Analysis
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Expenses by Category
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="doughnut" data={doughnutData} />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                {monthlyExpenses.map((expense) => (
                                    <Box
                                        key={expense.category}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 1,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    backgroundColor: expense.color,
                                                    mr: 1,
                                                }}
                                            />
                                            <Typography>{expense.category}</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography>{formatCurrency(expense.amount)}</Typography>
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                            >
                                                {expense.percentage.toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Monthly Expense Trend
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="line" data={trendData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}; 