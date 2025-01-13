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

interface GoalMetrics {
    totalSavingsRate: number;
    goalAllocationRatio: number;
    timeToGoalAverage: number;
    successProbability: number;
    riskScore: number;
    adjustmentNeeded: number;
}

interface RiskFactor {
    name: string;
    status: 'high' | 'medium' | 'low';
    value: number;
    threshold: number;
    impact: string;
    recommendation: string;
}

interface GoalAdjustment {
    goalName: string;
    currentContribution: number;
    recommendedContribution: number;
    impact: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
}

interface GoalAnalysisProps {
    metrics: GoalMetrics;
    riskFactors: RiskFactor[];
    adjustments: GoalAdjustment[];
    monthlyIncome: number;
    savingsCapacity: number;
    projections: {
        labels: string[];
        baseline: number[];
        optimized: number[];
        withAdjustments: number[];
    };
}

export const GoalAnalysis: React.FC<GoalAnalysisProps> = ({
    metrics,
    riskFactors,
    adjustments,
    monthlyIncome,
    savingsCapacity,
    projections,
}) => {
    const projectionData = {
        labels: projections.labels,
        datasets: [
            {
                label: 'Baseline Progress',
                data: projections.baseline,
                borderColor: '#f50057',
                backgroundColor: 'rgba(245, 0, 87, 0.1)',
                fill: true,
            },
            {
                label: 'Optimized Progress',
                data: projections.optimized,
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true,
            },
            {
                label: 'With Adjustments',
                data: projections.withAdjustments,
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true,
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
                Goal Strategy Analysis
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="h6">
                                    Key Performance Indicators
                                </Typography>
                                <Tooltip title="Important metrics for goal achievement">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Savings Rate
                                        </Typography>
                                        <Typography variant="h4" color={
                                            metrics.totalSavingsRate < 0.1 ? 'error.main' :
                                            metrics.totalSavingsRate < 0.2 ? 'warning.main' :
                                            'success.main'
                                        }>
                                            {(metrics.totalSavingsRate * 100).toFixed(1)}%
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Recommended: Above 20%
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Success Probability
                                        </Typography>
                                        <Typography variant="h4" color={
                                            metrics.successProbability < 0.6 ? 'error.main' :
                                            metrics.successProbability < 0.8 ? 'warning.main' :
                                            'success.main'
                                        }>
                                            {(metrics.successProbability * 100).toFixed(1)}%
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Target: Above 80%
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Risk Score
                                        </Typography>
                                        <Typography variant="h4" color={
                                            metrics.riskScore > 0.7 ? 'error.main' :
                                            metrics.riskScore > 0.3 ? 'warning.main' :
                                            'success.main'
                                        }>
                                            {(metrics.riskScore * 100).toFixed(1)}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Lower is better
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Goal Achievement Projections
                            </Typography>
                            <Box sx={{ height: 400 }}>
                                <Chart type="line" data={projectionData} />
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
                                <Tooltip title="Analysis of factors that could impact goal achievement">
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
                                    Recommended Adjustments
                                </Typography>
                                <Tooltip title="Suggested changes to improve goal achievement probability">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Grid container spacing={2}>
                                {adjustments.map((adjustment, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Chip
                                                    label={adjustment.priority.toUpperCase()}
                                                    color={getStatusColor(adjustment.priority)}
                                                    size="small"
                                                />
                                                <Typography variant="subtitle1">
                                                    {adjustment.goalName}
                                                </Typography>
                                            </Box>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={3}>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Current Contribution
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {formatCurrency(adjustment.currentContribution)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Recommended Contribution
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {formatCurrency(adjustment.recommendedContribution)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Impact
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {adjustment.impact}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Reason
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {adjustment.reason}
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