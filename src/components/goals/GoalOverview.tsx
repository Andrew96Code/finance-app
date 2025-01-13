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
    Chip,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { Chart } from '../common/Chart';
import { SummaryCard } from '../common/SummaryCard';
import { formatCurrency } from '../../utils/formatters';

interface GoalSummary {
    totalGoals: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    averageProgress: number;
    onTrackCount: number;
    atRiskCount: number;
}

interface GoalProgress {
    name: string;
    type: string;
    targetAmount: number;
    currentAmount: number;
    monthlyContribution: number;
    deadline: Date;
    progress: number;
    projectedAmount: number;
    isOnTrack: boolean;
    remainingMonths: number;
    monthlyNeeded: number;
}

interface GoalTrend {
    month: string;
    planned: number;
    actual: number;
    contributions: number;
}

interface GoalOverviewProps {
    summary: GoalSummary;
    goals: GoalProgress[];
    trends: GoalTrend[];
    monthlyIncome: number;
}

export const GoalOverview: React.FC<GoalOverviewProps> = ({
    summary,
    goals,
    trends,
    monthlyIncome,
}) => {
    const trendData = {
        labels: trends.map((trend) => trend.month),
        datasets: [
            {
                label: 'Planned Progress',
                data: trends.map((trend) => trend.planned),
                borderColor: '#2196f3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true,
            },
            {
                label: 'Actual Progress',
                data: trends.map((trend) => trend.actual),
                borderColor: '#4caf50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true,
            },
            {
                label: 'Monthly Contributions',
                data: trends.map((trend) => trend.contributions),
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                fill: true,
            },
        ],
    };

    const goalDistributionData = {
        labels: goals.map((goal) => goal.name),
        datasets: [
            {
                data: goals.map((goal) => goal.targetAmount),
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

    const getStatusColor = (progress: number, isOnTrack: boolean) => {
        if (!isOnTrack) return 'error';
        if (progress >= 90) return 'success';
        if (progress >= 60) return 'info';
        return 'warning';
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Financial Goals Overview
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <SummaryCard
                        title="Total Progress"
                        value={`${summary.averageProgress.toFixed(1)}%`}
                        subtitle={`${summary.onTrackCount} of ${summary.totalGoals} goals on track`}
                        progress={summary.averageProgress}
                        color={summary.onTrackCount === summary.totalGoals ? 'success' : 'warning'}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <SummaryCard
                        title="Total Saved"
                        value={formatCurrency(summary.totalCurrentAmount)}
                        subtitle={`${((summary.totalCurrentAmount / summary.totalTargetAmount) * 100).toFixed(1)}% of target`}
                        progress={(summary.totalCurrentAmount / summary.totalTargetAmount) * 100}
                        color="info"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <SummaryCard
                        title="At Risk Goals"
                        value={summary.atRiskCount.toString()}
                        subtitle={`${((summary.atRiskCount / summary.totalGoals) * 100).toFixed(1)}% need attention`}
                        color={summary.atRiskCount > 0 ? 'error' : 'success'}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Savings Progress Trend
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
                                Goal Distribution
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Chart type="doughnut" data={goalDistributionData} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Typography variant="h6">
                                    Goal Progress Tracking
                                </Typography>
                                <Tooltip title="Detailed progress tracking for each financial goal">
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Grid container spacing={2}>
                                {goals.map((goal) => (
                                    <Grid item xs={12} key={goal.name}>
                                        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Typography variant="subtitle1">
                                                    {goal.name}
                                                </Typography>
                                                <Chip
                                                    label={goal.type}
                                                    size="small"
                                                    color="default"
                                                />
                                                <Chip
                                                    label={goal.isOnTrack ? 'On Track' : 'At Risk'}
                                                    size="small"
                                                    color={goal.isOnTrack ? 'success' : 'error'}
                                                />
                                            </Box>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ mb: 1 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Progress: {goal.progress.toFixed(1)}%
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={goal.progress}
                                                            color={getStatusColor(goal.progress, goal.isOnTrack)}
                                                            sx={{ height: 8, borderRadius: 4 }}
                                                        />
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Monthly Contribution
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {formatCurrency(goal.monthlyContribution)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Monthly Needed
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {formatCurrency(goal.monthlyNeeded)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Remaining Time
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {goal.remainingMonths} months
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Projected Amount
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {formatCurrency(goal.projectedAmount)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
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