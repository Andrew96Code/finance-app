import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormField } from '../common/FormField';
import { TransactionType, ExpenseCategory } from '../../types/transaction';

interface TransactionFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: TransactionFormValues) => void;
    initialValues?: Partial<TransactionFormValues>;
    isEditing?: boolean;
}

export interface TransactionFormValues {
    date: Date;
    amount: number;
    type: TransactionType;
    category: ExpenseCategory;
    description: string;
    payee: string;
    notes?: string;
    isRecurring: boolean;
    recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
    tags?: string[];
    attachments?: File[];
}

const validationSchema = Yup.object({
    date: Yup.date().required('Date is required'),
    amount: Yup.number()
        .required('Amount is required')
        .positive('Amount must be positive'),
    type: Yup.string()
        .oneOf(Object.values(TransactionType), 'Invalid transaction type')
        .required('Transaction type is required'),
    category: Yup.string()
        .oneOf(Object.values(ExpenseCategory), 'Invalid category')
        .required('Category is required'),
    description: Yup.string()
        .required('Description is required')
        .max(100, 'Description must be at most 100 characters'),
    payee: Yup.string()
        .required('Payee is required')
        .max(50, 'Payee must be at most 50 characters'),
    notes: Yup.string().max(500, 'Notes must be at most 500 characters'),
    isRecurring: Yup.boolean(),
    recurringFrequency: Yup.string().when('isRecurring', {
        is: true,
        then: Yup.string()
            .oneOf(['weekly', 'monthly', 'yearly'], 'Invalid frequency')
            .required('Frequency is required for recurring transactions'),
    }),
});

export const TransactionForm: React.FC<TransactionFormProps> = ({
    open,
    onClose,
    onSubmit,
    initialValues,
    isEditing = false,
}) => {
    const formik = useFormik({
        initialValues: {
            date: new Date(),
            amount: 0,
            type: TransactionType.EXPENSE,
            category: ExpenseCategory.OTHER,
            description: '',
            payee: '',
            notes: '',
            isRecurring: false,
            recurringFrequency: undefined,
            ...initialValues,
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
            onClose();
        },
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="date"
                                name="date"
                                label="Transaction Date"
                                formik={formik}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="amount"
                                label="Amount"
                                formik={formik}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                name="type"
                                label="Transaction Type"
                                formik={formik}
                                options={Object.values(TransactionType).map((type) => ({
                                    value: type,
                                    label: type.charAt(0) + type.slice(1).toLowerCase(),
                                }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                name="category"
                                label="Category"
                                formik={formik}
                                options={Object.values(ExpenseCategory).map((category) => ({
                                    value: category,
                                    label: category.charAt(0) + category.slice(1).toLowerCase(),
                                }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="text"
                                name="description"
                                label="Description"
                                formik={formik}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="text"
                                name="payee"
                                label="Payee"
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
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                name="isRecurring"
                                label="Is Recurring?"
                                formik={formik}
                                options={[
                                    { value: false, label: 'No' },
                                    { value: true, label: 'Yes' },
                                ]}
                            />
                        </Grid>
                        {formik.values.isRecurring && (
                            <Grid item xs={12} sm={6}>
                                <FormField
                                    type="select"
                                    name="recurringFrequency"
                                    label="Recurring Frequency"
                                    formik={formik}
                                    options={[
                                        { value: 'weekly', label: 'Weekly' },
                                        { value: 'monthly', label: 'Monthly' },
                                        { value: 'yearly', label: 'Yearly' },
                                    ]}
                                />
                            </Grid>
                        )}
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
                        {isEditing ? 'Update' : 'Add'} Transaction
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}; 