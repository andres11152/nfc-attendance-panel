import React, { useState, useCallback, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, CircularProgress, Alert, Paper,
  Accordion, AccordionSummary, AccordionDetails, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TapAndPlayIcon from '@mui/icons-material/TapAndPlay';
import MemoryIcon from '@mui/icons-material/Memory';
import BugReportIcon from '@mui/icons-material/BugReport';
import { Student } from '../core/domain/student';
import { useCases } from '../application/providers';

export const AttendanceRegisterPage: React.FC = () => {
  const [nfcId, setNfcId] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isNfcAvailable, setIsNfcAvailable] = useState(false);
  const [idToWrite, setIdToWrite] = useState('');

  useEffect(() => {
    if ('NDEFReader' in window) {
      setIsNfcAvailable(true);
    } else {
      setIsNfcAvailable(false);
      setMessage({ type: 'error', text: 'Web NFC no es compatible. Usa Chrome en Android para escanear.' });
    }
  }, []);

  const handleNfcIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNfcId(event.target.value);
    setStudent(null);
    setMessage(null);
  };

  const findStudent = useCallback(async (scannedNfcId: string) => {
    if (!scannedNfcId) {
      setMessage({ type: 'error', text: 'Por favor, ingrese o escanee un ID NFC.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const foundStudent = await useCases.student.findByNfcId.execute(scannedNfcId);
      if (foundStudent) {
        setStudent(foundStudent);
        setMessage({ type: 'success', text: `🎓 Estudiante encontrado: ${foundStudent.name} ${foundStudent.lastName}` });
        setNfcId(scannedNfcId);
      } else {
        setStudent(null);
        setMessage({ type: 'error', text: '⚠️ Estudiante no encontrado con ese ID NFC.' });
      }
    } catch (err: any) {
      console.error("Error al buscar estudiante:", err);
      setMessage({ type: 'error', text: `❌ Error al buscar estudiante: ${err.message || 'Desconocido'}` });
    } finally {
      setLoading(false);
    }
  }, []);

  const recordAttendance = useCallback(async () => {
    if (!student) {
      setMessage({ type: 'error', text: 'Por favor, encuentre un estudiante primero.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const fullName = `${student.name} ${student.lastName}`;
      const attendanceData = { nfcId: student.nfcId };
      const newRecord = await useCases.attendance.record.execute(attendanceData);
      setMessage({ type: 'success', text: `✅ Asistencia registrada para ${fullName} (${newRecord.type})` });
      setNfcId('');
      setStudent(null);
    } catch (err: any) {
      console.error("Error al registrar asistencia:", err);
      const is404 = err.message?.includes('404');
      if (is404) {
        setMessage({ type: 'error', text: '❌ Estudiante no encontrado. Verifica el ID NFC.' });
      } else {
        setMessage({ type: 'error', text: `❌ Error al registrar asistencia: ${err.message || 'Desconocido'}` });
      }
    } finally {
      setLoading(false);
    }
  }, [student]);

  const startNfcScan = useCallback(async () => {
    if (!isNfcAvailable) return;
    setLoading(true);
    setMessage({ type: 'success', text: 'Acerca una tarjeta NFC para leer...' });
    try {
      const reader = new (window as any).NDEFReader();
      await reader.scan();
      reader.onreading = (event: any) => {
        const textRecord = event.message.records.find((r: any) => r.recordType === 'text');
        const scannedId = textRecord ? new TextDecoder().decode(textRecord.data) : event.serialNumber;
        setMessage({ type: 'success', text: `📶 NFC ID Escaneado: ${scannedId}` });
        findStudent(scannedId);
      };
      reader.onreadingerror = () => {
        setMessage({ type: 'error', text: '❌ No se pudo leer la tarjeta NFC.' });
        setLoading(false);
      };
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error al iniciar escaneo: ${error.message}` });
      setLoading(false);
    }
  }, [isNfcAvailable, findStudent]);

  const writeNfcTag = useCallback(async () => {
    if (!isNfcAvailable || !idToWrite) return;
    setLoading(true);
    setMessage({ type: 'success', text: 'Acerca una tarjeta NFC para programar...' });
    try {
      const writer = new (window as any).NDEFReader();
      await writer.write({ records: [{ recordType: "text", data: idToWrite }] });
      setMessage({ type: 'success', text: `✅ Se escribió el ID "${idToWrite}" en la tarjeta.` });
      setIdToWrite('');
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ Error al escribir en la tarjeta: ${error.message}` });
    } finally {
      setLoading(false);
    }
  }, [isNfcAvailable, idToWrite]);

  const handleSimulateScan = async () => {
    if (!nfcId) {
      setMessage({ type: 'error', text: 'Ingrese un ID NFC en el campo de texto para simular.' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      const foundStudent = await useCases.student.findByNfcId.execute(nfcId);
      if (!foundStudent) {
        setMessage({ type: 'error', text: '⚠️ Estudiante no encontrado con ese ID NFC.' });
        return;
      }

      const newRecord = await useCases.attendance.record.execute({ nfcId: foundStudent.nfcId });
      setMessage({
        type: 'success',
        text: `✅ Asistencia registrada para ${foundStudent.name} ${foundStudent.lastName} (${newRecord.type})`
      });
      setNfcId('');
    } catch (error: any) {
      console.error('Error al simular registro de asistencia:', error);
      setMessage({ type: 'error', text: `❌ ${error.message || 'Error desconocido'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Registrar Asistencia
      </Typography>

      {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

      <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h6">1. Registrar Asistencia por NFC</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
            <TextField
              label="ID NFC del Estudiante"
              value={nfcId}
              onChange={handleNfcIdChange}
              fullWidth
              required
              disabled={loading}
              placeholder="Escanee o ingrese un ID"
            />
            <Button
              variant="contained"
              startIcon={<TapAndPlayIcon />}
              onClick={startNfcScan}
              disabled={loading || !isNfcAvailable}
              sx={{ flexShrink: 0, height: '56px' }}
            >
              Escanear
            </Button>
          </Box>
        </Box>

        {student && (
          <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
            <Typography variant="body1">
              <strong>Estudiante:</strong> {student.name} {student.lastName}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={recordAttendance}
              disabled={loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Confirmar Asistencia Manual'}
            </Button>
          </Box>
        )}
      </Paper>

      <Accordion sx={{ mt: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Herramientas de Administrador</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6">Programar Tarjeta NFC</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
              <TextField
                label="ID a escribir"
                value={idToWrite}
                onChange={(e) => setIdToWrite(e.target.value)}
                fullWidth
                disabled={loading}
              />
              <Button
                variant="contained"
                color="secondary"
                startIcon={<MemoryIcon />}
                onClick={writeNfcTag}
                disabled={loading || !isNfcAvailable || !idToWrite}
                sx={{ flexShrink: 0, height: '56px' }}
              >
                Escribir
              </Button>
            </Box>
          </Box>
          <Divider />
          <Box>
            <Typography variant="h6">Simulación y Pruebas</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Use el ID del campo principal para simular un escaneo y registrar la asistencia en un solo paso.
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<BugReportIcon />}
              onClick={handleSimulateScan}
              disabled={loading || !nfcId}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Simular Escaneo y Registrar'}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
