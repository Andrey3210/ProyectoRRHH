import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import apiClient from '../../services/api/client'
import './DetalleCV.css'

const DetalleCV = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { postulante, nombrePuesto, area } = location.state || {}

  const [tabActiva, setTabActiva] = useState('info')
  const [detallePostulante, setDetallePostulante] = useState(postulante)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [errorCarga, setErrorCarga] = useState('')
  const [cvUrl, setCvUrl] = useState('')
  const [cargandoCV, setCargandoCV] = useState(false)
  const [errorCV, setErrorCV] = useState('')

  const formatFecha = fecha => {
    if (!fecha) return ''
    const date = new Date(fecha)
    return isNaN(date) ? fecha : date.toLocaleDateString()
  }

  useEffect(() => {
    if (!id) return

    const cargarDetalle = async () => {
      setCargandoDetalle(true)
      setErrorCarga('')
      try {
        const data = await apiClient.get(`/rrhh/postulantes/${id}`)
        setDetallePostulante(data)
      } catch (err) {
        console.error('Error cargando postulante:', err)
        setErrorCarga('No se pudo cargar la información del postulante.')
      } finally {
        setCargandoDetalle(false)
      }
    }

    cargarDetalle()
  }, [id])

  useEffect(() => {
    if (!id) return

    let cancelado = false
    let objectUrl = ''

    const cargarPDF = async () => {
      setCargandoCV(true)
      setErrorCV('')
      setCvUrl('')

      try {
        const response = await fetch(`${apiClient.baseURL}/candidatos/${id}/cv/archivo`, {
          headers: apiClient.getHeaders({ Accept: 'application/pdf' })
        })

        if (!response.ok) {
          throw new Error('No se pudo obtener el archivo del CV.')
        }

        const blob = await response.blob()
        if (cancelado) return

        objectUrl = URL.createObjectURL(blob)
        setCvUrl(objectUrl)
      } catch (err) {
        if (!cancelado) {
          console.error('Error cargando CV en PDF:', err)
          setErrorCV('No se pudo cargar el CV en PDF.')
        }
      } finally {
        if (!cancelado) {
          setCargandoCV(false)
        }
      }
    }

    cargarPDF()

    return () => {
      cancelado = true
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [id])

  const obtenerPeriodo = (inicio, fin) => {
    const inicioFmt = formatFecha(inicio)
    const finFmt = fin ? formatFecha(fin) : 'Actualidad'
    if (inicioFmt && finFmt) return `${inicioFmt} - ${finFmt}`
    return inicioFmt || finFmt || ''
  }

  const obtenerMeses = (inicio, fin) => {
    if (!inicio) return null

    const fechaInicio = new Date(inicio)
    const fechaFin = fin ? new Date(fin) : new Date()

    if (isNaN(fechaInicio) || isNaN(fechaFin)) return null

    let meses = (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12
    meses += fechaFin.getMonth() - fechaInicio.getMonth()

    if (fechaFin.getDate() < fechaInicio.getDate()) {
      meses -= 1
    }

    return Math.max(meses, 0)
  }

  const obtenerEdad = fechaNacimiento => {
    if (!fechaNacimiento) return null
    const fecha = new Date(fechaNacimiento)
    if (isNaN(fecha)) return null

    const hoy = new Date()
    let edad = hoy.getFullYear() - fecha.getFullYear()
    const mes = hoy.getMonth() - fecha.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--
    }
    return edad
  }

  if (cargandoDetalle) {
    return (
      <div className="cv-full-view d-flex flex-column justify-content-center align-items-center">
        <p className="fs-4">Cargando información del postulante...</p>
      </div>
    )
  }

  if (!detallePostulante || errorCarga) {
    return (
      <div className="cv-full-view d-flex flex-column justify-content-center align-items-center">
        <p className="fs-4 text-danger">{errorCarga || 'No se encontró información del postulante.'}</p>
        <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    )
  }

  const nombreCompleto = `${detallePostulante.nombres} ${detallePostulante.apellidoPaterno}${
    detallePostulante.apellidoMaterno ? ` ${detallePostulante.apellidoMaterno}` : ''
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
          <h5 className="mt-4 mb-2"><strong>Información personal</strong></h5>
          <br />
          {tabActiva === 'info' && (
            <>
              <div className="row mb-3">
                <br />
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Email</strong>
                    <span className="ms-2">{detallePostulante.email || ''}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Sexo</strong>
                    <span className="ms-2">{detallePostulante.genero || ''}</span>
                  </p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Teléfono</strong>
                    <span className="ms-2">{detallePostulante.telefono || ''}</span>
                  </p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Edad</strong>
                    <span className="ms-2">
                      {detallePostulante.edad
                        ? `${detallePostulante.edad} años`
                        : obtenerEdad(detallePostulante.fechaNacimiento)
                          ? `${obtenerEdad(detallePostulante.fechaNacimiento)} años`
                          : ''}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Estado civil</strong>
                    <span className="ms-2">{detallePostulante.estadoCivil || ''}</span>
                  </p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Fecha de nacimiento</strong>
                    <span className="ms-2">{detallePostulante.fechaNacimiento || ''}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Dirección</strong>
                    <span className="ms-2">{detallePostulante.direccion || ''}</span>
                  </p>
                </div>
              </div>

              <hr className="my-3" />
              <h5 className="mt-4 mb-2">
                <strong>Formación académica</strong>
              </h5>
              <br />

              {Array.isArray(detallePostulante.formacionesAcademicas) &&
              detallePostulante.formacionesAcademicas.length > 0 ? (
                detallePostulante.formacionesAcademicas.map((formacion, idx) => (
                  <div key={formacion.idFormacion || idx} className="mb-3">
                    <br />
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Nivel de estudios</strong>
                          <span className="ms-2">{formacion.nivelEstudios || ''}</span>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Situación</strong>
                          <span className="ms-2">{formacion.situacion || ''}</span>
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Carrera</strong>
                          <span className="ms-2">{formacion.carrera || ''}</span>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Institución</strong>
                          <span className="ms-2">{formacion.institucion || ''}</span>
                        </p>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Periodo</strong>
                          <span className="ms-2">{obtenerPeriodo(formacion.fechaInicio, formacion.fechaFin)}</span>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong>Cursos / diplomados relevantes</strong>
                          <span className="ms-2">{formacion.cursosRelevantes || ''}</span>
                        </p>
                      </div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-12">
                        <p className="mb-1">
                          <strong>Observaciones</strong>
                          <span className="ms-2">{formacion.observaciones || ''}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">Sin formación académica registrada.</p>
              )}

              <hr className="my-3" />
              <h5 className="mt-4 mb-2">
                <strong>Experiencia</strong>
              </h5>
              <br />

              {Array.isArray(detallePostulante.experiencias) && detallePostulante.experiencias.length > 0 ? (
                detallePostulante.experiencias.map((exp, idx) => {
                  const meses = obtenerMeses(exp.fechaInicio, exp.fechaFin)
                  return (
                    <div key={exp.idExperiencia || idx} className="experiencia-item mb-3">
                      <br />
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Empresa</strong>
                            <span className="ms-2">{exp.empresa || ''}</span>
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Funciones principales</strong>
                            <span className="ms-2">{exp.funcionesPrincipales || ''}</span>
                          </p>
                        </div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Cargo</strong>
                            <span className="ms-2">{exp.cargo || ''}</span>
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1">
                            <strong>Periodo</strong>
                            <span className="ms-2">
                              {obtenerPeriodo(exp.fechaInicio, exp.fechaFin)}
                              {meses !== null && <span className="ms-2 text-muted">({meses} meses)</span>}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-muted">Sin experiencias registradas.</p>
              )}
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
            {cargandoCV && <div className="cv-pdf-placeholder">Cargando CV en PDF...</div>}
            {!cargandoCV && errorCV && <div className="cv-pdf-placeholder text-danger">{errorCV}</div>}
            {!cargandoCV && !errorCV && cvUrl && (
              <iframe title="CV del postulante" src={cvUrl} className="cv-pdf-frame" />
            )}
            {!cargandoCV && !errorCV && !cvUrl && (
              <div className="cv-pdf-placeholder">No hay CV disponible.</div>
            )}
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
