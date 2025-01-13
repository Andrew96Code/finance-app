import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    SvgIconProps,
    useTheme,
} from '@mui/material';

interface SummaryCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ComponentType<SvgIconProps>;
    progress?: number;
    trend?: {
        value: number;
        label: string;
    };
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    progress,
    trend,
    color = 'primary',
}) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
            }}
        >
            {Icon && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: -20,
                        right: 20,
                        backgroundColor: theme.palette[color].main,
                        borderRadius: '50%',
                        width: 56,
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: theme.shadows[4],
                    }}
                >
                    <Icon sx={{ color: '#fff', fontSize: 32 }} />
                </Box>
            )}
            <CardContent sx={{ pt: Icon ? 4 : 2, pb: 2, flexGrow: 1 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" component="div" gutterBottom>
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" color="textSecondary">
                        {subtitle}
                    </Typography>
                )}
                {progress !== undefined && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            color={color}
                            sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mt: 0.5 }}
                        >
                            {`${Math.round(progress)}% Complete`}
                        </Typography>
                    </Box>
                )}
                {trend && (
                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Typography
                            variant="body2"
                            color={trend.value >= 0 ? 'success.main' : 'error.main'}
                        >
                            {trend.value >= 0 ? '+' : ''}
                            {trend.value}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {trend.label}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}; 