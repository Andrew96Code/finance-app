import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Tooltip, IconButton } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { SummaryCard } from '../common/SummaryCard';

interface FinancialRatio {
    name: string;
    value: number;
    benchmark: number;
    description: string;
    status: 'success' | 'warning' | 'error';
}

interface FinancialHealthProps {
    ratios: {
        savingsRate: FinancialRatio;
        debtToIncome: FinancialRatio;
        emergencyFundRatio: FinancialRatio;
        housingExpenseRatio: FinancialRatio;
        investmentAllocation: FinancialRatio;
    };
}

export const FinancialHealth: React.FC<FinancialHealthProps> = ({ ratios }) => {
    const renderRatioCard = (ratio: FinancialRatio) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
                sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: `${ratio.status}.main`,
                    mr: 2,
                }}
            />
            <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle2">{ratio.name}</Typography>
                    <Tooltip title={ratio.description}>
                        <IconButton size="small">
                            <InfoIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Typography variant="h6">
                    {ratio.value.toFixed(1)}%
                    <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                    >
                        vs {ratio.benchmark}% benchmark
                    </Typography>
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Financial Health Indicators
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Key Financial Ratios
                            </Typography>
                            {renderRatioCard(ratios.savingsRate)}
                            {renderRatioCard(ratios.debtToIncome)}
                            {renderRatioCard(ratios.emergencyFundRatio)}
                            {renderRatioCard(ratios.housingExpenseRatio)}
                            {renderRatioCard(ratios.investmentAllocation)}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <SummaryCard
                                title="Emergency Fund Coverage"
                                value={`${ratios.emergencyFundRatio.value.toFixed(1)} months`}
                                color={ratios.emergencyFundRatio.status}
                                subtitle={`Target: ${ratios.emergencyFundRatio.benchmark} months of expenses`}
                                progress={(ratios.emergencyFundRatio.value / ratios.emergencyFundRatio.benchmark) * 100}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SummaryCard
                                title="Housing Cost Burden"
                                value={`${ratios.housingExpenseRatio.value.toFixed(1)}%`}
                                color={ratios.housingExpenseRatio.status}
                                subtitle={ratios.housingExpenseRatio.value > 30 ? 'Above recommended 30%' : 'Within recommended range'}
                                progress={Math.min(ratios.housingExpenseRatio.value, 100)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}; 