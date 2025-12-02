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
  Switch,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  FormControl,
  InputLabel,
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CodeIcon from '@mui/icons-material/Code'; // Para decorar la condición lógica

// ==========================================
// 1. NAVBAR (Reutilizado para consistencia)
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
// 2. DATOS MOCK (Reglas)
// ==========================================
const mockRules = [
  { id: 101, nombre: 'Comisión Estándar', condicion: 'monto_venta > 5000', tipo: 'monetario', valor: '5%', periodo: 'Mensual', estado: true, categoria: 0 },
  { id: 102, nombre: 'Bono "Top Seller"', condicion: 'monto_venta > 20000', tipo: 'especie', valor: 'Viaje Cancún', periodo: 'Anual', estado: true, categoria: 0 },
  { id: 103, nombre: 'Incentivo Junior', condicion: 'monto_venta > 1000', tipo: 'monetario', valor: 'S/ 100', periodo: 'Mensual', estado: false, categoria: 0 },
  { id: 201, nombre: 'Calidad de Servicio', condicion: 'tickets_resueltos > 50', tipo: 'monetario', valor: 'S/ 300', periodo: 'Trimestral', estado: true, categoria: 1 },
  { id: 202, nombre: 'Cero Quejas', condicion: 'quejas == 0', tipo: 'especie', valor: 'Gift Card S/200', periodo: 'Mensual', estado: true, categoria: 1 },
];

// ==========================================
// 3. PANTALLA PRINCIPAL
// ==========================================
const ReglasIncentivos = () => {
  // Estado de Tabs: 0 = Ventas, 1 = Atención
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado del Formulario (Modal)
  const [bonusType, setBonusType] = useState('monetario'); // 'monetario' | 'especie'

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Filtrado de reglas según Tab y Buscador
  const filteredRules = mockRules.filter(rule => 
    rule.categoria === tabValue && 
    rule.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: '#F3F4F6', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
      <CssBaseline />
      <NavbarAdmin />

      <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: { xs: 2, md: 4 } }}>
        
        {/* HEADER: TÍTULO Y ACCIÓN PRINCIPAL */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="#111827">
              Configuración de Reglas de Negocio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Define las condiciones lógicas para el cálculo automático de bonos.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenModal}
            sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' }, textTransform: 'none', fontWeight: 'bold' }}
          >
            Crear Nueva Regla
          </Button>
        </Box>

        {/* SELECTOR DE CONTEXTO (TABS) */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="context tabs"
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontSize: '1rem', fontWeight: 'medium' } }}
          >
            <Tab label="🛍️ Reglas de VENTAS" />
            <Tab label="🎧 Reglas de ATENCIÓN AL CLIENTE" />
          </Tabs>
        </Box>

        {/* PANEL DE FILTROS */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #E5E7EB', borderRadius: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField 
            size="small" 
            placeholder="Buscar regla por nombre..." 
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
            }}
            sx={{ flexGrow: 1, minWidth: '250px' }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filtro Tipo de Bono</InputLabel>
            <Select label="Filtro Tipo de Bono" defaultValue="">
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="monetario">Monetarios</MenuItem>
              <MenuItem value="especie">Especie</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filtro Estado</InputLabel>
            <Select label="Filtro Estado" defaultValue="">
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="activa">Activas</MenuItem>
              <MenuItem value="inactiva">Inactivas</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* TABLA MAESTRA DE REGLAS */}
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="reglas table">
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>NOMBRE DE LA REGLA</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>CONDICIÓN LÓGICA</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>RECOMPENSA</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>PERIODO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#6B7280' }}>ESTADO</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#6B7280' }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRules.length > 0 ? (
                filteredRules.map((row) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>#{row.id}</TableCell>
                    <TableCell>{row.nombre}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={<CodeIcon sx={{ fontSize: '1rem !important' }} />} 
                        label={row.condicion} 
                        size="small" 
                        sx={{ bgcolor: '#F3F4F6', fontFamily: 'monospace', fontWeight: 'bold', color: '#374151', border: '1px solid #E5E7EB' }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {row.tipo === 'monetario' ? (
                          <MonetizationOnIcon sx={{ color: '#10B981' }} />
                        ) : (
                          <CardGiftcardIcon sx={{ color: '#8B5CF6' }} />
                        )}
                        <Typography variant="body2" fontWeight="medium">
                          {row.valor}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{row.periodo}</TableCell>
                    <TableCell>
                      <Switch checked={row.estado} size="small" color="primary" />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" sx={{ color: '#6B7280' }}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: '#EF4444' }}><DeleteOutlineIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">No hay reglas para mostrar en esta categoría.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Container>

      {/* ========================================== */}
      {/* 4. MODAL DE CREACIÓN (ABSTRACT FACTORY UI) */}
      {/* ========================================== */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #E5E7EB', bgcolor: tabValue === 0 ? '#EFF6FF' : '#F5F3FF' }}>
          <Typography variant="h6" fontWeight="bold" color={tabValue === 0 ? '#1E40AF' : '#5B21B6'}>
            Configurando Regla para: {tabValue === 0 ? 'VENTAS' : 'ATENCIÓN AL CLIENTE'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Esta regla se aplicará únicamente a empleados del departamento seleccionado.
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mt: 2 }}>
            
            {/* BLOQUE A: DATOS GENERALES */}
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
              Bloque A: Datos Generales
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={8}>
                <TextField fullWidth label="Nombre de la Regla" placeholder="Ej. Bono por Superación" size="small" />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Frecuencia</InputLabel>
                  <Select label="Frecuencia" defaultValue="mensual">
                    <MenuItem value="mensual">Mensual</MenuItem>
                    <MenuItem value="trimestral">Trimestral</MenuItem>
                    <MenuItem value="anual">Anual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Descripción (Para el empleado)" multiline rows={2} size="small" />
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* BLOQUE B: CONSTRUCTOR LÓGICO (Condition Builder) */}
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
              Bloque B: Constructor Lógico (IF)
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F9FAFB', mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>SI el empleado cumple:</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Campo</InputLabel>
                    <Select label="Campo" defaultValue="">
                      {/* LÓGICA DINÁMICA: Dropdown cambia según la Fábrica (Tab) */}
                      {tabValue === 0 ? (
                        <>
                          <MenuItem value="monto_venta">Monto Vendido (S/)</MenuItem>
                          <MenuItem value="cantidad_boletas">Cantidad Boletas</MenuItem>
                          <MenuItem value="venta_cruzada">Venta Cruzada</MenuItem>
                        </>
                      ) : (
                        <>
                          <MenuItem value="tickets_resueltos">Tickets Resueltos</MenuItem>
                          <MenuItem value="csat_score">Score CSAT (1-5)</MenuItem>
                          <MenuItem value="tiempo_respuesta">Tiempo Respuesta (min)</MenuItem>
                        </>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Operador</InputLabel>
                    <Select label="Operador" defaultValue=">">
                      <MenuItem value=">">Mayor que {'>'}</MenuItem>
                      <MenuItem value="=">Igual a =</MenuItem>
                      <MenuItem value="<">Menor que {'<'}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField fullWidth label="Valor Objetivo" placeholder="Ej. 5000" size="small" type="number" />
                </Grid>
              </Grid>
            </Paper>

            <Divider sx={{ mb: 3 }} />

            {/* BLOQUE C: DEFINIDOR DE BONO (Abstract Factory Bonos) */}
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
              Bloque C: Recompensa (THEN)
            </Typography>
            
            <Box sx={{ mb: 2 }}>
               <RadioGroup row value={bonusType} onChange={(e) => setBonusType(e.target.value)}>
                 <FormControlLabel 
                   value="monetario" 
                   control={<Radio />} 
                   label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><MonetizationOnIcon color="success" /> Dinero</Box>} 
                   sx={{ mr: 4 }}
                 />
                 <FormControlLabel 
                   value="especie" 
                   control={<Radio />} 
                   label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CardGiftcardIcon color="secondary" /> Especie / Regalo</Box>} 
                 />
               </RadioGroup>
            </Box>

            <Grid container spacing={2}>
              {bonusType === 'monetario' ? (
                // INPUTS PARA BONO MONETARIO
                <>
                  <Grid item xs={12} md={6}>
                     <TextField 
                       fullWidth 
                       label="Monto / Porcentaje" 
                       placeholder="Ej. 500" 
                       size="small"
                       InputProps={{
                         startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                       }} 
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Tipo de Cálculo</InputLabel>
                      <Select label="Tipo de Cálculo" defaultValue="fijo">
                        <MenuItem value="fijo">Monto Fijo</MenuItem>
                        <MenuItem value="porcentaje">Porcentaje del Sueldo</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                // INPUTS PARA BONO EN ESPECIE
                <>
                  <Grid item xs={12} md={8}>
                     <TextField fullWidth label="Nombre del Beneficio" placeholder="Ej. Cena para dos personas" size="small" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                     <TextField fullWidth label="Código Canje (Opcional)" placeholder="CUPON-2025" size="small" />
                  </Grid>
                </>
              )}
            </Grid>

          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseModal} sx={{ color: '#6B7280' }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleCloseModal} sx={{ bgcolor: tabValue === 0 ? '#2563EB' : '#7C3AED' }}>
            Guardar Regla
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default ReglasIncentivos;