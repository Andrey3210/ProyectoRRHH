import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Container,
  Paper,
  TextField,
  Select,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Checkbox,
  Tooltip,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  CssBaseline,
  Stack
} from '@mui/material';

// --- ICONOS ---
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PaidIcon from '@mui/icons-material/Paid';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RuleIcon from '@mui/icons-material/Rule';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DownloadIcon from '@mui/icons-material/Download';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import UndoIcon from '@mui/icons-material/Undo';

// ==========================================
// 1. NAVBAR (Reutilizado)
// ==========================================
const NavbarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElConfig, setAnchorElConfig] = useState(null);
  const [anchorElGestion, setAnchorElGestion] = useState(null);

  const handleOpenConfig = (event) => setAnchorElConfig(event.currentTarget);
  const handleCloseConfig = () => setAnchorElConfig(null);
  const handleOpenGestion = (event) => setAnchorElGestion(event.currentTarget);
  const handleCloseGestion = () => setAnchorElGestion(null);

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseConfig();
    handleCloseGestion();
  };

  const getButtonStyle = (path) => ({
    textTransform: 'none',
    fontWeight: location.pathname.includes(path) ? 'bold' : 'medium',
    color: location.pathname.includes(path) ? '#2563EB' : '#4B5563',
    mx: 1,
    '&:hover': { backgroundColor: '#EFF6FF', color: '#2563EB' }
  });

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #E5E7EB', bgcolor: 'white' }}>
      <Toolbar variant="dense">
        <Button startIcon={<DashboardIcon />} onClick={() => navigate('/incentivos-reconocimientos/admin/dashboard')} sx={getButtonStyle('/dashboard')}>
          Dashboard
        </Button>
        <Box>
          <Button startIcon={<SettingsIcon />} endIcon={<KeyboardArrowDownIcon />} onClick={handleOpenConfig} sx={getButtonStyle('/reglas')}>
            Configuración
          </Button>
          <Menu anchorEl={anchorElConfig} open={Boolean(anchorElConfig)} onClose={handleCloseConfig}>
            <MenuItem onClick={() => handleNavigate('/incentivos-reconocimientos/admin/reglas')}>
              <ListItemIcon><RuleIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Reglas de Incentivos" />
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/incentivos-reconocimientos/admin/metas')}>
              <ListItemIcon><TrackChangesIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Metas del Periodo" />
            </MenuItem>
          </Menu>
        </Box>
        <Box>
          <Button startIcon={<PaidIcon />} endIcon={<KeyboardArrowDownIcon />} onClick={handleOpenGestion} sx={getButtonStyle('/gestion')}>
            Gestión
          </Button>
          <Menu anchorEl={anchorElGestion} open={Boolean(anchorElGestion)} onClose={handleCloseGestion}>
            <MenuItem onClick={() => handleNavigate('/incentivos-reconocimientos/admin/aprobaciones')}>
              <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Aprobar Bonos" />
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/incentivos-reconocimientos/admin/reportes')}>
              <ListItemIcon><AssessmentIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Reportes" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// ==========================================
// 2. DATOS MOCK
// ==========================================
const initialBonuses = [
  { id: 1, empleado: 'Juan Pérez', depto: 'Ventas', concepto: 'Comisión 5%', regla: 'Regla #101', evidencia: '45 Boletas', monto: 1200.00, estado: 'pendiente', es_alto: false },
  { id: 2, empleado: 'Ana Gómez', depto: 'Atención', concepto: 'Bono Calidad', regla: 'Meta #55', evidencia: '90 Tickets', monto: 500.00, estado: 'pendiente', es_alto: false },
  { id: 3, empleado: 'Luis T.', depto: 'Ventas', concepto: 'Bono Junior', regla: 'Regla #103', evidencia: '10 Boletas', monto: 150.00, estado: 'rechazado', es_alto: false },
  { id: 4, empleado: 'Carlos Vega', depto: 'Ventas', concepto: 'Bono Top Seller', regla: 'Regla #102', evidencia: 'Reporte Q4', monto: 15000.00, estado: 'pendiente', es_alto: true }, // Alto monto
  { id: 5, empleado: 'Maria Lopez', depto: 'Atención', concepto: 'Sin Quejas', regla: 'Regla #202', evidencia: 'Dashboard', monto: 200.00, estado: 'aprobado', es_alto: false },
];

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
const AprobacionesBonos = () => {
  const [bonuses, setBonuses] = useState(initialBonuses);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('pendiente'); // 'Todos', 'pendiente', 'aprobado', 'rechazado'

  // Modal Rechazo
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [currentBonusToReject, setCurrentBonusToReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectAction, setRejectAction] = useState('rechazar'); // 'rechazar' | 'recalcular'

  // --- LÓGICA DE FILTRADO ---
  const filteredBonuses = useMemo(() => {
    return bonuses.filter(bonus => {
      const matchesSearch = bonus.empleado.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = filterDept === 'Todos' || bonus.depto === filterDept;
      const matchesStatus = filterStatus === 'Todos' || bonus.estado === filterStatus;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [bonuses, searchTerm, filterDept, filterStatus]);

  // --- LÓGICA FINANCIERA (Sticky Bar) ---
  const totalCalculated = bonuses.reduce((acc, curr) => acc + (curr.estado !== 'rechazado' ? curr.monto : 0), 0);
  const totalApproved = bonuses.filter(b => b.estado === 'aprobado').reduce((acc, curr) => acc + curr.monto, 0);
  const totalPending = bonuses.filter(b => b.estado === 'pendiente').reduce((acc, curr) => acc + curr.monto, 0);
  
  const percentApproved = totalCalculated > 0 ? (totalApproved / totalCalculated) * 100 : 0;
  const percentPending = totalCalculated > 0 ? (totalPending / totalCalculated) * 100 : 0;

  // --- MANEJADORES DE ACCIÓN ---
  const handleToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const pendingIds = filteredBonuses.filter(b => b.estado === 'pendiente').map(b => b.id);
      setSelectedIds(pendingIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleApprove = (id) => {
    // Verificar monto alto
    const bonus = bonuses.find(b => b.id === id);
    if (bonus && bonus.es_alto && !window.confirm(`⚠️ ADVERTENCIA: Este bono es de S/ ${bonus.monto.toLocaleString()}. ¿Estás seguro de aprobar este monto inusual?`)) {
      return;
    }
    updateStatus(id, 'aprobado');
  };

  const handleApproveSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`¿Aprobar ${selectedIds.length} bonos seleccionados?`)) {
      setBonuses(prev => prev.map(b => selectedIds.includes(b.id) ? { ...b, estado: 'aprobado' } : b));
      setSelectedIds([]);
    }
  };

  const handleOpenRejectModal = (bonus) => {
    setCurrentBonusToReject(bonus);
    setRejectReason('');
    setRejectAction('rechazar');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      alert("Debes ingresar un motivo para el rechazo.");
      return;
    }
    // Aquí podrías manejar la lógica diferente si es 'recalcular'
    updateStatus(currentBonusToReject.id, 'rechazado');
    setRejectModalOpen(false);
  };

  const updateStatus = (id, status) => {
    setBonuses(prev => prev.map(b => b.id === id ? { ...b, estado: status } : b));
  };

  return (
    <Box sx={{ bgcolor: '#F3F4F6', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
      <CssBaseline />
      <NavbarAdmin />

      <Container maxWidth={false} sx={{ mt: 3, mb: 4, px: { xs: 2, md: 4 } }}>
        
        {/* 2. BARRA DE RESUMEN FINANCIERO (Sticky Bar) */}
        {/* MODIFICADO: Ahora con fondo blanco/claro y texto oscuro para mejor legibilidad */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 2, 
            position: 'sticky', 
            top: 10, // Un poco separado del top para efecto flotante
            zIndex: 1000,
            bgcolor: '#FFFFFF', // Fondo BLANCO para modo claro
            color: '#1F2937',   // Texto OSCURO para contraste
            borderLeft: '6px solid #10B981'
          }}
        >
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle2" sx={{ opacity: 0.6, letterSpacing: 1, color: '#4B5563' }}>BOLSA DE INCENTIVOS (Noviembre 2025)</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mt: 0.5 }}>
                 <Typography variant="h4" fontWeight="bold" color="#111827">S/ {totalCalculated.toLocaleString()}</Typography>
                 <Typography variant="caption" sx={{ bgcolor: '#F3F4F6', color: '#374151', px: 1, borderRadius: 1, border: '1px solid #E5E7EB', fontWeight: 'medium' }}>Total Proyectado</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
               <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircleIcon fontSize="inherit" /> YA APROBADO ({percentApproved.toFixed(0)}%)
               </Typography>
               <Typography variant="h6" fontWeight="bold" color="#111827">S/ {totalApproved.toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={6} md={2}>
               <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <HourglassEmptyIcon fontSize="inherit" /> POR APROBAR ({percentPending.toFixed(0)}%)
               </Typography>
               <Typography variant="h6" fontWeight="bold" color="#111827">S/ {totalPending.toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
               <Button 
                 variant="contained" 
                 color="success" 
                 disabled={selectedIds.length === 0}
                 onClick={handleApproveSelected}
                 startIcon={<CheckCircleIcon />}
               >
                 Aprobar ({selectedIds.length})
               </Button>
               <Button variant="outlined" sx={{ color: '#2563EB', borderColor: 'rgba(37, 99, 235, 0.5)' }} startIcon={<DownloadIcon />}>
                 Exportar
               </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* 3. PANEL DE FILTROS */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #E5E7EB', borderRadius: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField 
            size="small" 
            placeholder="Buscar por nombre o código..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
            sx={{ flexGrow: 1, minWidth: '250px' }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Departamento</InputLabel>
            <Select value={filterDept} label="Departamento" onChange={(e) => setFilterDept(e.target.value)}>
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Ventas">Ventas</MenuItem>
              <MenuItem value="Atención">Atención</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select value={filterStatus} label="Estado" onChange={(e) => setFilterStatus(e.target.value)}>
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="pendiente">⏳ Pendientes</MenuItem>
              <MenuItem value="aprobado">✅ Aprobados</MenuItem>
              <MenuItem value="rechazado">❌ Rechazados</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* 4. TABLA MAESTRA DE APROBACIÓN */}
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox 
                    color="primary"
                    indeterminate={selectedIds.length > 0 && selectedIds.length < filteredBonuses.filter(b => b.estado === 'pendiente').length}
                    checked={filteredBonuses.length > 0 && selectedIds.length === filteredBonuses.filter(b => b.estado === 'pendiente').length}
                    onChange={handleSelectAll}
                    disabled={filterStatus !== 'pendiente' && filterStatus !== 'Todos'}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>EMPLEADO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>CONCEPTO (REGLA/META)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>EVIDENCIA</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>MONTO CALC.</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>ESTADO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#6B7280' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBonuses.map((row) => (
                <TableRow 
                  key={row.id} 
                  selected={selectedIds.includes(row.id)}
                  sx={{ 
                    bgcolor: row.estado === 'aprobado' ? '#F0FDF4' : row.estado === 'rechazado' ? '#FEF2F2' : 'inherit',
                    '&:hover': { bgcolor: '#F9FAFB' }
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox 
                      color="primary" 
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleToggleSelect(row.id)}
                      disabled={row.estado !== 'pendiente'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">{row.empleado}</Typography>
                      <Typography variant="caption" color="text.secondary">{row.depto}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.concepto}</Typography>
                    <Chip label={row.regla} size="small" sx={{ height: 20, fontSize: '0.65rem', mt: 0.5 }} />
                  </TableCell>
                  <TableCell>
                    <Button 
                      startIcon={<DescriptionIcon />} 
                      size="small" 
                      sx={{ textTransform: 'none', fontSize: '0.8rem' }}
                    >
                      {row.evidencia}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="bold">S/ {row.monto.toLocaleString()}</Typography>
                      {row.es_alto && (
                        <Tooltip title="Monto inusualmente alto (+50% del promedio)">
                          <WarningAmberIcon color="warning" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {row.estado === 'pendiente' && <Chip icon={<HourglassEmptyIcon />} label="Pendiente" size="small" color="warning" variant="outlined" sx={{ bgcolor: '#FFFBEB', border: 'none' }} />}
                    {row.estado === 'aprobado' && <Chip icon={<CheckCircleIcon />} label="Aprobado" size="small" color="success" sx={{ fontWeight: 'bold' }} />}
                    {row.estado === 'rechazado' && <Chip icon={<CloseIcon />} label="Rechazado" size="small" color="error" sx={{ fontWeight: 'bold' }} />}
                  </TableCell>
                  <TableCell align="center">
                    {row.estado === 'pendiente' ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Aprobar">
                          <IconButton size="small" color="success" onClick={() => handleApprove(row.id)} sx={{ border: '1px solid #86EFAC', bgcolor: '#F0FDF4' }}>
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rechazar">
                          <IconButton size="small" color="error" onClick={() => handleOpenRejectModal(row)} sx={{ border: '1px solid #FECACA', bgcolor: '#FEF2F2' }}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Tooltip title="Deshacer / Revisar">
                        <IconButton size="small" onClick={() => updateStatus(row.id, 'pendiente')}>
                          <UndoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredBonuses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    No se encontraron registros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* 6. FOOTER DE PAGINACIÓN SIMULADO */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5E7EB' }}>
             <Typography variant="body2" color="text.secondary">
               Mostrando 1-{filteredBonuses.length} de {filteredBonuses.length} bonos
             </Typography>
             <Box sx={{ display: 'flex', gap: 1 }}>
               <Button variant="outlined" size="small" disabled>Anterior</Button>
               <Button variant="outlined" size="small" sx={{ minWidth: 30, bgcolor: '#EFF6FF' }}>1</Button>
               <Button variant="outlined" size="small" sx={{ minWidth: 30 }}>2</Button>
               <Button variant="outlined" size="small">Siguiente</Button>
             </Box>
          </Box>
        </TableContainer>

      </Container>

      {/* 5. MODAL DE RECHAZO (INTERACTION FLOW) */}
      <Dialog open={rejectModalOpen} onClose={() => setRejectModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#FEF2F2', color: '#991B1B', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CloseIcon /> RECHAZAR BONO - {currentBonusToReject?.empleado}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Estás a punto de rechazar el bono de <strong>S/ {currentBonusToReject?.monto.toLocaleString()}</strong> generado por la regla "{currentBonusToReject?.concepto}".
          </Alert>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Motivo del rechazo (Obligatorio para auditoría):</Typography>
            <TextField 
              fullWidth 
              multiline 
              rows={3} 
              placeholder="Ej. Error en la carga de datos. El monto no coincide con ERP..." 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>¿Qué desea hacer con el registro?</Typography>
            <RadioGroup value={rejectAction} onChange={(e) => setRejectAction(e.target.value)}>
              <FormControlLabel value="rechazar" control={<Radio color="error" />} label="Marcar como RECHAZADO (No se paga)" />
              <FormControlLabel value="recalcular" control={<Radio color="primary" />} label="Solicitar Recálculo (Vuelve a estado borrador)" />
            </RadioGroup>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setRejectModalOpen(false)} sx={{ color: '#6B7280' }}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleConfirmReject}>
            Confirmar Rechazo
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AprobacionesBonos;