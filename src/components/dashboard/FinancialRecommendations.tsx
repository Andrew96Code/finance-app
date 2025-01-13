import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Grid,
} from '@mui/material';
import {
    PriorityHigh as UrgentIcon,
    CheckCircle as ActionableIcon,
    Lightbulb as InsightIcon,
    TrendingUp as ImprovementIcon,
} from '@mui/icons-material';

interface Recommendation {
    id: number;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    type: 'urgent' | 'actionable' | 'insight' | 'improvement';
    metric?: string;
    action?: string;
}

interface FinancialRecommendationsProps {
    recommendations: Recommendation[];
}

export const FinancialRecommendations: React.FC<FinancialRecommendationsProps> = ({
    recommendations,
}) => {
    const getIcon = (type: Recommendation['type']) => {
        switch (type) {
            case 'urgent':
                return <UrgentIcon color="error" />;
            case 'actionable':
                return <ActionableIcon color="success" />;
            case 'insight':
                return <InsightIcon color="info" />;
            case 'improvement':
                return <ImprovementIcon color="primary" />;
        }
    };

    const getImpactColor = (impact: Recommendation['impact']) => {
        switch (impact) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'success';
        }
    };

    const groupedRecommendations = recommendations.reduce((acc, rec) => {
        if (!acc[rec.type]) {
            acc[rec.type] = [];
        }
        acc[rec.type].push(rec);
        return acc;
    }, {} as Record<Recommendation['type'], Recommendation[]>);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Financial Recommendations
            </Typography>
            <Grid container spacing={3}>
                {Object.entries(groupedRecommendations).map(([type, recs]) => (
                    <Grid item xs={12} md={6} key={type}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                                    {type} Items
                                </Typography>
                                <List>
                                    {recs.map((recommendation) => (
                                        <ListItem
                                            key={recommendation.id}
                                            alignItems="flex-start"
                                            sx={{
                                                borderLeft: 3,
                                                borderColor: `${getImpactColor(recommendation.impact)}.main`,
                                                mb: 2,
                                                bgcolor: 'background.paper',
                                                borderRadius: 1,
                                            }}
                                        >
                                            <ListItemIcon>{getIcon(recommendation.type)}</ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="subtitle1">
                                                            {recommendation.title}
                                                        </Typography>
                                                        <Chip
                                                            label={`Impact: ${recommendation.impact}`}
                                                            size="small"
                                                            color={getImpactColor(recommendation.impact)}
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{ mt: 1 }}>
                                                        <Typography
                                                            variant="body2"
                                                            color="textPrimary"
                                                            paragraph
                                                        >
                                                            {recommendation.description}
                                                        </Typography>
                                                        {recommendation.metric && (
                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                            >
                                                                Current Metric: {recommendation.metric}
                                                            </Typography>
                                                        )}
                                                        {recommendation.action && (
                                                            <Typography
                                                                variant="body2"
                                                                color="primary"
                                                                sx={{ mt: 1 }}
                                                            >
                                                                Recommended Action: {recommendation.action}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}; 