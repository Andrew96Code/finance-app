import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { login, register, logout } from '../store/slices/authSlice';
import { User } from '../types';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, token, isLoading, error } = useAppSelector((state) => state.auth);

    const handleLogin = async (email: string, password: string) => {
        try {
            await dispatch(login({ email, password })).unwrap();
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleRegister = async (userData: {
        email: string;
        password: string;
        full_name: string;
        monthly_income: number;
    }) => {
        try {
            await dispatch(register(userData)).unwrap();
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleLogout = async () => {
        await dispatch(logout());
    };

    return {
        user,
        token,
        isLoading,
        error,
        isAuthenticated: !!token,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    };
}; 