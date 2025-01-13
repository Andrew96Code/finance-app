import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useThemeToggle } from './hooks/useThemeToggle';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Goals } from './pages/Goals';
import { Debts } from './pages/Debts';
import { Reports } from './pages/Reports';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

export const App: React.FC = () => {
    const { theme } = useThemeToggle();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Dashboard />
                                </MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/transactions" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Transactions />
                                </MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/goals" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Goals />
                                </MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/debts" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Debts />
                                </MainLayout>
                            </ProtectedRoute>
                        } />
                        <Route path="/reports" element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Reports />
                                </MainLayout>
                            </ProtectedRoute>
                        } />

                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </LocalizationProvider>
        </ThemeProvider>
    );
};
