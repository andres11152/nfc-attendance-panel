// src/pages/LoginPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CredentialsDto } from '../core/domain/auth';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Fade,
  InputAdornment,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const LoginPage: React.FC = () => {
  const { login, loading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<CredentialsDto>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(credentials);
      // La redirección la maneja el useEffect
    } catch (err: any) {
      setError('Credenciales incorrectas. Intenta nuevamente.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 6 },
          borderRadius: 4,
          minWidth: { xs: '90vw', sm: 400 },
          maxWidth: 400,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.20)',
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 40, color: '#111', mb: 1 }} />
        <Typography
          variant="h5"
          fontWeight={700}
          letterSpacing={1}
          mb={3}
          color="text.primary"
          sx={{
            fontFamily: '"SF Pro Display", "Roboto", "Arial", sans-serif',
            textAlign: 'center',
          }}
        >
          Iniciar Sesión
        </Typography>

        <Box
          component="form"
          width="100%"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <TextField
            name="username"
            label="Usuario"
            placeholder="Escribe tu usuario"
            value={credentials.username}
            onChange={handleChange}
            margin="normal"
            required
            fullWidth
            variant="outlined"
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: 'rgba(255,255,255,0.7)',
              borderRadius: 2,
              mb: 2,
              '& input': {
                fontSize: 18,
                fontFamily: '"SF Pro Display", "Roboto", "Arial", sans-serif',
              },
            }}
          />
          <TextField
            name="password"
            label="Contraseña"
            placeholder="••••••••"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            margin="normal"
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: 'rgba(255,255,255,0.7)',
              borderRadius: 2,
              mb: 2,
              '& input': {
                fontSize: 18,
                fontFamily: '"SF Pro Display", "Roboto", "Arial", sans-serif',
              },
            }}
          />
          <Fade in={!!error}>
            <Typography color="error" align="center" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          </Fade>

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: '#111',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
              fontWeight: 600,
              textTransform: 'none',
              fontFamily: '"SF Pro Display", "Roboto", "Arial", sans-serif',
              fontSize: 18,
              letterSpacing: 1,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: '#222',
                transform: 'translateY(-2px) scale(1.01)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
              },
            }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
