import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    IconButton,
    Tooltip,
    Chip,
    Stack,
    Button,
} from '@mui/material';
import {
    FilterList as FilterIcon,
    GetApp as ExportIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { DataTable } from '../common/DataTable';
import { TransactionType, ExpenseCategory, Transaction } from '../../types/transaction';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TransactionForm } from './TransactionForm';
import { TransactionFilters } from './TransactionFilters';

interface TransactionListProps {
    transactions: Transaction[];
    onAddTransaction: (transaction: Transaction) => void;
    onEditTransaction: (transaction: Transaction) => void;
    onDeleteTransaction: (transaction: Transaction) => void;
    onExportTransactions: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
    transactions,
    onAddTransaction,
    onEditTransaction,
    onDeleteTransaction,
    onExportTransactions,
}) => {
    const [showForm, setShowForm] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const columns = [
        {
            id: 'date',
            label: 'Date',
            format: (value: string) => formatDate(value),
            sortable: true,
        },
        {
            id: 'type',
            label: 'Type',
            format: (value: TransactionType) => (
                <Chip
                    label={value}
                    color={value === TransactionType.INCOME ? 'success' : 'error'}
                    size="small"
                />
            ),
            sortable: true,
        },
        {
            id: 'amount',
            label: 'Amount',
            format: (value: number) => formatCurrency(value),
            align: 'right' as const,
            sortable: true,
        },
        {
            id: 'category',
            label: 'Category',
            format: (value: ExpenseCategory) => (
                <Chip label={value} variant="outlined" size="small" />
            ),
            sortable: true,
        },
        {
            id: 'description',
            label: 'Description',
            sortable: true,
        },
        {
            id: 'payee',
            label: 'Payee',
            sortable: true,
        },
    ];

    const handleAdd = () => {
        setSelectedTransaction(null);
        setShowForm(true);
    };

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setShowForm(true);
    };

    const handleFormSubmit = (values: any) => {
        if (selectedTransaction) {
            onEditTransaction({ ...selectedTransaction, ...values });
        } else {
            onAddTransaction(values as Transaction);
        }
        setShowForm(false);
        setSelectedTransaction(null);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setSelectedTransaction(null);
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const searchFields = [
            transaction.description,
            transaction.payee,
            transaction.category,
            transaction.type,
        ].map((field) => field.toLowerCase());

        return searchFields.some((field) =>
            field.includes(searchQuery.toLowerCase())
        );
    });

    const totalIncome = filteredTransactions
        .filter((t) => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
        .filter((t) => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Transactions</Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                    >
                        Add Transaction
                    </Button>
                    <Tooltip title="Export Transactions">
                        <IconButton onClick={onExportTransactions}>
                            <ExportIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Show Filters">
                        <IconButton onClick={() => setShowFilters(!showFilters)}>
                            <FilterIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Total Income
                            </Typography>
                            <Typography variant="h6" color="success.main">
                                {formatCurrency(totalIncome)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Total Expenses
                            </Typography>
                            <Typography variant="h6" color="error.main">
                                {formatCurrency(totalExpenses)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Net Amount
                            </Typography>
                            <Typography
                                variant="h6"
                                color={totalIncome - totalExpenses >= 0 ? 'success.main' : 'error.main'}
                            >
                                {formatCurrency(totalIncome - totalExpenses)}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {showFilters && <TransactionFilters onClose={() => setShowFilters(false)} />}

            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>

            <DataTable
                data={filteredTransactions}
                columns={columns}
                onEdit={handleEdit}
                onDelete={onDeleteTransaction}
            />

            <TransactionForm
                open={showForm}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                initialValues={selectedTransaction || undefined}
                isEditing={!!selectedTransaction}
            />
        </Box>
    );
}; 