import React, { useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    Divider,
    Button,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    Receipt,
    Flag,
    AccountBalance,
    Assessment,
    Logout,
    DarkMode,
    LightMode,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useThemeToggle } from '../../hooks/useThemeToggle';

const DRAWER_WIDTH = 240;

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { isDarkMode, toggleDarkMode } = useThemeToggle();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigationItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/' },
        { text: 'Transactions', icon: <Receipt />, path: '/transactions' },
        { text: 'Goals', icon: <Flag />, path: '/goals' },
        { text: 'Debts', icon: <AccountBalance />, path: '/debts' },
        { text: 'Reports', icon: <Assessment />, path: '/reports' },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const drawer = (
        <Box>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Financial Audit
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {navigationItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => handleNavigation(item.path)}
                        selected={location.pathname === item.path}
                    >
                        <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem button onClick={toggleDarkMode}>
                    <ListItemIcon>
                        {isDarkMode ? <LightMode /> : <DarkMode />}
                    </ListItemIcon>
                    <ListItemText primary={isDarkMode ? 'Light Mode' : 'Dark Mode'} />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { md: `${DRAWER_WIDTH}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" noWrap component="div">
                            {navigationItems.find(item => item.path === location.pathname)?.text || 'Financial Audit'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        <Button
                            color="inherit"
                            onClick={toggleDarkMode}
                            startIcon={isDarkMode ? <LightMode /> : <DarkMode />}
                        >
                            {isDarkMode ? 'Light' : 'Dark'} Mode
                        </Button>
                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            startIcon={<Logout />}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
                    }}
                >
                    {drawer}
                </Drawer>
                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                <Toolbar /> {/* Spacer for AppBar */}
                {children}
            </Box>
        </Box>
    );
}; 