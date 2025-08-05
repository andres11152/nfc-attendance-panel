import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, Button, Typography, CircularProgress, Alert, Paper, TextField, Divider, useTheme
} from '@mui/material';
import TapAndPlayIcon from '@mui/icons-material/TapAndPlay';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useCases } from '../application/providers';
import type { AttendanceRegisterDto, AttendanceRecord } from '../core/domain/attendance';
import { Header } from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';

const normalizeNfcId = (rawId: string): string =>
  rawId.replace(/[^a-fA-F0-9]/g, '').toLowerCase();

export const DirectNfcRegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isNfcAvailable, setIsNfcAvailable] = useState(false);
  const [manualNfcId, setManualNfcId] = useState('');

  const theme = useTheme();

  useEffect(() => {
    if ('NDEFReader' in window) {
      setIsNfcAvailable(true);
      setMessage({ type: 'info', text: 'Dispositivo compatible con NFC. ¡Listo para escanear!' });
    } else {
      setIsNfcAvailable(false);
      setMessage({ type: 'error', text: 'Web NFC no es compatible. Usa Chrome en Android.' });
    }
  }, []);

  const handleNfcScanAndRegister = useCallback(async () => {
    if (!isNfcAvailable) {
      setMessage({ type: 'error', text: 'La funcionalidad NFC no está disponible.' });
      return;
    }
    setLoading(true);
    setMessage({ type: 'info', text: 'Acerca una tarjeta NFC...' });

    try {
      const reader = new (window as any).NDEFReader();
      await reader.scan();

      reader.onreading = async (event: any) => {
        try {
          const textRecord = event.message.records.find((r: any) => r.recordType === 'text');
          let scannedId = textRecord ? new TextDecoder().decode(textRecord.data) : event.serialNumber;
          if (!scannedId) throw new Error('No se pudo leer ID de la tarjeta.');
          scannedId = normalizeNfcId(scannedId);

          const foundStudent = await useCases.student.findByNfcId.execute(scannedId);
          if (!foundStudent) throw new Error(`Estudiante con ID NFC "${scannedId}" no fue encontrado.`);
          setMessage({ type: 'info', text: `Estudiante: ${foundStudent.name} ${foundStudent.lastName}` });

          const attendanceData: AttendanceRegisterDto = {
            studentId: foundStudent.id,
            status: 'Presente',
          };
          const newRecord: AttendanceRecord = await useCases.attendance.record.execute(attendanceData);

          setMessage({
            type: 'success',
            text: `¡Asistencia registrada! ${newRecord.student.name} está como "${newRecord.type === 'entry' ? 'Entrada' : 'Salida'}".`,
          });
        } catch (err: any) {
          setMessage({ type: 'error', text: err.message || 'Error al procesar escaneo' });
        } finally {
          setLoading(false);
        }
      };

      reader.onreadingerror = () => {
        setMessage({ type: 'error', text: 'Error al leer la tarjeta.' });
        setLoading(false);
      };
    } catch (err: any) {
      setMessage({ type: 'error', text: `No se pudo iniciar el escaneo: ${err.message}` });
      setLoading(false);
    }
  }, [isNfcAvailable]);

  const handleManualSubmit = async () => {
    if (!manualNfcId) {
      setMessage({ type: 'error', text: 'Por favor, ingresa un ID NFC válido.' });
      return;
    }
    setLoading(true);
    try {
      const record = await useCases.attendance.recordViaNfcId.execute(manualNfcId.trim());
      setMessage({
        type: 'success',
        text: `✅ Asistencia registrada para ${record.student.name} como "${record.type === 'entry' ? 'Entrada' : 'Salida'}"`,
      });
      setManualNfcId('');
    } catch (err: any) {
      setMessage({ type: 'error', text: `❌ Error: ${err.message || 'Registro fallido'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Header>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          minHeight: '90vh',
          p: { xs: 1, md: 3 },
          bgcolor: 'transparent',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 50 }}
          style={{ width: '100%', maxWidth: 430, margin: '0 auto' }}
        >
          <Paper
            elevation={6}
            sx={{
              py: { xs: 4, md: 6 },
              px: { xs: 2, sm: 4 },
              borderRadius: 5,
              boxShadow: '0 6px 36px rgba(99,102,241,.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: { xs: 3, md: 4 },
              width: '100%',
              backdropFilter: 'blur(2.5px)',
              background: 'rgba(255,255,255,0.98)',
            }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0.8 }}
              animate={{
                scale: loading ? [1, 1.05, 0.97, 1.05, 1] : 1,
                opacity: 1,
                boxShadow: loading ? '0 0 0 0px #6366f155' : '0 2px 16px 0 #6366f120',
              }}
              transition={{
                scale: { duration: 0.6, type: 'spring', bounce: 0.5 },
                boxShadow: { duration: 0.8 },
                repeat: loading ? Infinity : 0,
                repeatType: 'mirror'
              }}
              style={{
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #f5f6fa, #e6e9f0)',
                width: 130,
                height: 130,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              {loading ? (
                <CircularProgress size={65} thickness={5} color="secondary" />
              ) : (
                <TapAndPlayIcon sx={{ fontSize: 60, color: '#6366f1' }} />
              )}
            </motion.div>

            <Typography
              variant="h4"
              textAlign="center"
              fontWeight={800}
              letterSpacing={0.3}
              color="#2e3272"
              sx={{
                fontFamily: 'Montserrat, SF Pro Display, Roboto, Arial, sans-serif',
                mb: 0,
              }}
            >
              Registro Rápido de Asistencia
            </Typography>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.35 }}
                  style={{ width: '100%' }}
                >
                  <Alert
                    severity={message.type}
                    sx={{
                      width: '100%',
                      fontSize: { xs: 15, sm: 16 },
                      borderRadius: 3,
                      mb: 1,
                      py: 1.5,
                      px: 2,
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {message.text}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="contained"
              color="primary"
              onClick={handleNfcScanAndRegister}
              disabled={loading || !isNfcAvailable}
              sx={{
                width: 190,
                height: 54,
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 19,
                textTransform: 'none',
                letterSpacing: 0.6,
                boxShadow: '0 4px 24px #6366f13d',
                mb: 0.5,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#6366f1',
                  color: '#fff',
                  boxShadow: '0 8px 36px #6366f135',
                  transform: 'translateY(-2px) scale(1.025)',
                },
              }}
            >
              {loading ? 'Escaneando...' : 'Escanear'}
            </Button>

            <Divider sx={{ width: '100%', fontWeight: 700, color: '#6366f1' }}>
              <span style={{
                fontFamily: 'Montserrat, SF Pro Display, Roboto, Arial, sans-serif',
                fontWeight: 700, letterSpacing: 0.3, fontSize: 15
              }}>O prueba manual</span>
            </Divider>

            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              width: '100%',
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <TextField
                label="ID NFC Manual"
                placeholder="Ej: 048585ba3e2d80"
                value={manualNfcId}
                onChange={(e) => setManualNfcId(e.target.value)}
                fullWidth
                size="medium"
                disabled={loading}
                sx={{
                  borderRadius: 3,
                  background: 'rgba(247,247,255,0.9)',
                  boxShadow: '0 1px 6px #b8c1ec11',
                }}
                InputLabelProps={{
                  sx: { fontWeight: 600, color: '#6366f1' }
                }}
              />
              <Button
                variant="outlined"
                startIcon={<BugReportIcon />}
                color="secondary"
                onClick={handleManualSubmit}
                disabled={loading || !manualNfcId}
                sx={{
                  borderRadius: 3,
                  fontWeight: 700,
                  minWidth: 160,
                  px: 3,
                  fontSize: 17,
                  textTransform: 'none',
                  letterSpacing: 0.5,
                  background: '#fff',
                  boxShadow: '0 2px 12px #8b5cf655',
                  transition: 'all 0.17s',
                  '&:hover': {
                    borderColor: '#6366f1',
                    color: '#6366f1',
                    background: '#eef2ff',
                  },
                }}
              >
                Registrar Asistencia
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Header>
  );
};
