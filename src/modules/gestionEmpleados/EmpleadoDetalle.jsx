import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EmpleadoDetalle.css"; // Separa el CSS para estilos

export default function EmpleadoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [empleado, setEmpleado] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
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

        cargarEmpleado();
    }, [id]);

    if (cargando) return <p>Cargando información del empleado...</p>;
    if (!empleado) return <p>Empleado no encontrado</p>;

    return (
        <div className="empleado-detalle">
            <button onClick={() => navigate(-1)} className="volver-btn">Volver</button>

            <div className="detalle-header">
                <h2>Detalle de empleado</h2>
                <div className="botones-accion">
                    <button>
                        {empleado.nombrePuesto === "Sin Asignar" ? "Asignar Puesto" : "Actualizar Puesto"}
                    </button>
                    <button>
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
        </div>
    );
}
