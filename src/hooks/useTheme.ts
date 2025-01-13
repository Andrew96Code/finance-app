import { useState, useEffect, useMemo } from 'react';
import { createTheme, Theme } from '@mui/material';

export const useTheme = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light',
                    primary: {
                        main: '#1976d2',
                    },
                    secondary: {
                        main: '#dc004e',
                    },
                    background: {
                        default: darkMode ? '#303030' : '#f5f5f5',
                        paper: darkMode ? '#424242' : '#ffffff',
                    },
                },
                typography: {
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    h1: {
                        fontSize: '2.5rem',
                        fontWeight: 500,
                    },
                    h2: {
                        fontSize: '2rem',
                        fontWeight: 500,
                    },
                    h3: {
                        fontSize: '1.75rem',
                        fontWeight: 500,
                    },
                    h4: {
                        fontSize: '1.5rem',
                        fontWeight: 500,
                    },
                    h5: {
                        fontSize: '1.25rem',
                        fontWeight: 500,
                    },
                    h6: {
                        fontSize: '1rem',
                        fontWeight: 500,
                    },
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                textTransform: 'none',
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                            },
                        },
                    },
                },
            }),
        [darkMode]
    );

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return { theme, darkMode, toggleDarkMode };
}; 