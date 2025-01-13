import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Box, useTheme } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

type ChartType = 'line' | 'bar' | 'pie' | 'doughnut';

interface ChartProps {
    type: ChartType;
    data: ChartData<any>;
    options?: ChartOptions<any>;
    height?: number;
}

export const Chart: React.FC<ChartProps> = ({
    type,
    data,
    options,
    height = 300,
}) => {
    const theme = useTheme();

    const defaultOptions: ChartOptions<any> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: theme.palette.text.primary,
                },
            },
            title: {
                display: true,
                color: theme.palette.text.primary,
            },
        },
        scales: type === 'line' || type === 'bar'
            ? {
                x: {
                    grid: {
                        color: theme.palette.divider,
                    },
                    ticks: {
                        color: theme.palette.text.secondary,
                    },
                },
                y: {
                    grid: {
                        color: theme.palette.divider,
                    },
                    ticks: {
                        color: theme.palette.text.secondary,
                    },
                },
            }
            : undefined,
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
    };

    const renderChart = () => {
        switch (type) {
            case 'line':
                return <Line data={data} options={mergedOptions} />;
            case 'bar':
                return <Bar data={data} options={mergedOptions} />;
            case 'pie':
                return <Pie data={data} options={mergedOptions} />;
            case 'doughnut':
                return <Doughnut data={data} options={mergedOptions} />;
            default:
                return null;
        }
    };

    return (
        <Box
            sx={{
                height,
                width: '100%',
                position: 'relative',
            }}
        >
            {renderChart()}
        </Box>
    );
}; 