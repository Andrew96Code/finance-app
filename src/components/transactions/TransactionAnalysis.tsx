import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    IconButton,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { Chart } from '../common/Chart';
import { Transaction, TransactionType, ExpenseCategory } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatters';

interface CategoryAnalysis {
    category: ExpenseCategory;
    amount: number;
    percentage: number;
    transactions: number;
    averageAmount: number;
    trend: number;
}

interface TransactionAnalysisProps {
    transactions: Transaction[];
    timeframe: 'week' | 'month' | 'year';
    previousPeriodComparison: {
        totalSpending: number;
        categoryChanges: Record<ExpenseCategory, number>;
    };
}

export const TransactionAnalysis: React.FC<TransactionAnalysisProps> = ({
    transactions,
    timeframe,
    previousPeriodComparison,
}) => {
    const totalExpenses = transactions
        .filter((t) => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);

    const categoryAnalysis = Object.values(ExpenseCategory).map((category) => {
        const categoryTransactions = transactions.filter(
            (t) => t.type === TransactionType.EXPENSE && t.category === category
        );
        const categoryTotal = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        return {
            category,
            amount: categoryTotal,
            percentage: (categoryTotal / totalExpenses) * 100,
            transactions: categoryTransactions.length,
            averageAmount: categoryTotal / (categoryTransactions.length || 1),
            trend: previousPeriodComparison.categoryChanges[category] || 0,
        };
    }).sort((a, b) => b.amount - a.amount);

    const spendingTrend = {
        labels: ['Previous Period', 'Current Period'],
        datasets: [
            {
                label: 'Total Spending',
                data: [previousPeriodComparison.totalSpending, totalExpenses],
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true,
            },
        ],
    };

    const categoryDistribution = {
        labels: categoryAnalysis.map((cat) => cat.category),
        datasets: [
            {
                data: categoryAnalysis.map((cat) => cat.amount),
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

    const spendingByDay = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Average Spending',
                data: [/* Calculate daily averages */],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Transaction Analysis
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Spending Overview
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="line" data={spendingTrend} />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="textSecondary">
                                    {`${((totalExpenses - previousPeriodComparison.totalSpending) / previousPeriodComparison.totalSpending * 100).toFixed(1)}% change from previous ${timeframe}`}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Category Distribution
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="doughnut" data={categoryDistribution} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="h6">
                                    Category Analysis
                                </Typography>
                                <Tooltip title="Detailed breakdown of spending by category">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Category</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">% of Total</TableCell>
                                        <TableCell align="right"># Transactions</TableCell>
                                        <TableCell align="right">Avg. Amount</TableCell>
                                        <TableCell align="right">Trend</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categoryAnalysis.map((category) => (
                                        <TableRow key={category.category}>
                                            <TableCell>{category.category}</TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(category.amount)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {category.percentage.toFixed(1)}%
                                            </TableCell>
                                            <TableCell align="right">
                                                {category.transactions}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(category.averageAmount)}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    color: category.trend > 0 ? 'error.main' : 'success.main',
                                                }}
                                            >
                                                {category.trend > 0 ? '+' : ''}
                                                {category.trend.toFixed(1)}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Daily Spending Pattern
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="bar" data={spendingByDay} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}; 