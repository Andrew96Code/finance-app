import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Tooltip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { Chart } from '../common/Chart';
import { formatCurrency } from '../../utils/formatters';

interface DebtMetrics {
    debtToIncomeRatio: number;
    debtServiceRatio: number;
    creditUtilization: number;
    averageInterestRate: number;
    totalInterestPaid: number;
    payoffProjection: number;
}

interface RiskFactor {
    name: string;
    status: 'high' | 'medium' | 'low';
    value: number;
    threshold: number;
    impact: string;
    recommendation: string;
}

interface DebtTrend {
    month: string;
    totalDebt: number;
    minimumPayments: number;
    actualPayments: number;
    interestPaid: number;
    principalPaid: number;
}

interface DebtAnalysisProps {
    metrics: DebtMetrics;
    riskFactors: RiskFactor[];
    trends: DebtTrend[];
    monthlyIncome: number;
    recommendations: {
        priority: 'high' | 'medium' | 'low';
        action: string;
        impact: string;
        timeline: string;
        potentialSavings: number;
    }[];
}

export const DebtAnalysis: React.FC<DebtAnalysisProps> = ({
    metrics,
    riskFactors,
    trends,
    monthlyIncome,
    recommendations,
}) => {
    const trendData = {
        labels: trends.map((trend) => trend.month),
        datasets: [
            {
                label: 'Total Debt',
                data: trends.map((trend) => trend.totalDebt),
                borderColor: '#f50057',
                backgroundColor: 'rgba(245, 0, 87, 0.1)',
                fill: true,
            },
            {
                label: 'Actual Payments',
                data: trends.map((trend) => trend.actualPayments),
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true,
            },
        ],
    };

    const paymentBreakdownData = {
        labels: trends.map((trend) => trend.month),
        datasets: [
            {
                label: 'Interest Paid',
                data: trends.map((trend) => trend.interestPaid),
                backgroundColor: 'rgba(244, 67, 54, 0.6)',
            },
            {
                label: 'Principal Paid',
                data: trends.map((trend) => trend.principalPaid),
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
            },
        ],
    };

    const getStatusColor = (status: 'high' | 'medium' | 'low') => {
        switch (status) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Debt Analysis & Recommendations
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="h6">
                                    Key Metrics
                                </Typography>
                                <Tooltip title="Important debt-related financial metrics">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Debt-to-Income Ratio
                                        </Typography>
                                        <Typography variant="h4" color={
                                            metrics.debtToIncomeRatio > 0.43 ? 'error.main' :
                                            metrics.debtToIncomeRatio > 0.36 ? 'warning.main' :
                                            'success.main'
                                        }>
                                            {(metrics.debtToIncomeRatio * 100).toFixed(1)}%
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Recommended: Below 36%
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Debt Service Ratio
                                        </Typography>
                                        <Typography variant="h4" color={
                                            metrics.debtServiceRatio > 0.4 ? 'error.main' :
                                            metrics.debtServiceRatio > 0.3 ? 'warning.main' :
                                            'success.main'
                                        }>
                                            {(metrics.debtServiceRatio * 100).toFixed(1)}%
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Recommended: Below 30%
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Credit Utilization
                                        </Typography>
                                        <Typography variant="h4" color={
                                            metrics.creditUtilization > 0.7 ? 'error.main' :
                                            metrics.creditUtilization > 0.3 ? 'warning.main' :
                                            'success.main'
                                        }>
                                            {(metrics.creditUtilization * 100).toFixed(1)}%
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Recommended: Below 30%
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Debt & Payment Trends
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
                                Payment Breakdown
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="bar" data={paymentBreakdownData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="h6">
                                    Risk Assessment
                                </Typography>
                                <Tooltip title="Analysis of key risk factors in your debt profile">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Risk Factor</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Current Value</TableCell>
                                        <TableCell>Threshold</TableCell>
                                        <TableCell>Impact</TableCell>
                                        <TableCell>Recommendation</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {riskFactors.map((factor) => (
                                        <TableRow key={factor.name}>
                                            <TableCell>{factor.name}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={factor.status.toUpperCase()}
                                                    color={getStatusColor(factor.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{factor.value}</TableCell>
                                            <TableCell>{factor.threshold}</TableCell>
                                            <TableCell>{factor.impact}</TableCell>
                                            <TableCell>{factor.recommendation}</TableCell>
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
                                    Action Plan & Recommendations
                                </Typography>
                                <Tooltip title="Prioritized recommendations for debt management">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Grid container spacing={2}>
                                {recommendations.map((rec, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Chip
                                                    label={rec.priority.toUpperCase()}
                                                    color={getStatusColor(rec.priority)}
                                                    size="small"
                                                />
                                                <Typography variant="subtitle1">
                                                    {rec.action}
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Impact: {rec.impact}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Timeline: {rec.timeline}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Potential Savings: {formatCurrency(rec.potentialSavings)}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
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