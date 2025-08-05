import React from 'react';
import { Box, Typography, Paper, Button, Stack, useTheme, useMediaQuery } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import GroupIcon from '@mui/icons-material/Group';
import { Header } from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Acciones del dashboard
  const actions = [
    {
      icon: <EventNoteIcon sx={{ fontSize: 48, color: '#2563eb', mb: 1 }} />,
      title: 'Historial de Asistencia',
      color: 'primary',
      buttonText: 'Ver Historial',
      onClick: () => navigate('/attendance/history'),
    },
    {
      icon: <PlaylistAddCheckIcon sx={{ fontSize: 48, color: '#059669', mb: 1 }} />,
      title: 'Registrar Asistencia',
      color: 'success',
      buttonText: 'Registrar Ahora',
      onClick: () => navigate('/attendance/register'),
    },
    {
      icon: <GroupIcon sx={{ fontSize: 48, color: '#ef4444', mb: 1 }} />,
      title: 'Gestionar Estudiantes',
      color: 'error',
      buttonText: 'Ir a Estudiantes',
      onClick: () => navigate('/students'),
    },
  ] as const;

  return (
    <Header>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '90vh',
          width: '100%',
          p: { xs: 1, sm: 3 },
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Typography variant="h6" color="text.secondary">
              Cargando perfil...
            </Typography>
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
            style={{ width: '100%', maxWidth: 600 }}
          >
            {/* Card principal */}
            <Paper
              elevation={5}
              sx={{
                borderRadius: 5,
                px: { xs: 3, sm: 6 },
                py: { xs: 4, sm: 6 },
                mb: { xs: 3, md: 4 },
                boxShadow: '0 8px 32px rgba(99,102,241,0.14)',
                background: 'rgba(255,255,255,0.98)',
                textAlign: 'center',
                width: '100%',
              }}
            >
              <motion.div
                initial={{ scale: 0.75, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
              >
                <img
                  src="/nfc-dashboard-hero.svg"
                  alt="Dashboard hero"
                  width={110}
                  style={{
                    marginBottom: 16,
                    borderRadius: '50%',
                    boxShadow: '0 2px 16px #6366f140',
                  }}
                  onError={e => (e.currentTarget.style.display = 'none')}
                />
              </motion.div>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  color: '#36398c',
                  mb: 1,
                  fontFamily: 'Montserrat, SF Pro Display, Roboto, Arial, sans-serif',
                }}
              >
                ¡Hola, {user?.username || 'Usuario'}!
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2, fontWeight: 400 }}>
                Bienvenido(a) al Panel de Control de NFC Students
              </Typography>
              <Typography variant="body1" sx={{ color: '#6366f1', mb: 2 }}>
                Gestiona la asistencia y los estudiantes de forma fácil y rápida.<br />
                <b>¿Qué deseas hacer hoy?</b>
              </Typography>
            </Paper>

            {/* Acciones, centradas y responsive */}
            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={isMobile ? 2.5 : 4}
              justifyContent="center"
              alignItems="center"
              sx={{
                width: '100%',
                mt: 2,
                gap: isMobile ? 2.5 : 4,
              }}
            >
              {actions.map((action, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 32px #6366f1aa' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%',
                    maxWidth: 600,
                    margin: isMobile ? '0 auto' : undefined,
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      borderRadius: 4,
                      py: 4,
                      px: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      boxShadow: '0 2px 16px #dbeafe77',
                      width: '100%',
                      maxWidth: 600,
                      margin: '0 auto',
                    }}
                  >
                    {action.icon}
                    <Typography fontWeight={700} mb={2} align="center">
                      {action.title}
                    </Typography>
                    <Button
                      variant="contained"
                      color={action.color}
                      fullWidth
                      onClick={action.onClick}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: 16,
                        mt: 1,
                        px: 2,
                      }}
                    >
                      {action.buttonText}
                    </Button>
                  </Paper>
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        )}
      </Box>
    </Header>
  );
};
