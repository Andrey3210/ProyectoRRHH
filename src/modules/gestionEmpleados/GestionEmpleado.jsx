import React, { useState, useEffect } from "react";
import { List, Grid } from "lucide-react";
import "./GestionEmpleado.css";
import EmpleadoModal from "./EmpleadoModal";
import { useGestionEmpleado } from "../../store/GestionEmpleadoContext";
import {useNavigate} from "react-router-dom";

export default function GestionEmpleados() {
    const navigate = useNavigate();
    const [vista, setVista] = useState("grid");
    const [busqueda, setBusqueda] = useState("");
    const [areaFiltro, setAreaFiltro] = useState("Todas las áreas");
    const [puestoFiltro, setPuestoFiltro] = useState("Todos los puestos");
    const [puestosPorArea, setPuestosPorArea] = useState([]);
    const [horarioFiltro, setHorarioFiltro] = useState("Todos los horarios");
    const [horariosDisponibles, setHorariosDisponibles] = useState(["Todos los horarios"]);
    const [modalOpen, setModalOpen] = useState(false);
    const { cargarEmpleados } = useGestionEmpleado();
    const { empleados, areas } = useGestionEmpleado();

    // Obtener puestos según área seleccionada
    useEffect(() => {
        if (areaFiltro !== "Todas las áreas") {
            const puestos = empleados
                .filter(e => (e.area || "Sin área") === areaFiltro)
                .map(e => e.nombrePuesto)
                .filter((v, i, a) => v && a.indexOf(v) === i); // únicos
            setPuestosPorArea(["Todos los puestos", ...puestos]);
            setPuestoFiltro("Todos los puestos");
        } else {
            setPuestosPorArea([]);
            setPuestoFiltro("Todos los puestos");
        }
    }, [areaFiltro, empleados]);

    // Actualizar lista de horarios según filtro de área
    useEffect(() => {
        const empleadosFiltradosPorArea = empleados.filter(e =>
            areaFiltro === "Todas las áreas" || (e.area || "Sin área") === areaFiltro
        );

        const horariosUnicos = [
            "Todos los horarios",
            ...Array.from(new Set(
                empleadosFiltradosPorArea.map(e => e.nombreHorario || "Sin horario")
            ))
        ];

        setHorariosDisponibles(horariosUnicos);

        // Reiniciar el filtro de horario si el valor actual ya no existe
        if (!horariosUnicos.includes(horarioFiltro)) {
            setHorarioFiltro("Todos los horarios");
        }
    }, [areaFiltro, empleados]);

    const empleadosFiltrados = empleados.filter((emp) => {
        const coincideBusqueda =
            emp.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
            emp.apellidoPaterno.toLowerCase().includes(busqueda.toLowerCase()) ||
            emp.apellidoMaterno.toLowerCase().includes(busqueda.toLowerCase()) ||
            emp.idEmpleado.toString().includes(busqueda);

        let areaEmpleado = emp.area || "Sin área";
        const coincideArea = areaFiltro === "Todas las áreas" || areaEmpleado === areaFiltro;

        const coincidePuesto =
            puestoFiltro === "Todos los puestos" || emp.nombrePuesto === puestoFiltro;

        const coincideHorario =
            horarioFiltro === "Todos los horarios" || (emp.nombreHorario || "Sin horario") === horarioFiltro;

        return coincideBusqueda && coincideArea && coincidePuesto && coincideHorario;
    });

    const handleEmpleadoCreado = (nuevoEmpleado) => {
        cargarEmpleados(); // recargar lista después de crear
    };

    return (
        <div className="gestion-empleados">
            <h1>Gestión de empleados</h1>

            <div className="barra-busqueda">
                <input
                    type="text"
                    placeholder="Buscar empleado"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button onClick={() => setModalOpen(true)}>+ Agregar</button>
            </div>

            <div className="filtros">
                <div className="filtros-area-puesto">
                    <select value={areaFiltro} onChange={(e) => setAreaFiltro(e.target.value)}>
                        {areas.map(area => <option key={area} value={area}>{area}</option>)}
                    </select>

                    {puestosPorArea.length > 0 && (
                        <select value={puestoFiltro} onChange={(e) => setPuestoFiltro(e.target.value)}>
                            {puestosPorArea.map(puesto => <option key={puesto} value={puesto}>{puesto}</option>)}
                        </select>
                    )}
                </div>

                <div className="filtro-horario-container">
                    <select
                        value={horarioFiltro}
                        onChange={(e) => setHorarioFiltro(e.target.value)}
                        className="filtro-horario"
                    >
                        {horariosDisponibles.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>

                {/* Horario a la izquierda de los botones de vista */}
                <div className="flex gap-2 items-center">
                    <div
                        className={`vista-boton lista ${vista === "lista" ? "activo" : ""}`}
                        onClick={() => setVista("lista")}
                    ><List /></div>
                    <div
                        className={`vista-boton grid ${vista === "grid" ? "activo" : ""}`}
                        onClick={() => setVista("grid")}
                    ><Grid /></div>
                </div>
            </div>

            {/* Vista Lista */}
            {vista === "lista" && (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Empleado</th>
                        <th>Área</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>DNI</th>
                        <th>Detalle</th>
                    </tr>
                    </thead>
                    <tbody>
                    {empleadosFiltrados.map(emp => (
                        <tr key={emp.idEmpleado}>
                            <td>{emp.idEmpleado}</td>
                            <td>{emp.nombres} {emp.apellidoPaterno}</td>
                            <td>{emp.area || "Sin área"}</td>
                            <td>{emp.email}</td>
                            <td>{emp.telefono}</td>
                            <td>{emp.documentoIdentidad}</td>
                            <td><button title="Detalle Empleado"
                                        onClick={() => navigate(`/empleado/${emp.idEmpleado}`)}>
                                👤</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Vista Grid */}
            {vista === "grid" && (
                <div className="grid-container">
                    {empleadosFiltrados.map(emp => (
                        <div key={emp.idEmpleado} className="grid-item">
                            <div className="avatar"></div>

                            <div className="grid-footer">
                                <div className="datos-empleado">
                                    <p className="id">ID {emp.idEmpleado}</p>
                                    <p className="nombre">{emp.nombres} {emp.apellidoPaterno}</p>
                                    <p className="area">{emp.area || "Sin área"}</p>
                                </div>
                                <div className="boton-detalle">
                                    <button title="Detalle Empleado"
                                            onClick={() => navigate(`/empleado/${emp.idEmpleado}`)}
                                    >👤</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <EmpleadoModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onEmpleadoCreado={handleEmpleadoCreado}
            />
        </div>
    );
}