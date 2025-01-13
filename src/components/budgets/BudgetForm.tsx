import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    IconButton,
    Box,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormField } from '../common/FormField';
import { ExpenseCategory } from '../../types/transaction';
import { formatCurrency } from '../../utils/formatters';

interface BudgetFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: BudgetFormValues) => void;
    initialValues?: Partial<BudgetFormValues>;
    isEditing?: boolean;
    monthlyIncome?: number;
}

export interface CategoryBudget {
    category: ExpenseCategory;
    amount: number;
    notes?: string;
}

export interface BudgetFormValues {
    month: Date;
    totalBudget: number;
    categories: CategoryBudget[];
    savingsGoal: number;
    emergencyFundContribution: number;
    notes?: string;
}

const validationSchema = Yup.object({
    month: Yup.date().required('Month is required'),
    totalBudget: Yup.number()
        .required('Total budget is required')
        .positive('Total budget must be positive'),
    categories: Yup.array().of(
        Yup.object({
            category: Yup.string()
                .oneOf(Object.values(ExpenseCategory), 'Invalid category')
                .required('Category is required'),
            amount: Yup.number()
                .required('Amount is required')
                .min(0, 'Amount must be non-negative'),
            notes: Yup.string(),
        })
    ),
    savingsGoal: Yup.number()
        .required('Savings goal is required')
        .min(0, 'Savings goal must be non-negative'),
    emergencyFundContribution: Yup.number()
        .required('Emergency fund contribution is required')
        .min(0, 'Emergency fund contribution must be non-negative'),
    notes: Yup.string(),
});

export const BudgetForm: React.FC<BudgetFormProps> = ({
    open,
    onClose,
    onSubmit,
    initialValues,
    isEditing = false,
    monthlyIncome = 0,
}) => {
    const formik = useFormik({
        initialValues: {
            month: new Date(),
            totalBudget: monthlyIncome * 0.9, // Default to 90% of monthly income
            categories: Object.values(ExpenseCategory).map((category) => ({
                category,
                amount: 0,
                notes: '',
            })),
            savingsGoal: monthlyIncome * 0.2, // Default to 20% savings
            emergencyFundContribution: monthlyIncome * 0.1, // Default to 10% emergency fund
            notes: '',
            ...initialValues,
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
            onClose();
        },
    });

    const totalAllocated = formik.values.categories.reduce(
        (sum, cat) => sum + cat.amount,
        0
    ) + formik.values.savingsGoal + formik.values.emergencyFundContribution;

    const remainingToAllocate = formik.values.totalBudget - totalAllocated;

    const handleQuickAllocation = () => {
        const remainingCategories = formik.values.categories.filter(
            (cat) => cat.amount === 0
        );
        if (remainingCategories.length > 0) {
            const amountPerCategory = remainingToAllocate / remainingCategories.length;
            const newCategories = formik.values.categories.map((cat) =>
                cat.amount === 0
                    ? { ...cat, amount: Math.floor(amountPerCategory) }
                    : cat
            );
            formik.setFieldValue('categories', newCategories);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {isEditing ? 'Edit Budget' : 'Create New Budget'}
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="date"
                                name="month"
                                label="Budget Month"
                                formik={formik}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="totalBudget"
                                label="Total Budget"
                                formik={formik}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Category Allocation</Typography>
                                <Button
                                    size="small"
                                    onClick={handleQuickAllocation}
                                    disabled={remainingToAllocate <= 0}
                                >
                                    Quick Allocate Remaining
                                </Button>
                            </Box>
                            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Remaining to Allocate: {formatCurrency(remainingToAllocate)}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    color={remainingToAllocate < 0 ? 'error' : 'success'}
                                    gutterBottom
                                >
                                    {remainingToAllocate < 0
                                        ? 'Over budget!'
                                        : remainingToAllocate > 0
                                        ? 'Under budget'
                                        : 'Perfectly allocated'}
                                </Typography>
                            </Box>
                        </Grid>

                        {formik.values.categories.map((category, index) => (
                            <Grid item xs={12} key={category.category}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={4}>
                                        <Typography>{category.category}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormField
                                            type="number"
                                            name={`categories.${index}.amount`}
                                            label="Amount"
                                            formik={formik}
                                            InputProps={{
                                                startAdornment: '$',
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormField
                                            type="text"
                                            name={`categories.${index}.notes`}
                                            label="Notes"
                                            formik={formik}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="savingsGoal"
                                label="Savings Goal"
                                formik={formik}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="emergencyFundContribution"
                                label="Emergency Fund Contribution"
                                formik={formik}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormField
                                type="text"
                                name="notes"
                                label="Budget Notes"
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
                        {isEditing ? 'Update' : 'Create'} Budget
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}; 