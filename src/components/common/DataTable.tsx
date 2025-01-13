import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    TableSortLabel,
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useSorting } from '../../hooks/useSorting';
import { usePagination } from '../../hooks/usePagination';

interface Column<T> {
    id: keyof T;
    label: string;
    format?: (value: any) => string | number;
    sortable?: boolean;
    align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T extends { id: number }> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    defaultSort?: {
        key: keyof T;
        direction: 'asc' | 'desc';
    };
}

export function DataTable<T extends { id: number }>({
    data,
    columns,
    onEdit,
    onDelete,
    defaultSort,
}: DataTableProps<T>) {
    const { sortedData, requestSort, getSortDirection } = useSorting(data, defaultSort);
    const { currentData, currentPage, totalPages, goToPage, rowsPerPage, setRowsPerPage } =
        usePagination({
            data: sortedData,
            itemsPerPage: 10,
        });

    const handleChangePage = (_: unknown, newPage: number) => {
        goToPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        goToPage(1);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={String(column.id)}
                                    align={column.align || 'left'}
                                    sortDirection={getSortDirection(column.id)}
                                >
                                    {column.sortable ? (
                                        <TableSortLabel
                                            active={getSortDirection(column.id) !== undefined}
                                            direction={
                                                getSortDirection(column.id) || 'asc'
                                            }
                                            onClick={() => requestSort(column.id)}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    ) : (
                                        column.label
                                    )}
                                </TableCell>
                            ))}
                            {(onEdit || onDelete) && (
                                <TableCell align="right">Actions</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentData.map((row) => (
                            <TableRow hover key={row.id}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={String(column.id)}
                                        align={column.align || 'left'}
                                    >
                                        {column.format
                                            ? column.format(row[column.id])
                                            : row[column.id]}
                                    </TableCell>
                                ))}
                                {(onEdit || onDelete) && (
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            {onEdit && (
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onEdit(row)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {onDelete && (
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onDelete(row)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={currentPage - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
} 