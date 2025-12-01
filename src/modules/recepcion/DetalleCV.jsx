import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './DetalleCV.css'

const DetalleCV = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { postulante, nombrePuesto, area } = location.state || {}

  const [tabActiva, setTabActiva] = useState('info')

  if (!postulante) {
    return (
      <div className="cv-full-view d-flex flex-column justify-content-center align-items-center">
        <p className="fs-4 text-danger">No se encontró información del postulante.</p>
        <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    )
  }

  const nombreCompleto = `${postulante.nombres} ${postulante.apellidoPaterno}${
    postulante.apellidoMaterno ? ` ${postulante.apellidoMaterno}` : ''
  }`.trim()

  return (
    <div className="cv-full-view">
      <div className="cv-header">
        <div>
          <h2 className="fw-bold mb-0">Recepción de CVs</h2>
          <p className="text-muted mb-0">
            {area && nombrePuesto ? `${area} > ${nombrePuesto}` : 'No se pudo determinar el puesto'}
          </p>
          <div className="cv-tabs">
            <button
              className={tabActiva === 'info' ? 'cv-tab-btn cv-tab-active' : 'cv-tab-btn'}
              onClick={() => setTabActiva('info')}
            >
              Información personal
            </button>
            <span className="mx-2 text-muted">|</span>
            <button
              className={tabActiva === 'skills' ? 'cv-tab-btn cv-tab-active' : 'cv-tab-btn'}
              onClick={() => setTabActiva('skills')}
            >
              Habilidades
            </button>
          </div>
        </div>

        <button className="btn btn-dark" onClick={() => navigate(-1)}>
          VOLVER
        </button>
      </div>

      <div className="cv-body">
        <div className="cv-info-card">
          <h4 className="fw-bold mb-4">
            {nombreCompleto}{nombrePuesto ? ` - ${nombrePuesto}` : ''}
          </h4>
          <br />
          {tabActiva === 'info' && (
            <>
              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Email</strong>
                    <span className="ms-2">{postulante.email || ''}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Sexo</strong>
                    <span className="ms-2">{postulante.genero || ''}</span>
                  </p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Teléfono</strong>
                    <span className="ms-2">{postulante.telefono || ''}</span>
                  </p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Edad</strong>
                    <span className="ms-2">{postulante.edad ? `${postulante.edad} años` : ''}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Estado civil</strong>
                    <span className="ms-2">{postulante.estadoCivil || ''}</span>
                  </p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Fecha de nacimiento</strong>
                    <span className="ms-2">{postulante.fechaNacimiento || ''}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Dirección</strong>
                    <span className="ms-2">{postulante.direccion || ''}</span>
                  </p>
                </div>
              </div>

              <hr className="my-3" />

              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Nivel de estudios</strong>
                    <span className="ms-2">{postulante.nivelEstudios || ''}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Situación</strong>
                    <span className="ms-2">{postulante.situacionAcademica || ''}</span>
                  </p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Carrera</strong>
                    <span className="ms-2">{postulante.carrera || ''}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Fechas</strong>
                    <span className="ms-2">{postulante.periodoCarrera || ''}</span>
                  </p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-12">
                  <p className="mb-1">
                    <strong>Institución</strong>
                    <span className="ms-2">{postulante.institucion || ''}</span>
                  </p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-12">
                  <p className="mb-1">
                    <strong>Cursos / diplomados relevantes</strong>
                    <span className="ms-2">{postulante.cursosRelevantes || ''}</span>
                  </p>
                </div>
              </div>

              <hr className="my-3" />

              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Empresa</strong>
                    <span className="ms-2"></span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Funciones principales</strong>
                    <span className="ms-2"></span>
                  </p>
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Cargo</strong>
                    <span className="ms-2"></span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Periodo</strong>
                    <span className="ms-2"></span>
                  </p>
                </div>
              </div>
            </>
          )}

          {tabActiva === 'skills' && (
            <div>
              <h5 className="fw-bold mb-3">Habilidades del postulante</h5>
              <p className="text-muted">
                Aquí podrás mostrar habilidades técnicas, blandas, resultados de pruebas, etc.
              </p>
            </div>
          )}
        </div>

        <div className="cv-preview-card">
          <div className="cv-pdf-box">
            <div className="cv-pdf-placeholder">Visor PDF pendiente</div>
          </div>

          <button className="btn btn-success w-100 rounded-pill fw-semibold">
            Aprobar y continuar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DetalleCV