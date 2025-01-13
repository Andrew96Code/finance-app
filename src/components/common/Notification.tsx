import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface NotificationProps {
    open: boolean;
    message: string;
    type: AlertColor;
    onClose: () => void;
    autoHideDuration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
    open,
    message,
    type,
    onClose,
    autoHideDuration = 6000,
}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                onClose={onClose}
                severity={type}
                variant="filled"
                sx={{ width: '100%' }}
                elevation={6}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}; 