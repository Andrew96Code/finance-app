import { useState, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
    message: string;
    type: NotificationType;
    open: boolean;
}

interface UseNotificationResult {
    notification: Notification;
    showNotification: (message: string, type: NotificationType) => void;
    hideNotification: () => void;
}

const defaultNotification: Notification = {
    message: '',
    type: 'info',
    open: false,
};

export const useNotification = (): UseNotificationResult => {
    const [notification, setNotification] = useState<Notification>(defaultNotification);

    const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
        setNotification({
            message,
            type,
            open: true,
        });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification((prev) => ({
            ...prev,
            open: false,
        }));
    }, []);

    return {
        notification,
        showNotification,
        hideNotification,
    };
}; 