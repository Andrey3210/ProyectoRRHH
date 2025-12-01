import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import apiClient from '../../services/api/client'
import './RecepcionCV.css'
import searchIcon from './assets/search.svg'
import cvIcon from './assets/curriculum.svg'

const RecepcionCV = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [areas, setAreas] = useState([])
  const [puestos, setPuestos] = useState([])
  const [areaActiva, setAreaActiva] = useState('')
  const [puestoActivo, setPuestoActivo] = useState(null)
  const [postulantes, setPostulantes] = useState([])
  const [loading, setLoading] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [filtroGenero, setFiltroGenero] = useState('')

  useEffect(() => {
    const cargarPuestos = async () => {
      try {
        const data = await apiClient.get('/rrhh/puestos')
        setPuestos(data)
        const uniqueAreas = [...new Set(data.map(p => p.area))]
        setAreas(uniqueAreas)
        
        // Si viene del state, restaurar la posición
        if (location.state?.area && location.state?.idPuesto) {
          setAreaActiva(location.state.area)
          const puestoRestaurado = data.find(p => p.idPuesto === location.state.idPuesto)
          if (puestoRestaurado) {
            setPuestoActivo(puestoRestaurado)
          }
          // Limpiar el state para que no interfiera con futuras selecciones
          window.history.replaceState({}, document.title)
        } else if (uniqueAreas.length > 0) {
          setAreaActiva(uniqueAreas[0])
        }
      } catch (err) {
        console.error('Error cargando puestos:', err)
      }
    }

    cargarPuestos()
  }, [])

  useEffect(() => {
    if (!areaActiva) return
    
    const pArea = puestos.filter(p => p.area === areaActiva)
    if (pArea.length > 0 && !puestoActivo) {
      setPuestoActivo(pArea[0])
    }
  }, [areaActiva, puestos])

  useEffect(() => {
    if (!puestoActivo) return

    const cargarPostulantes = async () => {
      setLoading(true)
      try {
        const data = await apiClient.get(
          `/rrhh/postulantes-proceso/puesto/${puestoActivo.idPuesto}/revision-cv`
        )
        setPostulantes(data)
      } catch (err) {
        console.error('Error cargando postulantes:', err)
      } finally {
        setLoading(false)
      }
    }

    cargarPostulantes()
  }, [puestoActivo])

  const puestosDeAreaActiva = useMemo(
    () => puestos.filter(p => p.area === areaActiva),
    [puestos, areaActiva]
  )

  const generosDisponibles = useMemo(() => {
    const generos = new Set(postulantes.map(p => p.genero).filter(Boolean))
    return Array.from(generos)
  }, [postulantes])

  const postulantesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return postulantes.filter(p => {
      const coincideTexto = termino
        ? `${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno || ''} ${p.email}`
            .toLowerCase()
            .includes(termino)
        : true
      const coincideGenero = filtroGenero ? p.genero === filtroGenero : true
      return coincideTexto && coincideGenero
    })
  }, [postulantes, busqueda, filtroGenero])

  const handleBuscar = event => {
    event.preventDefault()
    setBusqueda(busqueda.trim())
  }

  return (
    <div className="rcv-page">
      <div className="rcv-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2>Recepción de CVs</h2>
            <p className="text-muted">{areaActiva && puestoActivo ? `${areaActiva} > ${puestoActivo.nombrePuesto}` : 'No se puede determinar el puesto'}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <form className="rcv-search" onSubmit={handleBuscar}>
              <span className="input-group-text">
                <img src={searchIcon} alt="buscar" style={{ width: 20, height: 20 }} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar postulante"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              <button className="btn btn-success" type="submit">
                Buscar
              </button>
            </form>

            <select
              className="form-select"
              style={{ minWidth: '180px', borderRadius: '6px', border: '1px solid #d1d5db', padding: '8px 12px', fontSize: '14px', background: 'white' }}
              value={filtroGenero}
              onChange={e => setFiltroGenero(e.target.value)}
            >
              <option value="">Todos los géneros</option>
              {generosDisponibles.map(genero => (
                <option key={genero} value={genero}>
                  {genero}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rcv-navbars">
        <ul className="rcv-tabs">
          {areas.map(area => (
            <li key={area}>
              <button
                className={'nav-link ' + (areaActiva === area ? 'active' : '')}
                onClick={() => setAreaActiva(area)}
              >
                {area}
              </button>
            </li>
          ))}
        </ul>

        <ul className="rcv-subtabs">
          {puestosDeAreaActiva.map(puesto => (
            <li key={puesto.idPuesto}>
              <button
                className={'nav-link ' + (puestoActivo?.idPuesto === puesto.idPuesto ? 'active' : '')}
                onClick={() => setPuestoActivo(puesto)}
              >
                {puesto.nombrePuesto}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rcv-table-wrapper">
        <div className="rcv-table-scroll">
          {loading ? (
            <div className="text-center p-5 fw-bold">Cargando postulantes...</div>
          ) : postulantesFiltrados.length === 0 ? (
            <div className="text-center p-5 fw-bold text-danger">
              No hay postulantes en revisión para este puesto
            </div>
          ) : (
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-success text-center sticky-thead">
                <tr>
                  <th>ID postulante</th>
                  <th>Nombre completo</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Edad</th>
                  <th>Género</th>
                  <th>CV</th>
                </tr>
              </thead>
              <tbody>
                {postulantesFiltrados.map(p => (
                  <tr key={p.idPostulante}>
                    <td className="text-center">{p.idPostulante}</td>
                    <td>{`${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno || ''}`}</td>
                    <td>{p.telefono}</td>
                    <td>{p.email}</td>
                    <td className="text-center">{p.edad ?? '-'}</td>
                    <td>{p.genero}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-success btn-sm rounded-pill px-3"
                        onClick={() =>
                          navigate(`/postulantes/${p.idPostulante}/cv`, {
                            state: { 
                              postulante: p, 
                              nombrePuesto: puestoActivo?.nombrePuesto,
                              area: areaActiva,
                              idPuesto: puestoActivo?.idPuesto
                            }
                          })
                        }
                      >
                        <img src={cvIcon} alt="CV" style={{ width: 24, height: 24 }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecepcionCV