import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EmpleadoDetalle.css"; // Separa el CSS para estilos
import { useGestionEmpleado } from "../../store/GestionEmpleadoContext";

export default function EmpleadoDetalle() {
    const { id } = useParams();
    const { cargarEmpleados } = useGestionEmpleado();
    const navigate = useNavigate();
    const [empleado, setEmpleado] = useState(null);
    const [cargando, setCargando] = useState(true);

    const [modalHorarioVisible, setModalHorarioVisible] = useState(false);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    // --------------------
    // ESTADOS DEL MODAL
    // --------------------
    const [modalPuestoVisible, setModalPuestoVisible] = useState(false);

    // Formularios
    const [areaSeleccionada, setAreaSeleccionada] = useState("");
    const [puestoSeleccionado, setPuestoSeleccionado] = useState("");
    const [salario, setSalario] = useState("");

    // Listas de áreas y puestos (pueden venir de tu API)
    const [areas, setAreas] = useState([]);
    const [puestos, setPuestos] = useState([]);
    const [puestosFiltrados, setPuestosFiltrados] = useState([]);

    const [fechaInicio, setFechaInicio] = useState(""); // opcional
    const [motivoCambio, setMotivoCambio] = useState(""); // opcional

    // --------------------
    // FUNCIONES DEL MODAL
    // --------------------

    // Filtrar puestos según el área seleccionada
    const handleAreaChange = (e) => {
        const area = e.target.value;
        setAreaSeleccionada(area);
        setPuestosFiltrados(puestos.filter(p => p.area === area));
        setPuestoSeleccionado("");
    };

    // Función para asignar puesto
    const handleAsignarPuesto = async (e) => {
        e.preventDefault();

        if (!puestoSeleccionado) {
            alert("Debe seleccionar un puesto");
            return;
        }

        try {
            const requestBody = {
                idEmpleado: empleado.idEmpleado,
                idPuesto: parseInt(puestoSeleccionado),
                salario: salario ? parseFloat(salario) : undefined,
                fechaInicio: fechaInicio || undefined,
                motivoCambio: motivoCambio || undefined
            };

            const url = empleado.nombrePuesto === "Sin Asignar"
                ? "http://localhost:8080/api/gempleados/asignarPuesto"
                : "http://localhost:8080/api/gempleados/actualizarPuesto";

            await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            setModalPuestoVisible(false);
            cargarEmpleado(); // recarga la información del empleado
            cargarEmpleados();
        } catch (error) {
            console.error("Error asignando puesto", error);
        }
    };

    const handleAsignarHorario = async (e) => {
        e.preventDefault();
        if (!horarioSeleccionado) {
            alert("Debe seleccionar un horario");
            return;
        }

        try {
            const url = empleado.nombreHorario === "Sin horario"
                ? "http://localhost:8080/api/gempleados/asignarHorario"
                : "http://localhost:8080/api/gempleados/actualizarHorario";

            await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idEmpleado: empleado.idEmpleado,
                    idHorario: parseInt(horarioSeleccionado)
                })
            });

            setModalHorarioVisible(false);
            cargarEmpleado();       // Actualiza detalle
            cargarEmpleados();      // Actualiza lista en pantalla principal
        } catch (error) {
            console.error("Error asignando horario", error);
        }
    };

    const cargarEmpleado = async () => {
        setCargando(true);
        try {
            // Obtener datos del empleado
            const respEmpleado = await fetch(`http://localhost:8080/api/gempleados/${id}`);
            if (!respEmpleado.ok) throw new Error("Empleado no encontrado");
            const dataEmpleado = await respEmpleado.json();

            // Intentar obtener puesto actual
            const respPuesto = await fetch(`http://localhost:8080/api/gempleados/${id}/puesto-actual`);
            let dataPuesto = null;

            if (respPuesto.ok) {
                const text = await respPuesto.text();
                dataPuesto = text ? JSON.parse(text) : null;
            }

            // Obtener info de horario
            const respHorario = await fetch(`http://localhost:8080/api/gempleados/con-horario`);
            const dataHorarios = await respHorario.json();
            const empleadoHorario = dataHorarios.find(e => e.idEmpleado === parseInt(id));

            // Combinar datos
            setEmpleado({
                ...dataEmpleado,
                // Solo añadir datos de puesto si existen
                nombrePuesto: dataPuesto ? dataPuesto.nombrePuesto : "Sin Asignar",
                departamento: dataPuesto ? dataPuesto.departamento : "Sin Asignar",
                area: dataPuesto ? dataPuesto.area : null,
                nivelJerarquico: dataPuesto ? dataPuesto.nivelJerarquico : "Sin Asignar",
                salarioAsignado: dataPuesto ? dataPuesto.salarioAsignado : "Sin Asignar",
                fechaInicioPuesto: dataPuesto ? dataPuesto.fechaInicioPuesto : "Sin Asignar",
                fechaFinPuesto: dataPuesto ? dataPuesto.fechaFinPuesto : "Sin Asignar",
                // Datos de horario
                nombreHorario: empleadoHorario ? empleadoHorario.nombreHorario : "Sin horario",
                horaEntrada: empleadoHorario ? empleadoHorario.horaEntrada : null,
                horaSalida: empleadoHorario ? empleadoHorario.horaSalida : null,
                diasSemana: empleadoHorario ? empleadoHorario.diasSemana : null,
            });

        } catch (error) {
            console.error("Error al cargar empleado", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarEmpleado();
    }, [id]);

    useEffect(() => {
        const cargarPuestos = async () => {
            try {
                const resp = await fetch("http://localhost:8080/api/gempleados/puestos");
                if (!resp.ok) throw new Error("Error al cargar puestos");
                const data = await resp.json();
                setPuestos(data);
                const areasUnicas = [...new Set(data.map(p => p.area))];
                setAreas(areasUnicas);
            } catch (error) {
                console.error(error);
            }
        };
        cargarPuestos();
    }, []);

    useEffect(() => {
        const cargarHorarios = async () => {
            try {
                const resp = await fetch("http://localhost:8080/api/gempleados/horarios");
                if (!resp.ok) throw new Error("Error al cargar horarios");
                const data = await resp.json();
                // Filtrar solo horarios activos
                setHorariosDisponibles(data.filter(h => h.activo));
            } catch (error) {
                console.error(error);
            }
        };
        cargarHorarios();
    }, []);

    if (cargando) return <p>Cargando información del empleado...</p>;
    if (!empleado) return <p>Empleado no encontrado</p>;


    return (
        <div className="empleado-detalle">

            <button onClick={() => navigate(-1)} className="volver-btn">Volver</button>

            <div className="detalle-header">
                <h2>Detalle de empleado</h2>
                <div className="botones-accion">
                    <button onClick={() => setModalPuestoVisible(true)}>
                        {empleado.nombrePuesto === "Sin Asignar" ? "Asignar Puesto" : "Actualizar Puesto"}
                    </button>
                    <button onClick={() => setModalHorarioVisible(true)}>
                        {empleado.nombreHorario === "Sin horario" ? "Asignar Horario" : "Actualizar Horario"}
                    </button>
                </div>
            </div>

            <div className="detalle-grid">
                {/* Sección izquierda */}
                <div className="detalle-izquierda">
                    <div className="avatar">
                        {/* Placeholder para la foto */}
                    </div>
                    <div className="card">
                        <strong>Nombre completo</strong>
                        <p>{empleado.nombres} {empleado.apellidoPaterno} {empleado.apellidoMaterno}</p>
                    </div>
                    <div className="card">
                        <strong>ID {empleado.idEmpleado}</strong>
                    </div>
                    <div className="card">
                        <strong>Código</strong>
                        <p>{empleado.codigoEmpleado}</p>
                    </div>
                </div>

                {/* Sección derecha */}
                <div className="detalle-derecha">
                    {/* Información básica */}
                    <h3>Información básica</h3>
                    <div className="info-grid">
                        <div className="card">
                            <strong>DNI</strong>
                            <p>{empleado.documentoIdentidad}</p>
                        </div>
                        <div className="card">
                            <strong>Email</strong>
                            <p>{empleado.email}</p>
                        </div>
                        <div className="card">
                            <strong>Teléfono</strong>
                            <p>{empleado.telefono}</p>
                        </div>
                        <div className="card">
                            <strong>Fecha de nacimiento</strong>
                            <p>{empleado.fechaNacimiento}</p>
                        </div>
                        <div className="card">
                            <strong>Género</strong>
                            <p>{empleado.genero}</p>
                        </div>
                        <div className="card">
                            <strong>Estado civil</strong>
                            <p>{empleado.estadoCivil}</p>
                        </div>
                        <div className="card">
                            <strong>Nacionalidad</strong>
                            <p>{empleado.nacionalidad}</p>
                        </div>
                        <div className="card">
                            <strong>Dirección</strong>
                            <p>{empleado.direccion}</p>
                        </div>
                        <div className="card">
                            <strong>Área</strong>
                            <p>{empleado.area || "Sin área"}</p>
                        </div>
                        <div className="card">
                            <strong>Estado</strong>
                            <p>{empleado.estado}</p>
                        </div>
                    </div>

                    {/* Sección Puesto y Horario */}
                    <div className="subsecciones">
                        <div className="subseccion">
                            <h3>Puesto actual</h3>
                            <div className="info-grid">
                                <div className="card">
                                    <strong>Nombre</strong>
                                    <p>{empleado.nombrePuesto}</p>
                                </div>
                                <div className="card">
                                    <strong>Departamento</strong>
                                    <p>{empleado.departamento}</p>
                                </div>
                                <div className="card">
                                    <strong>Nivel jerárquico</strong>
                                    <p>{empleado.nivelJerarquico}</p>
                                </div>
                                <div className="card">
                                    <strong>Salario asignado</strong>
                                    <p>{empleado.salarioAsignado}</p>
                                </div>
                                <div className="card">
                                    <strong>Fecha inicio</strong>
                                    <p>{empleado.fechaInicioPuesto}</p>
                                </div>
                            </div>
                        </div>

                        {/* Horario */}
                        <div className="subseccion">
                            <h3>Horario</h3>
                            <div className="info-grid">
                                <div className="card">
                                    <strong>Nombre</strong>
                                    <p>{empleado.nombreHorario}</p>
                                </div>
                                <div className="card">
                                    <strong>Hora entrada</strong>
                                    <p>{empleado.horaEntrada || "-"}</p>
                                </div>
                                <div className="card">
                                    <strong>Hora salida</strong>
                                    <p>{empleado.horaSalida || "-"}</p>
                                </div>
                                <div className="card">
                                    <strong>Días</strong>
                                    <p>{empleado.diasSemana || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {modalPuestoVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{empleado.nombrePuesto === "Sin Asignar" ? "Asignar Puesto" : "Actualizar Puesto"}</h3>

                        {/* Información actual del puesto */}
                        {empleado.nombrePuesto !== "Sin Asignar" && (
                            <div className="info-actual">
                                <p><strong>Nombre:</strong> {empleado.nombrePuesto}</p>
                                <p><strong>Departamento:</strong> {empleado.departamento}</p>
                                <p><strong>Área:</strong> {empleado.area}</p>
                                <p><strong>Salario:</strong> {empleado.salarioAsignado}</p>
                            </div>
                        )}

                        {/* Formulario de asignación */}
                        <form onSubmit={handleAsignarPuesto}>
                            <label>
                                Área:
                                <select value={areaSeleccionada} onChange={handleAreaChange}>
                                    <option value="">Seleccione área</option>
                                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </label>

                            <label>
                                Puesto:
                                <select value={puestoSeleccionado} onChange={e => setPuestoSeleccionado(e.target.value)}>
                                    <option value="">Seleccione puesto</option>
                                    {puestosFiltrados.map(p => <option key={p.idPuesto} value={p.idPuesto}>{p.nombrePuesto}</option>)}
                                </select>
                            </label>

                            <label>
                                Salario:
                                <input
                                    type="number"
                                    value={salario}
                                    onChange={e => setSalario(e.target.value)}
                                />
                            </label>

                            <label>
                                Fecha inicio (opcional):
                                <input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={e => setFechaInicio(e.target.value)}
                                />
                            </label>

                            <label>
                                Motivo del cambio (opcional):
                                <input
                                    type="text"
                                    value={motivoCambio}
                                    onChange={e => setMotivoCambio(e.target.value)}
                                />
                            </label>

                            <div className="modal-buttons">
                                <button type="submit">
                                    {empleado.nombrePuesto === "Sin Asignar" ? "Asignar" : "Actualizar"}
                                </button>
                                <button type="button" onClick={() => setModalPuestoVisible(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalHorarioVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{empleado.nombreHorario === "Sin horario" ? "Asignar Horario" : "Actualizar Horario"}</h3>

                        {/* Información actual del horario */}
                        {empleado.nombreHorario !== "Sin horario" && (
                            <div className="card info-horario-actual">
                                <strong>Horario actual:</strong>
                                <p><strong>Nombre:</strong> {empleado.nombreHorario}</p>
                                <p><strong>Hora entrada:</strong> {empleado.horaEntrada || "-"}</p>
                                <p><strong>Hora salida:</strong> {empleado.horaSalida || "-"}</p>
                                <p><strong>Días:</strong> {empleado.diasSemana || "-"}</p>
                            </div>
                        )}

                        <form onSubmit={handleAsignarHorario}>
                            <label>
                                Nuevo horario:
                                <select value={horarioSeleccionado} onChange={e => setHorarioSeleccionado(e.target.value)}>
                                    <option value="">Seleccione horario</option>
                                    {horariosDisponibles.map(h => (
                                        <option key={h.idHorario} value={h.idHorario}>
                                            {h.nombreHorario} | {h.horaEntrada} - {h.horaSalida} | {h.diasSemana}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className="modal-buttons">
                                <button type="submit">
                                    {empleado.nombreHorario === "Sin horario" ? "Asignar" : "Actualizar"}
                                </button>
                                <button type="button" onClick={() => setModalHorarioVisible(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
