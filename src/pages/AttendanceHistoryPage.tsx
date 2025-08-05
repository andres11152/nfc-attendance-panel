import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
} from '@mui/material';
import * as xlsx from 'xlsx';

import { AttendanceRecord, AttendanceFilters } from '../core/domain/attendance';
import { Student } from '../core/domain/student';
import { useCases } from '../application/providers';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import { Header } from '../components/Header';

const tipoEtiqueta = (t: 'entry' | 'exit') => (t === 'entry' ? 'Entrada' : 'Salida');

export const AttendanceHistoryPage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AttendanceFilters>({
    studentId: undefined,
    startDate: undefined,
    endDate: undefined,
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRecords = await useCases.attendance.history.execute(filters);
      setRecords(fetchedRecords);
    } catch (err: any) {
      setError('No se pudo cargar el historial de asistencia: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStudentsForFilter = useCallback(async () => {
    try {
      const fetchedStudents = await useCases.student.get.execute();
      setStudents(fetchedStudents);
    } catch (err) {
      // No acción crítica
    }
  }, []);

  useEffect(() => {
    fetchRecords();
    fetchStudentsForFilter();
  }, [fetchRecords, fetchStudentsForFilter]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value === '' ? undefined : value }));
  };

  const applyFilters = () => {
    fetchRecords();
    setIsFilterModalOpen(false);
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({ studentId: undefined, startDate: undefined, endDate: undefined });
    setIsFilterModalOpen(false);
    setPage(0);
  };

  const handleExportExcel = () => {
    const dataToExport = records.map(record => ({
      Nombre_Estudiante: record.student ? `${record.student.name} ${record.student.lastName}` : 'Desconocido',
      Fecha: new Date(record.timestamp).toLocaleDateString(),
      Hora: new Date(record.timestamp).toLocaleTimeString(),
      Estado: tipoEtiqueta(record.type),
    }));

    const worksheet = xlsx.utils.json_to_sheet(dataToExport);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Historial Asistencia');
    xlsx.writeFile(workbook, 'historial_asistencia.xlsx');
  };

  const handleChangePage = (_: any, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginated = records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // --- Aquí empieza el layout común envuelto con Header ---
  return (
    <Header>
      <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto', p: 0 }}>
        <Typography variant="h4" gutterBottom>
          Historial de Asistencia
        </Typography>

        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="contained" onClick={() => setIsFilterModalOpen(true)} disabled={loading}>
            Aplicar Filtros
          </Button>
          <Button variant="outlined" onClick={handleExportExcel} disabled={records.length === 0 || loading}>
            Exportar a Excel
          </Button>
          <Button variant="outlined" onClick={fetchRecords} disabled={loading}>
            Recargar Datos
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre Estudiante</TableCell>
                    <TableCell>Fecha y Hora</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No hay registros.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map(record => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {record.student ? `${record.student.name} ${record.student.lastName}` : 'Desconocido'}
                        </TableCell>
                        <TableCell>
                          {record.timestamp ? new Date(record.timestamp).toLocaleString() : ''}
                        </TableCell>
                        <TableCell>{tipoEtiqueta(record.type)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={records.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Paper>
        )}

        <Dialog open={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
          <DialogTitle>Filtrar Historial de Asistencia</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
              <TextField
                select
                label="Estudiante"
                name="studentId"
                value={filters.studentId || ''}
                onChange={handleFilterChange}
                fullWidth
              >
                <MenuItem value="">
                  <em>Todos los estudiantes</em>
                </MenuItem>
                {students.map(student => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name} {student.lastName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Fecha Desde"
                type="date"
                name="startDate"
                value={filters.startDate || ''}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Fecha Hasta"
                type="date"
                name="endDate"
                value={filters.endDate || ''}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={clearFilters}>Limpiar Filtros</Button>
            <Button onClick={applyFilters} variant="contained">
              Aplicar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Header>
  );
};
