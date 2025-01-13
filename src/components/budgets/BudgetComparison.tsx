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
import { ExpenseCategory } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatters';

interface MonthlyComparison {
    month: string;
    budgeted: number;
    actual: number;
    variance: number;
    variancePercentage: number;
}

interface CategoryComparison {
    category: ExpenseCategory;
    previousBudget: number;
    previousActual: number;
    currentBudget: number;
    currentActual: number;
    trend: number;
}

interface BudgetComparisonProps {
    monthlyComparison: MonthlyComparison[];
    categoryComparison: CategoryComparison[];
    savingsComparison: {
        labels: string[];
        planned: number[];
        actual: number[];
    };
}

export const BudgetComparison: React.FC<BudgetComparisonProps> = ({
    monthlyComparison,
    categoryComparison,
    savingsComparison,
}) => {
    const monthlyTrendData = {
        labels: monthlyComparison.map((item) => item.month),
        datasets: [
            {
                label: 'Budgeted',
                data: monthlyComparison.map((item) => item.budgeted),
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true,
            },
            {
                label: 'Actual',
                data: monthlyComparison.map((item) => item.actual),
                borderColor: '#f50057',
                backgroundColor: 'rgba(245, 0, 87, 0.1)',
                fill: true,
            },
        ],
    };

    const savingsTrendData = {
        labels: savingsComparison.labels,
        datasets: [
            {
                label: 'Planned Savings',
                data: savingsComparison.planned,
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true,
            },
            {
                label: 'Actual Savings',
                data: savingsComparison.actual,
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                fill: true,
            },
        ],
    };

    const categoryTrendData = {
        labels: categoryComparison.map((cat) => cat.category),
        datasets: [
            {
                label: 'Previous Budget',
                data: categoryComparison.map((cat) => cat.previousBudget),
                backgroundColor: 'rgba(33, 150, 243, 0.6)',
            },
            {
                label: 'Previous Actual',
                data: categoryComparison.map((cat) => cat.previousActual),
                backgroundColor: 'rgba(245, 0, 87, 0.6)',
            },
            {
                label: 'Current Budget',
                data: categoryComparison.map((cat) => cat.currentBudget),
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
            },
            {
                label: 'Current Actual',
                data: categoryComparison.map((cat) => cat.currentActual),
                backgroundColor: 'rgba(255, 152, 0, 0.6)',
            },
        ],
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Budget Comparison Analysis
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Monthly Budget vs Actual Trend
                            </Typography>
                            <Box sx={{ height: 400 }}>
                                <Chart type="line" data={monthlyTrendData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Savings Trend
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="line" data={savingsTrendData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Category Comparison
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="bar" data={categoryTrendData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="h6">
                                    Monthly Performance Details
                                </Typography>
                                <Tooltip title="Shows monthly budget performance and variances">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Month</TableCell>
                                        <TableCell align="right">Budgeted</TableCell>
                                        <TableCell align="right">Actual</TableCell>
                                        <TableCell align="right">Variance</TableCell>
                                        <TableCell align="right">Variance %</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {monthlyComparison.map((month) => (
                                        <TableRow key={month.month}>
                                            <TableCell>{month.month}</TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(month.budgeted)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(month.actual)}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    color:
                                                        month.variance < 0
                                                            ? 'error.main'
                                                            : 'success.main',
                                                }}
                                            >
                                                {formatCurrency(Math.abs(month.variance))}
                                                {month.variance < 0 ? ' Over' : ' Under'}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    color:
                                                        month.variancePercentage < 0
                                                            ? 'error.main'
                                                            : 'success.main',
                                                }}
                                            >
                                                {month.variancePercentage > 0 ? '+' : ''}
                                                {month.variancePercentage.toFixed(1)}%
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="h6">
                                    Category Trend Analysis
                                </Typography>
                                <Tooltip title="Shows category-wise budget trends and changes">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Category</TableCell>
                                        <TableCell align="right">Previous Budget</TableCell>
                                        <TableCell align="right">Previous Actual</TableCell>
                                        <TableCell align="right">Current Budget</TableCell>
                                        <TableCell align="right">Current Actual</TableCell>
                                        <TableCell align="right">Trend</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categoryComparison.map((category) => (
                                        <TableRow key={category.category}>
                                            <TableCell>{category.category}</TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(category.previousBudget)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(category.previousActual)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(category.currentBudget)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(category.currentActual)}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    color:
                                                        category.trend > 0
                                                            ? 'error.main'
                                                            : 'success.main',
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
            </Grid>
        </Box>
    );
}; 