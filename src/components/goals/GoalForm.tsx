import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormField } from '../common/FormField';
import { formatCurrency } from '../../utils/formatters';

interface GoalFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: GoalFormValues) => void;
    initialValues?: Partial<GoalFormValues>;
    isEditing?: boolean;
    monthlyIncome?: number;
}

export interface GoalFormValues {
    name: string;
    type: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    priority: number;
    monthlyContribution: number;
    interestRate?: number;
    milestones: {
        amount: number;
        date: Date;
        description: string;
    }[];
    strategy: string;
    notes?: string;
    linkedAccounts?: string[];
    autoAdjust: boolean;
    reminderFrequency: string;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Goal name is required'),
    type: Yup.string().required('Goal type is required'),
    targetAmount: Yup.number()
        .required('Target amount is required')
        .positive('Amount must be positive'),
    currentAmount: Yup.number()
        .required('Current amount is required')
        .min(0, 'Amount must be non-negative'),
    deadline: Yup.date()
        .required('Deadline is required')
        .min(new Date(), 'Deadline must be in the future'),
    priority: Yup.number()
        .required('Priority is required')
        .min(1, 'Priority must be at least 1'),
    monthlyContribution: Yup.number()
        .required('Monthly contribution is required')
        .min(0, 'Contribution must be non-negative'),
    interestRate: Yup.number()
        .min(0, 'Interest rate must be non-negative'),
    strategy: Yup.string().required('Strategy is required'),
    reminderFrequency: Yup.string().required('Reminder frequency is required'),
});

const goalTypes = [
    'Emergency Fund',
    'Retirement',
    'Debt Payoff',
    'Home Purchase',
    'Education',
    'Investment',
    'Vehicle',
    'Travel',
    'Business',
    'Other',
];

const strategies = [
    'Aggressive',
    'Moderate',
    'Conservative',
    'Custom',
];

const reminderFrequencies = [
    'Weekly',
    'Bi-weekly',
    'Monthly',
    'Quarterly',
    'None',
];

export const GoalForm: React.FC<GoalFormProps> = ({
    open,
    onClose,
    onSubmit,
    initialValues,
    isEditing = false,
    monthlyIncome = 0,
}) => {
    const formik = useFormik({
        initialValues: {
            name: '',
            type: '',
            targetAmount: 0,
            currentAmount: 0,
            deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            priority: 1,
            monthlyContribution: 0,
            interestRate: 0,
            milestones: [],
            strategy: 'Moderate',
            notes: '',
            linkedAccounts: [],
            autoAdjust: true,
            reminderFrequency: 'Monthly',
            ...initialValues,
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
            onClose();
        },
    });

    const calculateProjections = () => {
        const months = Math.ceil(
            (new Date(formik.values.deadline).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24 * 30.44)
        );
        const monthlyRate = (formik.values.interestRate || 0) / 100 / 12;
        const futureValue = formik.values.currentAmount * Math.pow(1 + monthlyRate, months) +
            formik.values.monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        
        return {
            months,
            projectedAmount: futureValue,
            monthlyNeeded: (formik.values.targetAmount - formik.values.currentAmount) / months,
            isOnTrack: futureValue >= formik.values.targetAmount,
        };
    };

    const projections = calculateProjections();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {isEditing ? 'Edit Financial Goal' : 'Create New Financial Goal'}
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="text"
                                name="name"
                                label="Goal Name"
                                formik={formik}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                name="type"
                                label="Goal Type"
                                formik={formik}
                                options={goalTypes.map(type => ({ label: type, value: type }))}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="targetAmount"
                                label="Target Amount"
                                formik={formik}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="currentAmount"
                                label="Current Amount"
                                formik={formik}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="date"
                                name="deadline"
                                label="Target Date"
                                formik={formik}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="monthlyContribution"
                                label="Monthly Contribution"
                                formik={formik}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="priority"
                                label="Priority"
                                formik={formik}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="interestRate"
                                label="Expected Return Rate (%)"
                                formik={formik}
                                InputProps={{
                                    endAdornment: '%',
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Goal Projections
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                            Time to Goal: {projections.months} months
                                        </Typography>
                                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                            Projected Amount: {formatCurrency(projections.projectedAmount)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                            Monthly Needed: {formatCurrency(projections.monthlyNeeded)}
                                        </Typography>
                                        <Typography
                                            variant="subtitle2"
                                            color={projections.isOnTrack ? 'success.main' : 'error.main'}
                                        >
                                            Status: {projections.isOnTrack ? 'On Track' : 'Off Track'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                name="strategy"
                                label="Investment Strategy"
                                formik={formik}
                                options={strategies.map(strategy => ({ label: strategy, value: strategy }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                name="reminderFrequency"
                                label="Progress Reminder Frequency"
                                formik={formik}
                                options={reminderFrequencies.map(freq => ({ label: freq, value: freq }))}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="checkbox"
                                name="autoAdjust"
                                label="Auto-adjust contributions based on progress"
                                formik={formik}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormField
                                type="text"
                                name="notes"
                                label="Notes"
                                formik={formik}
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!formik.isValid || formik.isSubmitting}
                    >
                        {isEditing ? 'Update' : 'Create'} Goal
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}; 