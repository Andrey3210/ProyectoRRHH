import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Stack,
  Container
} from "@mui/material";

import InfoIcon from "@mui/icons-material/Info";
import GroupsIcon from "@mui/icons-material/Groups";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import './MenuInicio.css'

const MenuInicio = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%)',
      py: 5
    }}>
      <Container maxWidth="xl">
        {/* Encabezado principal */}
        <Box sx={{ 
          mb: 5,
          textAlign: 'center',
          animation: 'fadeIn 0.6s ease-in'
        }}>
          <Typography 
            variant="h3" 
            fontWeight="800"
            sx={{
              background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Bienvenido(a) al Portal RRHH – ConectaTel
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            Tu espacio como colaborador de nuestra empresa de telefonía. 
            Aquí encontrarás información clave sobre la organización y recursos para tu día a día.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* QUIÉNES SOMOS */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '2px solid #e5e7eb',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 28px rgba(126, 200, 86, 0.2)',
                  borderColor: '#7ec856'
                }
              }}
            >
              <CardHeader
                avatar={
                  <Box sx={{
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #7ec856 0%, #16a34a 100%)',
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(126, 200, 86, 0.3)'
                  }}>
                    <PhoneIphoneIcon sx={{ color: 'white', fontSize: 32 }} />
                  </Box>
                }
                title={
                  <Typography variant="h5" fontWeight="700" color="#1f2937">
                    ¿Quiénes somos?
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Nuestra identidad como empresa de telefonía
                  </Typography>
                }
                sx={{ pb: 2 }}
              />
              <CardContent>
                <Typography variant="body1" paragraph sx={{ color: '#374151', lineHeight: 1.7 }}>
                  En <strong style={{ color: '#1f2937' }}>ConectaTel</strong> nos dedicamos a brindar soluciones integrales
                  de telefonía y conectividad, acercando a las personas y empresas
                  a lo que más importa: estar siempre comunicados.
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: '#374151', lineHeight: 1.7 }}>
                  Nuestro propósito es ofrecer un servicio confiable, accesible y humano,
                  apoyándonos en la innovación tecnológica y en el compromiso de nuestros
                  colaboradores.
                </Typography>
                
                <Divider sx={{ my: 3, borderColor: '#e5e7eb' }} />
                
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  fontWeight="700"
                  sx={{ 
                    color: '#1f2937',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  Nuestros pilares:
                </Typography>
                
                <List dense>
                  <ListItem 
                    sx={{ 
                      mb: 1.5,
                      background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#7ec856',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #7ec856 0%, #16a34a 100%)',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(126, 200, 86, 0.3)'
                      }}>
                        <InfoIcon sx={{ fontSize: 18, color: 'white' }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Calidad en el servicio al cliente"
                      primaryTypographyProps={{
                        fontWeight: 600,
                        color: '#1f2937'
                      }}
                    />
                  </ListItem>
                  
                  <ListItem 
                    sx={{ 
                      mb: 1.5,
                      background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#7ec856',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #7ec856 0%, #16a34a 100%)',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(126, 200, 86, 0.3)'
                      }}>
                        <GroupsIcon sx={{ fontSize: 18, color: 'white' }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Trabajo en equipo y respeto"
                      primaryTypographyProps={{
                        fontWeight: 600,
                        color: '#1f2937'
                      }}
                    />
                  </ListItem>
                  
                  <ListItem 
                    sx={{ 
                      background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#7ec856',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #7ec856 0%, #16a34a 100%)',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(126, 200, 86, 0.3)'
                      }}>
                        <PhoneIphoneIcon sx={{ fontSize: 18, color: 'white' }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary="Innovación en telefonía y conectividad"
                      primaryTypographyProps={{
                        fontWeight: 600,
                        color: '#1f2937'
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* INFORMACIÓN PARA EL EMPLEADO */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '2px solid #e5e7eb',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 28px rgba(126, 200, 86, 0.2)',
                  borderColor: '#7ec856'
                }
              }}
            >
              <CardHeader
                avatar={
                  <Box sx={{
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(31, 41, 55, 0.3)'
                  }}>
                    <GroupsIcon sx={{ color: 'white', fontSize: 32 }} />
                  </Box>
                }
                title={
                  <Typography variant="h5" fontWeight="700" color="#1f2937">
                    Información para el colaborador
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Recursos y accesos rápidos
                  </Typography>
                }
                sx={{ pb: 2 }}
              />
              <CardContent>
                <Typography variant="body1" paragraph sx={{ color: '#374151', lineHeight: 1.7 }}>
                  Aquí encontrarás accesos a los módulos internos relacionados a tu
                  experiencia como colaborador: procesos de selección, incentivos,
                  vacaciones y más.
                </Typography>

                <List dense>
                  <ListItem 
                    sx={{ 
                      mb: 2,
                      background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      p: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#7ec856',
                        transform: 'translateX(4px)',
                        boxShadow: '0 4px 12px rgba(126, 200, 86, 0.1)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                      }}>
                        <AssignmentIndIcon sx={{ fontSize: 20, color: 'white' }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary="Reclutamiento y selección"
                      secondary="Visualiza posiciones abiertas y seguimiento a procesos de selección."
                      primaryTypographyProps={{
                        fontWeight: 700,
                        color: '#1f2937',
                        fontSize: '15px'
                      }}
                      secondaryTypographyProps={{
                        color: '#6b7280',
                        fontSize: '13px',
                        mt: 0.5
                      }}
                    />
                  </ListItem>
                  
                  <ListItem 
                    sx={{ 
                      mb: 2,
                      background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      p: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#7ec856',
                        transform: 'translateX(4px)',
                        boxShadow: '0 4px 12px rgba(126, 200, 86, 0.1)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                      }}>
                        <EmojiEventsIcon sx={{ fontSize: 20, color: 'white' }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary="Incentivos y reconocimientos"
                      secondary="Consulta tus bonos, metas y resultados del programa de incentivos."
                      primaryTypographyProps={{
                        fontWeight: 700,
                        color: '#1f2937',
                        fontSize: '15px'
                      }}
                      secondaryTypographyProps={{
                        color: '#6b7280',
                        fontSize: '13px',
                        mt: 0.5
                      }}
                    />
                  </ListItem>
                  
                  <ListItem 
                    sx={{ 
                      background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      p: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#7ec856',
                        transform: 'translateX(4px)',
                        boxShadow: '0 4px 12px rgba(126, 200, 86, 0.1)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                      }}>
                        <EventAvailableIcon sx={{ fontSize: 20, color: 'white' }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary="Vacaciones y permisos"
                      secondary="Revisa y gestiona tus solicitudes de vacaciones y permisos."
                      primaryTypographyProps={{
                        fontWeight: 700,
                        color: '#1f2937',
                        fontSize: '15px'
                      }}
                      secondaryTypographyProps={{
                        color: '#6b7280',
                        fontSize: '13px',
                        mt: 0.5
                      }}
                    />
                  </ListItem>
                </List>

                <Divider sx={{ my: 3, borderColor: '#e5e7eb' }} />

                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  fontWeight="700"
                  sx={{ 
                    color: '#1f2937',
                    mb: 2
                  }}
                >
                  Accesos rápidos:
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  <Button
                    variant="contained"
                    size="large"
                    href="/posiciones"
                    sx={{
                      background: 'linear-gradient(135deg, #7ec856 0%, #16a34a 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '14px',
                      px: 3,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(126, 200, 86, 0.3)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(126, 200, 86, 0.4)'
                      }
                    }}
                  >
                    Ver posiciones abiertas
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    href="/incentivos-reconocimientos"
                    sx={{
                      border: '2px solid #7ec856',
                      color: '#16a34a',
                      fontWeight: 700,
                      fontSize: '14px',
                      px: 3,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      transition: 'all 0.3s',
                      '&:hover': {
                        border: '2px solid #16a34a',
                        background: '#16a34a',
                        color: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(126, 200, 86, 0.3)'
                      }
                    }}
                  >
                    Incentivos y bonos
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    href="/vacaciones-permisos"
                    sx={{
                      border: '2px solid #7ec856',
                      color: '#16a34a',
                      fontWeight: 700,
                      fontSize: '14px',
                      px: 3,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      transition: 'all 0.3s',
                      '&:hover': {
                        border: '2px solid #16a34a',
                        background: '#16a34a',
                        color: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(126, 200, 86, 0.3)'
                      }
                    }}
                  >
                    Vacaciones y permisos
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default MenuInicio;