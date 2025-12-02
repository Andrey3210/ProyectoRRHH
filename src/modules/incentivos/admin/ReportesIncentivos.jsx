import React, { useState } from 'react';
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
  Grid,
  FormControl,
  InputLabel,
  CssBaseline,
  CircularProgress,
  Tooltip,
  Card,
  CardContent
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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView'; // Icono Excel
import DownloadIcon from '@mui/icons-material/Download';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

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
// Datos para el gráfico de barras (Financiero)
const chartData2025 = [
  { month: 'Ene', sales: 35000, support: 15000 },
  { month: 'Feb', sales: 38000, support: 16000 },
  { month: 'Mar', sales: 42000, support: 18000 },
  { month: 'Abr', sales: 40000, support: 17000 },
  { month: 'May', sales: 45000, support: 19000 },
  { month: 'Jun', sales: 48000, support: 20000 },
  { month: 'Jul', sales: 46000, support: 19500 },
  { month: 'Ago', sales: 49000, support: 21000 },
  { month: 'Sep', sales: 52000, support: 22000 },
  { month: 'Oct', sales: 55000, support: 23000 },
  { month: 'Nov', sales: 45280, support: 18000 }, // Actual
];

// Datos para la tabla de detalle (Financiero)
const financialReports = [
  { id: 1, periodo: 'Nov 2025', concepto: 'Nómina Incentivos', beneficiarios: 87, monto: 63280.00, estado: 'pendiente' },
  { id: 2, periodo: 'Oct 2025', concepto: 'Nómina Incentivos', beneficiarios: 85, monto: 78000.00, estado: 'pagado' },
  { id: 3, periodo: 'Sep 2025', concepto: 'Nómina Incentivos', beneficiarios: 82, monto: 74000.00, estado: 'pagado' },
  { id: 4, periodo: 'Anual 2025', concepto: 'Consolidado YTD', beneficiarios: 145, monto: 680500.00, estado: 'informativo' },
];

// Datos para Auditoría
const auditLogs = [
  { id: 1, fecha: '01/12/2025 14:30:05', usuario: 'Andrés G. (Admin)', accion: 'APROBAR_BONO', detalle: 'Aprobó bono #8821 de Juan Pérez (S/ 1200)', tipo: 'success' },
  { id: 2, fecha: '01/12/2025 14:15:22', usuario: 'Sistema', accion: 'SYNC_API_ERROR', detalle: 'Timeout al conectar con ERP SAP', tipo: 'error' },
  { id: 3, fecha: '01/12/2025 10:00:00', usuario: 'Maria R. (Admin)', accion: 'CREAR_REGLA', detalle: 'Creó Regla #105 "Navidad"', tipo: 'info' },
  { id: 4, fecha: '30/11/2025 18:45:10', usuario: 'Andrés G. (Admin)', accion: 'RECHAZAR_BONO', detalle: 'Rechazó bono #8819. Motivo: Evidencia ilegible', tipo: 'warning' },
  { id: 5, fecha: '30/11/2025 09:00:00', usuario: 'Sistema', accion: 'CALCULO_MASIVO', detalle: 'Inició proceso de cálculo Noviembre 2025', tipo: 'info' },
];

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
const ReportesIncentivos = () => {
  const [tabValue, setTabValue] = useState(0); // 0: Financiero, 1: Rendimiento, 2: Auditoría
  const [isExporting, setIsExporting] = useState({ pdf: false, excel: false });
  const [filterDept, setFilterDept] = useState('Todos');

  const handleExport = (type) => {
    setIsExporting(prev => ({ ...prev, [type]: true }));
    // Simular retardo de red
    setTimeout(() => {
      setIsExporting(prev => ({ ...prev, [type]: false }));
      // Aquí iría la lógica real de descarga
    }, 2000);
  };

  const getMaxHeight = () => {
    const maxVal = Math.max(...chartData2025.map(d => d.sales + d.support));
    return maxVal;
  };
  const maxVal = getMaxHeight();

  // Renderizado Condicional del Panel Principal
  const renderMainContent = () => {
    if (tabValue === 2) {
      // --- VISTA AUDITORÍA ---
      return (
        <Box>
          <Paper elevation={0} sx={{ p: 0, border: '1px solid #E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon color="primary" /> LOG DE AUDITORÍA Y SEGURIDAD
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField 
                  size="small" 
                  placeholder="Buscar por usuario..." 
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
                  sx={{ bgcolor: 'white' }}
                />
                <Button variant="outlined" startIcon={<CalendarMonthIcon />} size="small" sx={{ bgcolor: 'white' }}>
                  Últimos 30 días
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F3F4F6' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>FECHA/HORA</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>USUARIO (ADMIN)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ACCIÓN</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>DETALLE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{log.fecha}</TableCell>
                      <TableCell>{log.usuario}</TableCell>
                      <TableCell>
                        <Chip 
                          label={log.accion} 
                          size="small" 
                          color={log.tipo === 'error' ? 'error' : log.tipo === 'warning' ? 'warning' : log.tipo === 'success' ? 'success' : 'default'} 
                          variant="outlined"
                          sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{log.detalle}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ p: 1.5, borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'center' }}>
              <Button size="small">Ver historial completo</Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    // --- VISTA FINANCIERA / RENDIMIENTO (Default) ---
    return (
      <Grid container spacing={3}>
        {/* GRÁFICO DE TENDENCIA */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #E5E7EB', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon color="action" /> TENDENCIA DE GASTO EN INCENTIVOS (2025)
            </Typography>
            <Box sx={{ mt: 4, height: 300, display: 'flex', alignItems: 'flex-end', gap: 2, px: 2 }}>
              {/* Eje Y (Simplificado) */}
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', pb: 3, mr: 1 }}>
                <Typography variant="caption" color="text.secondary">S/ 80k</Typography>
                <Typography variant="caption" color="text.secondary">S/ 40k</Typography>
                <Typography variant="caption" color="text.secondary">S/ 0</Typography>
              </Box>
              
              {/* Barras */}
              {chartData2025.map((data, index) => {
                const heightSales = (data.sales / maxVal) * 100;
                const heightSupport = (data.support / maxVal) * 100;
                return (
                  <Box key={index} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                    <Tooltip title={`Ventas: S/ ${data.sales.toLocaleString()} | Atención: S/ ${data.support.toLocaleString()}`}>
                      <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column-reverse', height: '100%', cursor: 'pointer', transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }}>
                        {/* Segmento Ventas (Azul) */}
                        <Box sx={{ height: `${heightSales}%`, bgcolor: '#2563EB', width: '100%', borderRadius: '2px 2px 0 0' }} />
                        {/* Segmento Soporte (Verde) */}
                        <Box sx={{ height: `${heightSupport}%`, bgcolor: '#10B981', width: '100%' }} />
                      </Box>
                    </Tooltip>
                    <Typography variant="caption" sx={{ mt: 1, fontWeight: 'bold', color: 'text.secondary' }}>{data.month}</Typography>
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#2563EB', borderRadius: '50%' }} />
                <Typography variant="caption">Ventas</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#10B981', borderRadius: '50%' }} />
                <Typography variant="caption">Atención</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* TABLA DE DETALLE (Export Preview) */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <Typography variant="subtitle1" fontWeight="bold">Tabla de Detalle (Vista Previa de Exportación)</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>PERIODO</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>CONCEPTO DE PAGO</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }} align="center">N° BENEFICIARIOS</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }} align="right">MONTO TOTAL</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>ESTADO PAGO</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }} align="center">ACCIONES</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {financialReports.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell fontWeight="medium">{row.periodo}</TableCell>
                      <TableCell>{row.concepto}</TableCell>
                      <TableCell align="center">{row.beneficiarios} Empleados</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>S/ {row.monto.toLocaleString()}</TableCell>
                      <TableCell>
                        {row.estado === 'pendiente' && <Chip label="Pendiente" size="small" color="warning" sx={{ bgcolor: '#FFFBEB', color: '#B45309' }} />}
                        {row.estado === 'pagado' && <Chip label="Pagado" size="small" color="primary" sx={{ bgcolor: '#EFF6FF', color: '#1E40AF' }} />}
                        {row.estado === 'informativo' && <Typography variant="caption" color="text.secondary">--</Typography>}
                      </TableCell>
                      <TableCell align="center">
                        <Button variant="outlined" size="small" startIcon={<DownloadIcon />} sx={{ textTransform: 'none' }}>
                          Descargar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ bgcolor: '#F3F4F6', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
      <CssBaseline />
      <NavbarAdmin />

      <Container maxWidth={false} sx={{ mt: 3, mb: 4, px: { xs: 2, md: 4 } }}>
        
        {/* 2. SELECTOR DE TIPO DE REPORTE (Navegación Secundaria) */}
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            sx={{ 
              '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 'bold', fontSize: '1rem', minHeight: 48 }
            }}
          >
            <Tab 
              icon={<AttachMoneyIcon />} 
              iconPosition="start" 
              label="Financiero / Nómina" 
            />
            <Tab 
              icon={<AssessmentIcon />} 
              iconPosition="start" 
              label="Rendimiento / KPIs" 
            />
            <Tab 
              icon={<SecurityIcon />} 
              iconPosition="start" 
              label="Auditoría del Sistema" 
            />
          </Tabs>
          <Box sx={{ borderBottom: '1px solid #E5E7EB', mt: -0.1 }} />
        </Box>

        {/* 3. BARRA DE FILTROS DE GENERACIÓN (Solo visible si no es Auditoría, o adaptada) */}
        {tabValue !== 2 && (
          <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #E5E7EB', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #D1D5DB', borderRadius: 1, px: 1, py: 0.5, bgcolor: '#F9FAFB' }}>
                <Typography variant="body2" fontWeight="bold" color="text.secondary" sx={{ mr: 1 }}>Periodo:</Typography>
                <Typography variant="body2" fontWeight="medium">[ Ene 2025 ] ➔ [ Dic 2025 ]</Typography>
                <IconButton size="small"><FilterAltIcon fontSize="small" /></IconButton>
              </Box>
              
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} displayEmpty>
                  <MenuItem value="Todos">Todos los Departamentos</MenuItem>
                  <MenuItem value="Ventas">Ventas</MenuItem>
                  <MenuItem value="Atención">Atención</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={isExporting.pdf ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdfIcon />}
                disabled={isExporting.pdf}
                onClick={() => handleExport('pdf')}
                sx={{ bgcolor: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626', '&:hover': { bgcolor: '#FEE2E2', borderColor: '#FCA5A5' } }}
              >
                {isExporting.pdf ? 'Generando...' : 'PDF'}
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                startIcon={isExporting.excel ? <CircularProgress size={20} color="inherit" /> : <TableViewIcon />}
                disabled={isExporting.excel}
                onClick={() => handleExport('excel')}
                sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
              >
                {isExporting.excel ? 'Procesando...' : 'Excel'}
              </Button>
            </Box>
          </Paper>
        )}

        {/* 4. y 5. PANEL DE VISUALIZACIÓN */}
        {renderMainContent()}

      </Container>
    </Box>
  );
};

export default ReportesIncentivos;