import React, { useState } from 'react';
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

interface HeaderProps {
  children: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      alert("No se pudo cerrar la sesión. Inténtelo de nuevo.");
    }
  };

  const menuItems = [
    {
      label: 'Inicio',
      icon: <HomeIcon />,
      path: '/dashboard',
      action: () => navigate('/dashboard'),
    },
    {
      label: 'Historial de Asistencia',
      icon: <EventNoteIcon />,
      path: '/attendance/history',
      action: () => navigate('/attendance/history'),
    },
    {
      label: 'Registrar Asistencia',
      icon: <PlaylistAddCheckIcon />,
      path: '/attendance/register',
      action: () => navigate('/attendance/register'),
    },
    {
      label: 'Gestionar Estudiantes',
      icon: <GroupIcon />,
      path: '/students',
      action: () => navigate('/students'),
    },
    {
      label: 'Cerrar Sesión',
      icon: <ExitToAppIcon color="error" />,
      path: '/logout',
      action: handleLogout,
    },
  ];

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f9fafb',
      }}
    >
      {/* Espaciador para que el avatar baje y NO lo tape el AppBar */}
      <Toolbar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: '#6366f1', fontSize: 28 }}>
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Typography variant="h6" align="center" sx={{ mt: 1, mb: 2, color: '#6366f1', fontWeight: 600 }}>
          {user?.username || 'Administrador'}
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemButton
              onClick={() => {
                item.action();
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: '0 24px 24px 0',
                mx: 1,
                my: 0.5,
                '&:hover': { bgcolor: '#e0e7ff' },
                ...(location.pathname === item.path && {
                  bgcolor: '#e0e7ff',
                  color: '#222',
                  fontWeight: 700,
                }),
              }}
              selected={location.pathname === item.path}
            >
              <ListItemIcon sx={{ color: '#6366f1', minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>
        NFC Students © {new Date().getFullYear()}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#fff',
          color: '#6366f1',
          boxShadow: '0 4px 12px 0 rgba(99,102,241,.04)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, letterSpacing: 1 }}>
            NFC Students | Panel
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="Menu lateral"
      >
        {/* Temporary drawer for mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxShadow: 6,
              borderRadius: '0 24px 24px 0',
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Permanent drawer for desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxShadow: '0 8px 32px rgba(99,102,241,0.08)',
              borderRadius: '0 24px 24px 0',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content (ajustado para que NO lo tape el AppBar) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: '100vh',
          bgcolor: '#f4f6fa',
          pt: { xs: 0, md: 8 }, // <-- Aquí el padding-top depende del tamaño de AppBar
          pb: 6,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
