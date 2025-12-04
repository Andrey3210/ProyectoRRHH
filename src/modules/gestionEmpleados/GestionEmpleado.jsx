import React, { useState, useEffect } from "react";
import { List, Grid } from "lucide-react";
import "./GestionEmpleados.css";

export default function GestionEmpleados() {
    const [vista, setVista] = useState("grid"); // Vista inicial en Grid
    const [busqueda, setBusqueda] = useState("");
    const [areaFiltro, setAreaFiltro] = useState("Todos");
    const [empleados, setEmpleados] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => { cargarEmpleados(); }, []);

    const cargarEmpleados = async () => {
        try {
            const [respTodos, respConPuesto] = await Promise.all([
                fetch("http://localhost:8080/api/gempleados"),
                fetch("http://localhost:8080/api/gempleados/con-puesto")
            ]);

            const empleadosTodos = await respTodos.json();
            const empleadosConPuesto = await respConPuesto.json();

            const mapa = new Map();
            empleadosTodos.forEach(e => mapa.set(e.idEmpleado, { ...e, area: "" }));
            empleadosConPuesto.forEach(e => {
                if (mapa.has(e.idEmpleado)) {
                    mapa.set(e.idEmpleado, { ...mapa.get(e.idEmpleado), ...e });
                }
            });

            const combinados = Array.from(mapa.values());
            setEmpleados(combinados);

            const distinctAreas = [...new Set(combinados.map((e) => e.area || ""))];
            setAreas(["Todos", ...distinctAreas.map(a => a === "" || a == null ? "Sin área" : a)]);
        } catch (error) {
            console.error("Error cargando empleados", error);
        }
    };

    const empleadosFiltrados = empleados.filter((emp) => {
        const coincideBusqueda =
            emp.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
            emp.apellidoPaterno.toLowerCase().includes(busqueda.toLowerCase()) ||
            emp.apellidoMaterno.toLowerCase().includes(busqueda.toLowerCase()) ||
            emp.idEmpleado.toString().includes(busqueda);

        let areaEmpleado = emp.area;
        if (!areaEmpleado) areaEmpleado = "Sin área";

        const coincideArea = areaFiltro === "Todos" || areaEmpleado === areaFiltro;

        return coincideBusqueda && coincideArea;
    });

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
                <button>+ Agregar</button>
            </div>

            <div className="filtros">
                <select value={areaFiltro} onChange={(e) => setAreaFiltro(e.target.value)}>
                    {areas.map((area) => <option key={area} value={area}>{area}</option>)}
                </select>

                <div className="flex gap-2">
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
                        <th>Más info</th>
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
                            <td><button>👤</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {vista === "grid" && (
                <div className="grid-container">
                    {empleadosFiltrados.map(emp => (
                        <div key={emp.idEmpleado} className="grid-item">
                            {/* Foto centrada */}
                            <div className="avatar"></div>

                            {/* Datos agrupados izquierda debajo de la foto */}
                            <div className="datos-empleado">
                                <p className="id">{emp.idEmpleado}</p>
                                <p className="nombre">{emp.nombres} {emp.apellidoPaterno}</p>
                                <p className="area">{emp.area || "Sin área"}</p>
                            </div>

                            {/* Botón detalle a la derecha */}
                            <div className="boton-detalle">
                                <button title="Detalle Empleado">👤</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
