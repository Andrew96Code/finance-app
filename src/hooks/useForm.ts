import { useFormik } from 'formik';
import * as Yup from 'yup';

interface UseFormProps<T> {
    initialValues: T;
    validationSchema: Yup.Schema<any>;
    onSubmit: (values: T) => Promise<void>;
}

export const useForm = <T extends object>({
    initialValues,
    validationSchema,
    onSubmit,
}: UseFormProps<T>) => {
    const formik = useFormik<T>({
        initialValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                await onSubmit(values);
                resetForm();
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return {
        formik,
        isSubmitting: formik.isSubmitting,
        errors: formik.errors,
        touched: formik.touched,
        handleSubmit: formik.handleSubmit,
        handleChange: formik.handleChange,
        handleBlur: formik.handleBlur,
        values: formik.values,
        resetForm: formik.resetForm,
    };
}; 