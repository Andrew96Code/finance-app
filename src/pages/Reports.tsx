import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useAppSelector } from '../hooks/reduxHooks';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface ReportSection {
    id: string;
    title: string;
    description: string;
    selected: boolean;
}

interface ReportOptions {
    startDate: Date;
    endDate: Date;
    format: 'pdf' | 'excel';
    includeCharts: boolean;
    includeRecommendations: boolean;
    customNotes: string;
}

export const Reports: React.FC = () => {
    const { isLoading } = useProtectedRoute();
    const [reportSections, setReportSections] = useState<ReportSection[]>([
        {
            id: 'overview',
            title: 'Financial Overview',
            description: 'Summary of income, expenses, savings, and debt',
            selected: true,
        },
        {
            id: 'transactions',
            title: 'Transaction Analysis',
            description: 'Detailed breakdown of transactions and spending patterns',
            selected: true,
        },
        {
            id: 'goals',
            title: 'Financial Goals',
            description: 'Progress tracking and analysis of financial goals',
            selected: true,
        },
        {
            id: 'debt',
            title: 'Debt Analysis',
            description: 'Comprehensive debt overview and payoff strategies',
            selected: true,
        },
        {
            id: 'recommendations',
            title: 'Recommendations',
            description: 'Personalized financial recommendations and action items',
            selected: true,
        },
        {
            id: 'projections',
            title: 'Financial Projections',
            description: 'Future financial scenarios and forecasts',
            selected: true,
        },
    ]);

    const [options, setOptions] = useState<ReportOptions>({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date(),
        format: 'pdf',
        includeCharts: true,
        includeRecommendations: true,
        customNotes: '',
    });

    const handleSectionToggle = (sectionId: string) => {
        setReportSections(sections =>
            sections.map(section =>
                section.id === sectionId
                    ? { ...section, selected: !section.selected }
                    : section
            )
        );
    };

    const handleOptionChange = (field: keyof ReportOptions, value: any) => {
        setOptions(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerateReport = () => {
        const selectedSections = reportSections
            .filter(section => section.selected)
            .map(section => section.id);

        // TODO: Implement report generation logic
        console.log('Generating report with:', {
            sections: selectedSections,
            options,
        });
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Financial Reports
                </Typography>

                <Grid container spacing={4}>
                    {/* Report Sections */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Report Sections
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {reportSections.map((section) => (
                                        <FormControlLabel
                                            key={section.id}
                                            control={
                                                <Checkbox
                                                    checked={section.selected}
                                                    onChange={() => handleSectionToggle(section.id)}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="subtitle1">
                                                        {section.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {section.description}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Report Options */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Report Options
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <DatePicker
                                                label="Start Date"
                                                value={options.startDate}
                                                onChange={(date) => handleOptionChange('startDate', date)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <DatePicker
                                                label="End Date"
                                                value={options.endDate}
                                                onChange={(date) => handleOptionChange('endDate', date)}
                                            />
                                        </Grid>
                                    </Grid>

                                    <FormControl fullWidth>
                                        <InputLabel>Report Format</InputLabel>
                                        <Select
                                            value={options.format}
                                            onChange={(e) => handleOptionChange('format', e.target.value)}
                                            label="Report Format"
                                        >
                                            <MenuItem value="pdf">PDF Report</MenuItem>
                                            <MenuItem value="excel">Excel Spreadsheet</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={options.includeCharts}
                                                onChange={(e) => handleOptionChange('includeCharts', e.target.checked)}
                                            />
                                        }
                                        label="Include Visual Charts and Graphs"
                                    />

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={options.includeRecommendations}
                                                onChange={(e) => handleOptionChange('includeRecommendations', e.target.checked)}
                                            />
                                        }
                                        label="Include Financial Recommendations"
                                    />

                                    <TextField
                                        label="Custom Notes"
                                        multiline
                                        rows={4}
                                        value={options.customNotes}
                                        onChange={(e) => handleOptionChange('customNotes', e.target.value)}
                                        fullWidth
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Generate Report Button */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleGenerateReport}
                                disabled={!reportSections.some(section => section.selected)}
                            >
                                Generate Report
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}; 