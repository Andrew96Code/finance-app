import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    IconButton,
    Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import { FormField } from '../common/FormField';
import { TransactionType, ExpenseCategory } from '../../types/transaction';

interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface AmountRange {
    minAmount: number | null;
    maxAmount: number | null;
}

interface TransactionFiltersProps {
    onClose: () => void;
    onApplyFilters: (filters: TransactionFilterValues) => void;
    initialFilters?: Partial<TransactionFilterValues>;
}

export interface TransactionFilterValues {
    dateRange: DateRange;
    amountRange: AmountRange;
    types: TransactionType[];
    categories: ExpenseCategory[];
    payees: string[];
    isRecurring?: boolean;
    hasAttachments?: boolean;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
    onClose,
    onApplyFilters,
    initialFilters,
}) => {
    const formik = useFormik({
        initialValues: {
            dateRange: {
                startDate: null,
                endDate: null,
            },
            amountRange: {
                minAmount: null,
                maxAmount: null,
            },
            types: [],
            categories: [],
            payees: [],
            isRecurring: undefined,
            hasAttachments: undefined,
            ...initialFilters,
        },
        onSubmit: (values) => {
            onApplyFilters(values);
            onClose();
        },
    });

    const handleClearFilters = () => {
        formik.resetForm();
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Filter Transactions</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                                Date Range
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormField
                                        type="date"
                                        name="dateRange.startDate"
                                        label="Start Date"
                                        formik={formik}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormField
                                        type="date"
                                        name="dateRange.endDate"
                                        label="End Date"
                                        formik={formik}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                                Amount Range
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormField
                                        type="number"
                                        name="amountRange.minAmount"
                                        label="Minimum Amount"
                                        formik={formik}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormField
                                        type="number"
                                        name="amountRange.maxAmount"
                                        label="Maximum Amount"
                                        formik={formik}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                name="types"
                                label="Transaction Types"
                                formik={formik}
                                options={Object.values(TransactionType).map((type) => ({
                                    value: type,
                                    label: type.charAt(0) + type.slice(1).toLowerCase(),
                                }))}
                                SelectProps={{ multiple: true }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                name="categories"
                                label="Categories"
                                formik={formik}
                                options={Object.values(ExpenseCategory).map((category) => ({
                                    value: category,
                                    label: category.charAt(0) + category.slice(1).toLowerCase(),
                                }))}
                                SelectProps={{ multiple: true }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                name="isRecurring"
                                label="Recurring Transactions"
                                formik={formik}
                                options={[
                                    { value: undefined, label: 'All' },
                                    { value: true, label: 'Recurring Only' },
                                    { value: false, label: 'Non-recurring Only' },
                                ]}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                name="hasAttachments"
                                label="Attachments"
                                formik={formik}
                                options={[
                                    { value: undefined, label: 'All' },
                                    { value: true, label: 'With Attachments' },
                                    { value: false, label: 'Without Attachments' },
                                ]}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                <Button onClick={handleClearFilters}>
                                    Clear Filters
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Apply Filters
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
}; 