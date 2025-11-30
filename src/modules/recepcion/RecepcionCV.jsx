import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/api/client'
import './RecepcionCV.css'
import searchIcon from './assets/search.svg'
import cvIcon from './assets/curriculum.svg'

const RecepcionCV = () => {
  const [areas, setAreas] = useState([])
  const [puestos, setPuestos] = useState([])
  const [areaActiva, setAreaActiva] = useState('')
  const [puestoActivo, setPuestoActivo] = useState(null)
  const [postulantes, setPostulantes] = useState([])
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const cargarPuestos = async () => {
      try {
        const data = await apiClient.get('/rrhh/puestos')
        setPuestos(data)
        const uniqueAreas = [...new Set(data.map(p => p.area))]
        setAreas(uniqueAreas)
        if (uniqueAreas.length > 0) setAreaActiva(uniqueAreas[0])
      } catch (err) {
        console.error('Error cargando puestos:', err)
      }
    }

    cargarPuestos()
  }, [])

  useEffect(() => {
    if (!areaActiva) return
    const pArea = puestos.filter(p => p.area === areaActiva)
    if (pArea.length > 0) setPuestoActivo(pArea[0])
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

  return (
    <div className="rcv-page">
      <div className="rcv-header">
        <h2 className="fw-bold mb-0">Recepción de CVs</h2>

        <div className="rcv-search input-group shadow-sm">
          <span className="input-group-text bg-white">
            <img src={searchIcon} alt="buscar" style={{ width: 24, height: 24 }} />
          </span>
          <input type="text" className="form-control" placeholder="Buscar postulante o puesto" />
        </div>
      </div>

      <ul className="nav nav-tabs rcv-tabs border-0 mb-2">
        {areas.map(area => (
          <li className="nav-item" key={area}>
            <button
              className={"nav-link " + (areaActiva === area ? 'active' : '')}
              onClick={() => setAreaActiva(area)}
            >
              {area}
            </button>
          </li>
        ))}
      </ul>

      <ul className="nav nav-pills rcv-subtabs mb-3">
        {puestosDeAreaActiva.map(puesto => (
          <li className="nav-item" key={puesto.idPuesto}>
            <button
              className={
                'nav-link ' + (puestoActivo?.idPuesto === puesto.idPuesto ? 'active' : '')
              }
              onClick={() => setPuestoActivo(puesto)}
            >
              {puesto.nombrePuesto}
            </button>
          </li>
        ))}
      </ul>

      <div className="rcv-table-wrapper">
        <div className="rcv-table-scroll">
          {loading ? (
            <div className="text-center p-5 fw-bold">Cargando postulantes...</div>
          ) : postulantes.length === 0 ? (
            <div className="text-center p-5 fw-bold text-danger">
              No hay postulantes en revisión para este puesto
            </div>
          ) : (
            <table className="table table-striped table-bordered align-middle w-100">
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
                {postulantes.map(p => (
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
                            state: { postulante: p, nombrePuesto: puestoActivo?.nombrePuesto }
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
