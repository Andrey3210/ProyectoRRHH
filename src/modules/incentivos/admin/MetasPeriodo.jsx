import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
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
  LinearProgress,
  Divider,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  CssBaseline
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
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import BoltIcon from '@mui/icons-material/Bolt';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LockIcon from '@mui/icons-material/Lock';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

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
          <Button startIcon={<SettingsIcon />} endIcon={<KeyboardArrowDownIcon />} onClick={handleOpenConfig} sx={getButtonStyle('/configuracion')}>
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
const initialEmployees = [
  { id: 1, nombre: 'Juan Pérez', rol: 'Ejecutivo Sr.', meta: 50000, actual: 25000, avatar: '#1976d2', depto: 0 },
  { id: 2, nombre: 'Ana Gómez', rol: 'Junior', meta: 20000, actual: 22000, avatar: '#2e7d32', depto: 0 },
  { id: 3, nombre: 'Luis Torres', rol: 'Trainee', meta: 0, actual: 0, avatar: '#ed6c02', depto: 0 }, // Sin asignar
  { id: 4, nombre: 'Carlos Ruiz', rol: 'Soporte L1', meta: 100, actual: 80, avatar: '#9c27b0', depto: 1 }, // Atención (Tickets)
  { id: 5, nombre: 'Maria L.', rol: 'Soporte L2', meta: 80, actual: 40, avatar: '#d32f2f', depto: 1 },
];

const periodTargetGlobal = 1500000; // Meta global hardcodeada para el ejemplo

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
const MetasPeriodo = () => {
  const [tabValue, setTabValue] = useState(0); // 0 = Ventas, 1 = Atención
  const [employees, setEmployees] = useState(initialEmployees);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para el formulario del modal
  const [newTargetValue, setNewTargetValue] = useState('');

  // Cálculos en tiempo real
  const currentCategoryEmps = employees.filter(e => e.depto === tabValue);
  const totalAssigned = currentCategoryEmps.reduce((acc, curr) => acc + curr.meta, 0);
  const pendingToAssign = Math.max(0, periodTargetGlobal - totalAssigned);
  
  // Cálculo de avance global (promedio simple para el ejemplo)
  const totalReal = currentCategoryEmps.reduce((acc, curr) => acc + curr.actual, 0);
  const globalProgress = totalAssigned > 0 ? (totalReal / totalAssigned) * 100 : 0;

  const handleOpenModal = (emp) => {
    setSelectedEmp(emp);
    setNewTargetValue(emp.meta > 0 ? emp.meta : '');
    setOpenModal(true);
  };

  const handleSaveMeta = () => {
    if (selectedEmp) {
      const updatedList = employees.map(e => 
        e.id === selectedEmp.id ? { ...e, meta: Number(newTargetValue) } : e
      );
      setEmployees(updatedList);
      setOpenModal(false);
    }
  };

  const filteredList = currentCategoryEmps.filter(e => 
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: '#F3F4F6', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
      <CssBaseline />
      <NavbarAdmin />

      <Container maxWidth={false} sx={{ mt: 3, mb: 4, px: { xs: 2, md: 4 } }}>

        {/* 2. BARRA DE CONTEXTO TEMPORAL */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 1.5, 
            mb: 3, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: '#edeef5ff', // Fondo oscuro para diferenciar contexto
            color: 'white',
            borderRadius: 2
          }}
        >
          <Box sx={{ width: 100 }} /> {/* Spacer */}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton size="small" sx={{ color:  'black' }}><ArrowBackIosNewIcon fontSize="small" /></IconButton>
            <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 1 }}>
              DICIEMBRE 2025
            </Typography>
            <IconButton size="small" sx={{ color: 'black' }}><ArrowForwardIosIcon fontSize="small" /></IconButton>
          </Box>

          <Chip 
            icon={<TrendingUpIcon sx={{ color: '#10B981 !important' }} />} 
            label="ABIERTO" 
            sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10B981', fontWeight: 'bold', border: '1px solid #10B981' }} 
          />
        </Paper>

        {/* 3. SELECTOR DE CONTEXTO (TABS) */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="🎯 Metas de VENTAS" />
            <Tab label="🏆 Metas de ATENCIÓN" />
          </Tabs>
        </Box>

        {/* 4. TARJETAS DE RESUMEN GLOBAL */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Tarjeta 1: Meta Maestra */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB', borderRadius: 2, height: '100%', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  META GLOBAL DE {tabValue === 0 ? 'VENTAS' : 'ATENCIÓN'} (MENSUAL)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
                  <Typography variant="h3" fontWeight="bold" color="primary.main">
                    {tabValue === 0 ? `S/ ${periodTargetGlobal.toLocaleString()}` : '5,000 Tickets'}
                  </Typography>
                  <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                </Box>
                
                {tabValue === 0 && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Suma automática asignada: <strong>S/ {totalAssigned.toLocaleString()}</strong>
                    </Typography>
                    {pendingToAssign > 0 ? (
                      <Chip label={`Faltan S/ ${pendingToAssign.toLocaleString()}`} size="small" color="warning" variant="outlined" />
                    ) : (
                      <Chip label="Completo" size="small" color="success" />
                    )}
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Tarjeta 2: Progreso Real */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB', borderRadius: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  AVANCE ACTUAL (EQUIPO)
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={globalProgress >= 100 ? 'success.main' : 'text.primary'}>
                  {globalProgress.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(globalProgress, 100)} 
                sx={{ height: 12, borderRadius: 5, bgcolor: '#F3F4F6', '& .MuiLinearProgress-bar': { bgcolor: tabValue === 0 ? '#2563EB' : '#7C3AED' } }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Basado en el desempeño real al día 15 del mes.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* 5. TABLA DE ASIGNACIÓN DE METAS */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField 
            size="small" 
            placeholder="Buscar empleado..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ bgcolor: 'white', width: 300 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'white' }}>
              <Select defaultValue="todos" displayEmpty>
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="sin_meta">Sin Meta</MenuItem>
                <MenuItem value="cumplida">Meta Cumplida</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<BoltIcon />} sx={{ bgcolor: '#F59E0B', '&:hover': { bgcolor: '#D97706' } }}>
              Asignación Masiva
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>EMPLEADO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>ROL / CARGO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>META DEL PERIODO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>AVANCE ACTUAL</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>ESTADO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#6B7280' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredList.map((row) => {
                const progress = row.meta > 0 ? (row.actual / row.meta) * 100 : 0;
                const isUnassigned = row.meta === 0;

                return (
                  <TableRow key={row.id} sx={{ bgcolor: isUnassigned ? '#FEF2F2' : 'inherit' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: row.avatar, width: 32, height: 32, fontSize: '0.875rem' }}>{row.nombre.charAt(0)}</Avatar>
                        <Typography variant="body2" fontWeight="medium">{row.nombre}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.rol}</TableCell>
                    <TableCell>
                      {isUnassigned ? (
                        <Typography variant="body2" color="error" fontWeight="bold">--</Typography>
                      ) : (
                        <Typography variant="body2" fontWeight="bold">
                          {tabValue === 0 ? `S/ ${row.meta.toLocaleString()}` : `${row.meta} Tkt`}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ width: 250 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {tabValue === 0 ? `S/ ${row.actual.toLocaleString()}` : `${row.actual}`}
                        </Typography>
                        <Typography variant="caption" fontWeight="bold" color={progress >= 100 ? 'success.main' : 'text.primary'}>
                          {progress.toFixed(0)}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(progress, 100)} 
                        color={progress >= 100 ? "success" : "primary"}
                        sx={{ height: 6, borderRadius: 5, bgcolor: '#E5E7EB' }}
                      />
                    </TableCell>
                    <TableCell>
                      {isUnassigned ? (
                         <Chip label="Sin Asignar" size="small" color="error" variant="outlined" icon={<LockIcon />} />
                      ) : progress >= 100 ? (
                         <Chip label="Cumplida" size="small" color="success" sx={{ fontWeight: 'bold' }} />
                      ) : (
                         <Chip label="En Curso" size="small" color="warning" sx={{ bgcolor: '#FFFBEB', color: '#B45309' }} />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {isUnassigned ? (
                        <Button size="small" startIcon={<AddIcon />} onClick={() => handleOpenModal(row)}>Asignar</Button>
                      ) : (
                        <>
                          <IconButton size="small" color="primary" onClick={() => handleOpenModal(row)}><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small" sx={{ color: '#6B7280' }}><VisibilityIcon fontSize="small" /></IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">No se encontraron empleados.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Container>

      {/* 6. MODAL DE ASIGNACIÓN/EDICIÓN */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #E5E7EB', bgcolor: '#F9FAFB' }}>
          <Typography variant="subtitle1" color="text.secondary">Asignando Meta para:</Typography>
          <Typography variant="h6" fontWeight="bold">{selectedEmp?.nombre} ({tabValue === 0 ? 'Ventas' : 'Atención'})</Typography>
          <Typography variant="caption" color="primary">Periodo: Diciembre 2025</Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <FormControl fullWidth>
              <InputLabel>Tipo de Meta (KPI)</InputLabel>
              <Select 
                label="Tipo de Meta (KPI)" 
                defaultValue={tabValue === 0 ? "volumen" : "tickets"}
                disabled // Deshabilitado para forzar la integridad del Factory
              >
                {tabValue === 0 ? (
                  <MenuItem value="volumen">Volumen de Ventas (Dinero)</MenuItem>
                ) : (
                  <MenuItem value="tickets">Resolución de Tickets (Cantidad)</MenuItem>
                )}
              </Select>
            </FormControl>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>VALOR OBJETIVO</Typography>
              <TextField 
                fullWidth 
                placeholder="0.00" 
                value={newTargetValue}
                onChange={(e) => setNewTargetValue(e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: tabValue === 0 ? <InputAdornment position="start"><Typography variant="h5" color="text.secondary">S/</Typography></InputAdornment> : null,
                  style: { fontSize: '1.5rem', fontWeight: 'bold' }
                }}
              />
            </Box>

            <Accordion elevation={0} sx={{ border: '1px solid #E5E7EB', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" fontWeight="medium">Configuración Avanzada</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField label="Fecha Inicio" type="date" fullWidth size="small" defaultValue="2025-12-01" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField label="Fecha Fin" type="date" fullWidth size="small" defaultValue="2025-12-31" />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Incentivo Asociado (Opcional)</InputLabel>
                      <Select label="Incentivo Asociado (Opcional)" defaultValue="">
                         <MenuItem value="">-- Ninguno --</MenuItem>
                         <MenuItem value="101">Regla #101: Bono Trimestral</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: '#6B7280' }}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveMeta} sx={{ bgcolor: '#2563EB' }}>Guardar Meta</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default MetasPeriodo;