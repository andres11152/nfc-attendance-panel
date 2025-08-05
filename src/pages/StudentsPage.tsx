import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Stack,
  Snackbar,
  Input,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';
import { Student } from '../core/domain/student';
import { useCases } from '../application/providers';
import { Header } from '../components/Header';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editData, setEditData] = useState<Partial<Student>>({});
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addData, setAddData] = useState({ name: '', lastName: '', nfcId: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await useCases.student.get.execute();
      setStudents(result);
    } catch (e: any) {
      setError('No se pudieron cargar los estudiantes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStudents();
  }, []);

  // --- CRUD ---
  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setEditData({
      name: student.name,
      lastName: student.lastName,
      nfcId: student.nfcId,
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    if (selectedStudent) {
      try {
        await useCases.student.update.execute(selectedStudent.id, editData);
        setEditDialogOpen(false);
        setSelectedStudent(null);
        setAlertType('success');
        setAlertMsg('Estudiante actualizado correctamente.');
        await fetchStudents();
      } catch (e) {
        setAlertType('error');
        setAlertMsg('Error actualizando estudiante.');
      }
    }
  };

  const handleOpenDelete = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedStudent) {
      try {
        await useCases.student.delete.execute(selectedStudent.id);
        setDeleteDialogOpen(false);
        setSelectedStudent(null);
        setAlertType('success');
        setAlertMsg('Estudiante eliminado correctamente.');
        await fetchStudents();
      } catch (e) {
        setAlertType('error');
        setAlertMsg('Error eliminando estudiante.');
      }
    }
  };

  // --- ADD ---
  const handleOpenAdd = () => {
    setAddData({ name: '', lastName: '', nfcId: '' });
    setAddDialogOpen(true);
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddData({ ...addData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async () => {
    setAddLoading(true);
    try {
      const cleanData = {
        name: addData.name.trim(),
        lastName: addData.lastName.trim(),
        nfcId: addData.nfcId.trim(),
      };
      await useCases.student.create.execute(cleanData);
      setAddDialogOpen(false);
      setAlertType('success');
      setAlertMsg('Estudiante creado correctamente.');
      await fetchStudents();
    } catch (e) {
      setAlertType('error');
      setAlertMsg('Error creando estudiante.');
    } finally {
      setAddLoading(false);
    }
  };

  // --- IMPORT ---
  const handleOpenImport = () => {
    setImportFile(null);
    setImportDialogOpen(true);
  };

  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleImportSubmit = async () => {
    if (!importFile) return;
    setImportLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      const API_BASE = import.meta.env.VITE_API_BASE || '/api';
      const token = localStorage.getItem('token'); // AJUSTA AQUÍ tu key real
      const res = await fetch(`${API_BASE}/students/import`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Error importando estudiantes');
      setImportDialogOpen(false);
      setAlertType('success');
      setAlertMsg('Importación exitosa.');
      await fetchStudents();
    } catch (e) {
      setAlertType('error');
      setAlertMsg('Error importando estudiantes.');
    } finally {
      setImportLoading(false);
    }
  };

  const handleCloseAlert = () => setAlertMsg(null);

  return (
    <Header>
      <Box sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        p: { xs: 1, md: 3 },
        minHeight: '85vh',
        background: { xs: '#f6f7fb', md: 'transparent' },
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            gap: 1,
            flexWrap: 'wrap',
          }}>
          <IconButton onClick={() => navigate('/dashboard')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            Estudiantes
          </Typography>
          <Box flexGrow={1} />
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleOpenImport}
            startIcon={<UploadFileIcon />}
            sx={{ mr: 1, fontSize: { xs: '0.8rem', sm: '1rem' } }}
          >
            Importar Excel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAdd}
            startIcon={<AddIcon />}
            sx={{ mr: 1, fontSize: { xs: '0.8rem', sm: '1rem' } }}
          >
            Agregar
          </Button>
          <Button variant="contained" onClick={fetchStudents} disabled={loading}
            sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
            {loading ? 'Actualizando...' : 'Refrescar'}
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <>
            {/* Desktop Table */}
            {!isMobile ? (
              <Paper elevation={2} sx={{ width: '100%', overflowX: 'auto', borderRadius: 3, boxShadow: 2 }}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Apellido</TableCell>
                      <TableCell>NFC ID</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No hay estudiantes.
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>{s.name}</TableCell>
                          <TableCell>{s.lastName}</TableCell>
                          <TableCell>{s.nfcId}</TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => handleOpenEdit(s)} color="primary" size="small">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleOpenDelete(s)} color="error" size="small">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Paper>
            ) : (
              // Mobile: Listado tipo card
              <Stack spacing={2} sx={{ mt: 2 }}>
                {students.length === 0 ? (
                  <Paper sx={{ textAlign: 'center', p: 2 }}>No hay estudiantes.</Paper>
                ) : (
                  students.map((s) => (
                    <Card key={s.id} variant="outlined" sx={{ boxShadow: 3, borderRadius: 3 }}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight={700}>{s.name} {s.lastName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            <b>NFC:</b> {s.nfcId}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton onClick={() => handleOpenEdit(s)} color="primary" size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleOpenDelete(s)} color="error" size="small">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Stack>
            )}
          </>
        )}

        {/* Add Student Dialog */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Agregar Estudiante</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="name"
              label="Nombre"
              value={addData.name}
              onChange={handleAddChange}
              fullWidth
              required
              autoFocus
            />
            <TextField
              name="lastName"
              label="Apellido"
              value={addData.lastName}
              onChange={handleAddChange}
              fullWidth
              required
            />
            <TextField
              name="nfcId"
              label="NFC ID"
              value={addData.nfcId}
              onChange={handleAddChange}
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddSubmit} variant="contained" disabled={addLoading}>
              {addLoading ? <CircularProgress size={22} /> : "Agregar"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Import Students Dialog */}
        <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Importar Estudiantes desde Excel</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Input
                type="file"
                inputProps={{ accept: '.xls,.xlsx,.csv' }}
                onChange={handleImportChange}
                fullWidth
                required
                disabled={importLoading}
              />
              <Typography variant="body2" color="text.secondary">
                Selecciona un archivo Excel con las columnas: <b>name</b>, <b>lastName</b>, <b>nfcId</b>
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setImportDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleImportSubmit} variant="contained" disabled={importLoading || !importFile}>
              {importLoading ? <CircularProgress size={22} /> : "Importar"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Editar Estudiante</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="name"
              label="Nombre"
              value={editData.name ?? ''}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              name="lastName"
              label="Apellido"
              value={editData.lastName ?? ''}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              name="nfcId"
              label="NFC ID"
              value={editData.nfcId ?? ''}
              onChange={handleEditChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditSubmit} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle>Eliminar Estudiante</DialogTitle>
          <DialogContent>
            ¿Seguro que deseas eliminar a "{selectedStudent?.name} {selectedStudent?.lastName}"?
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDelete} variant="contained" color="error">Eliminar</Button>
          </DialogActions>
        </Dialog>

        {/* Feedback Alert */}
        <Snackbar
          open={!!alertMsg}
          autoHideDuration={3500}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity={alertType} sx={{ width: '100%' }}>
            {alertMsg}
          </Alert>
        </Snackbar>
      </Box>
    </Header>
  );
};

export default StudentsPage;
