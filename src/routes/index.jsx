import React from 'react'
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Login from '../pages/Login'
import MenuInicio from '../pages/MenuInicio'
import PosicionesAbiertas from '../modules/reclutamiento/PosicionesAbiertas'
import ListaCandidatos from '../modules/reclutamiento/ListaCandidatos'
import DetalleCandidato from '../modules/reclutamiento/DetalleCandidato'
import FormularioPuesto from '../modules/reclutamiento/FormularioPuesto'
import Pipeline from '../modules/reclutamiento/Pipeline'
import RecepcionCV from '../modules/recepcion/RecepcionCV'
import DetalleCV from '../modules/recepcion/DetalleCV'
import GestionEntrevistas from '../modules/reclutamiento/GestionEntrevistas'
import GestionEvaluaciones from '../modules/reclutamiento/GestionEvaluaciones'
import GestionOfertas from '../modules/reclutamiento/GestionOfertas'
import GestionContrataciones from '../modules/reclutamiento/GestionContrataciones'
import EstadisticasRechazados from '../modules/reclutamiento/EstadisticasRechazados'
import DashboardIncentivos from '../modules/incentivos/DashboardIncentivos'  
import ReglasIncentivos from '../modules/incentivos/admin/ReglasIncentivos' 
import MetasPeriodo from '../modules/incentivos/admin/metasPeriodo'
import AprobacionesBonos from '../modules/incentivos/admin/AprobacionesBonos'
import ReportesIncentivos from '../modules/incentivos/admin/ReportesIncentivos'
import IncentivosRouter from '../modules/incentivos/IncentivosRouter'
import DashboardEmpleado from '../modules/incentivos/empleado/DashboardEmpleado'
import DetallePagosEmpleado from '../modules/incentivos/empleado/DetallePagosEmpleado'
import AsistenciaDashboard from '../modules/asistencia/AsistenciaDashboard'
import EmployeeTimelinePage from '../modules/asistencia/EmployeeTimelinePage'
import ReportesAsistenciaPage from '../modules/asistencia/ReportesAsistenciaPage'
import VistaAdministrador from '../modules/vacaciones/VistaAdministrador'
import VistaEmpleado from '../modules/vacaciones/VistaEmpleado'
import DetalleSolicitudAdmin from '../modules/vacaciones/DetalleSolicitudAdmin'
import RegistrarSolicitudAdmin from '../modules/vacaciones/RegistrarSolicitudAdmin'
import GestionEmpleado from "../modules/gestionEmpleados/GestionEmpleado";
import { GestionEmpleadoProvider } from "../store/GestionEmpleadoContext";
import EmpleadoDetalle from "../modules/gestionEmpleados/EmpleadoDetalle";

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/posiciones" replace />} />
      
      {/* Módulos pendientes de implementación */}
      <Route
        path="/inicio"
        element={
          <ProtectedRoute>
            <MenuInicio />
          </ProtectedRoute>
        }
      />
      <Route
        path="/control-asistencia"
        element={
          <ProtectedRoute>
            <AsistenciaDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/control-asistenciaLineaTiempo"
        element={
          <ProtectedRoute>
            <EmployeeTimelinePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/control-asistenciaReporte"
        element={
          <ProtectedRoute>
            <ReportesAsistenciaPage />
          </ProtectedRoute>
        }
      />

      <Route
       path="/incentivos-reconocimientos"
      element={
      <ProtectedRoute>  
        <IncentivosRouter />  
      </ProtectedRoute>  
       }  
      >  
         <Route path="admin/dashboard" element={<DashboardIncentivos />} />  
         <Route path="admin/reglas" element={<ReglasIncentivos />} />  
         <Route path="admin/metas" element={<MetasPeriodo />} />  
         <Route path="admin/aprobaciones" element={<AprobacionesBonos />} />  
         <Route path="admin/reportes" element={<ReportesIncentivos />} />  
    
         <Route path="empleado/dashboard" element={<DashboardEmpleado />} />  
         <Route path="empleado/pagos" element={<DetallePagosEmpleado />} />
      </Route>
      <Route 
        path="/vacaciones-permisos" 
        element={
          <ProtectedRoute>
            <VistaAdministrador />
          </ProtectedRoute>
        } 
      />
      {/* Ruta para el detalle */}
      <Route 
        path="/vacaciones/solicitud/:id" 
        element={
          <ProtectedRoute>
            <DetalleSolicitudAdmin />
          </ProtectedRoute>
        } 
      />

      {/* Ruta para crear solicitud */}
      <Route 
        path="/vacaciones/nueva" 
        element={
          <ProtectedRoute>
            <RegistrarSolicitudAdmin />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/vacaciones/mis-solicitudes" 
        element={
          <ProtectedRoute>
            <VistaEmpleado />
          </ProtectedRoute>
        } 
      />
      {/* Gestion de vacaciones y permisos======================= */}
      <Route 
        path="/gestion-empleados" 
        element={
          <ProtectedRoute>
              <GestionEmpleado />
          </ProtectedRoute>
        } 
      />

    <Route path="/empleado/:id"
           element={
           <ProtectedRoute>
               <EmpleadoDetalle />
           </ProtectedRoute>
        }
    />

      {/* Módulo de Reclutamiento y Selección */}
      <Route 
        path="/posiciones" 
        element={
          <ProtectedRoute>
            <PosicionesAbiertas />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/candidatos" 
        element={
          <ProtectedRoute>
            <ListaCandidatos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/candidatos/:id" 
        element={
          <ProtectedRoute>
            <DetalleCandidato />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/puesto/nuevo" 
        element={
          <ProtectedRoute>
            <FormularioPuesto />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/puesto/editar/:id" 
        element={
          <ProtectedRoute>
            <FormularioPuesto />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/pipeline" 
        element={
          <ProtectedRoute>
            <Pipeline />
          </ProtectedRoute>
        } 
      />
      <Route
        path="/recepcion-cv"
        element={
          <ProtectedRoute>
            <RecepcionCV />
          </ProtectedRoute>
        }
      />
      <Route
        path="/postulantes/:id/cv"
        element={
          <ProtectedRoute>
            <DetalleCV />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/entrevistas" 
        element={
          <ProtectedRoute>
            <GestionEntrevistas />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/evaluaciones" 
        element={
          <ProtectedRoute>
            <GestionEvaluaciones />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ofertas" 
        element={
          <ProtectedRoute>
            <GestionOfertas />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/contrataciones" 
        element={
          <ProtectedRoute>
            <GestionContrataciones />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/rechazados" 
        element={
          <ProtectedRoute>
            <EstadisticasRechazados />
          </ProtectedRoute>
        } 
      />
      
    </RouterRoutes>
  )
}

export default Routes

