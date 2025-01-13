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

interface DebtFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: DebtFormValues) => void;
    initialValues?: Partial<DebtFormValues>;
    isEditing?: boolean;
}

export interface DebtFormValues {
    creditor: string;
    originalAmount: number;
    currentBalance: number;
    interestRate: number;
    minimumPayment: number;
    dueDate: number;
    type: string;
    priority: number;
    paymentHistory: {
        date: Date;
        amount: number;
    }[];
    notes?: string;
    collateral?: string;
    accountNumber?: string;
    isDelinquent: boolean;
    lastPaymentDate?: Date;
}

const validationSchema = Yup.object({
    creditor: Yup.string().required('Creditor name is required'),
    originalAmount: Yup.number()
        .required('Original amount is required')
        .positive('Amount must be positive'),
    currentBalance: Yup.number()
        .required('Current balance is required')
        .positive('Balance must be positive'),
    interestRate: Yup.number()
        .required('Interest rate is required')
        .min(0, 'Interest rate must be non-negative'),
    minimumPayment: Yup.number()
        .required('Minimum payment is required')
        .min(0, 'Minimum payment must be non-negative'),
    dueDate: Yup.number()
        .required('Due date is required')
        .min(1, 'Due date must be between 1-31')
        .max(31, 'Due date must be between 1-31'),
    type: Yup.string().required('Debt type is required'),
    priority: Yup.number()
        .required('Priority is required')
        .min(1, 'Priority must be at least 1'),
    notes: Yup.string(),
    collateral: Yup.string(),
    accountNumber: Yup.string(),
    isDelinquent: Yup.boolean(),
    lastPaymentDate: Yup.date(),
});

const debtTypes = [
    'Credit Card',
    'Personal Loan',
    'Student Loan',
    'Mortgage',
    'Auto Loan',
    'Medical Debt',
    'Tax Debt',
    'Other',
];

export const DebtForm: React.FC<DebtFormProps> = ({
    open,
    onClose,
    onSubmit,
    initialValues,
    isEditing = false,
}) => {
    const formik = useFormik({
        initialValues: {
            creditor: '',
            originalAmount: 0,
            currentBalance: 0,
            interestRate: 0,
            minimumPayment: 0,
            dueDate: 1,
            type: '',
            priority: 1,
            paymentHistory: [],
            notes: '',
            collateral: '',
            accountNumber: '',
            isDelinquent: false,
            lastPaymentDate: undefined,
            ...initialValues,
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
            onClose();
        },
    });

    const calculateMonthlyInterest = () => {
        return (formik.values.currentBalance * (formik.values.interestRate / 100)) / 12;
    };

    const monthlyInterest = calculateMonthlyInterest();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {isEditing ? 'Edit Debt' : 'Add New Debt'}
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="text"
                                name="creditor"
                                label="Creditor Name"
                                formik={formik}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                name="type"
                                label="Debt Type"
                                formik={formik}
                                options={debtTypes.map(type => ({ label: type, value: type }))}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="originalAmount"
                                label="Original Amount"
                                formik={formik}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="currentBalance"
                                label="Current Balance"
                                formik={formik}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="interestRate"
                                label="Interest Rate (%)"
                                formik={formik}
                                InputProps={{
                                    endAdornment: '%',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="minimumPayment"
                                label="Minimum Payment"
                                formik={formik}
                                InputProps={{
                                    startAdornment: '$',
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="number"
                                name="dueDate"
                                label="Due Date (Day of Month)"
                                formik={formik}
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

                        <Grid item xs={12}>
                            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Monthly Interest: {formatCurrency(monthlyInterest)}
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Annual Interest: {formatCurrency(monthlyInterest * 12)}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="text"
                                name="accountNumber"
                                label="Account Number"
                                formik={formik}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="text"
                                name="collateral"
                                label="Collateral"
                                formik={formik}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="checkbox"
                                name="isDelinquent"
                                label="Is Delinquent"
                                formik={formik}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="date"
                                name="lastPaymentDate"
                                label="Last Payment Date"
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
                        {isEditing ? 'Update' : 'Add'} Debt
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}; 