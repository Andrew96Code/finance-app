import React from 'react';
import {
    TextField,
    TextFieldProps,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FormikProps } from 'formik';

interface Option {
    value: string | number;
    label: string;
}

interface FormFieldProps extends Omit<TextFieldProps, 'type'> {
    type?: 'text' | 'number' | 'email' | 'password' | 'select' | 'date';
    name: string;
    label: string;
    formik: FormikProps<any>;
    options?: Option[];
}

export const FormField: React.FC<FormFieldProps> = ({
    type = 'text',
    name,
    label,
    formik,
    options,
    ...props
}) => {
    const error = formik.touched[name] && formik.errors[name];

    if (type === 'select' && options) {
        return (
            <FormControl
                fullWidth
                error={!!error}
                variant="outlined"
                margin="normal"
            >
                <InputLabel id={`${name}-label`}>{label}</InputLabel>
                <Select
                    labelId={`${name}-label`}
                    id={name}
                    name={name}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label={label}
                >
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
                {error && <FormHelperText>{error as string}</FormHelperText>}
            </FormControl>
        );
    }

    if (type === 'date') {
        return (
            <DatePicker
                label={label}
                value={formik.values[name]}
                onChange={(value) => formik.setFieldValue(name, value)}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        margin: 'normal',
                        error: !!error,
                        helperText: error as string,
                        onBlur: formik.handleBlur,
                        name,
                    },
                }}
            />
        );
    }

    return (
        <TextField
            fullWidth
            id={name}
            name={name}
            label={label}
            type={type}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={!!error}
            helperText={error as string}
            margin="normal"
            variant="outlined"
            {...props}
        />
    );
}; 