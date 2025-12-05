import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
                    ...(dataPuesto ? {
                        nombrePuesto: dataPuesto.nombrePuesto,
                        departamento: dataPuesto.departamento,
                        area: dataPuesto.area,
                        nivelJerarquico: dataPuesto.nivelJerarquico,
                        salarioAsignado: dataPuesto.salarioAsignado,
                        fechaInicioPuesto: dataPuesto.fechaInicioPuesto,
                        fechaFinPuesto: dataPuesto.fechaFinPuesto,
                    } : {}),
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
            <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
                ← Volver a la lista
            </button>

            <h2>Detalle de {empleado.nombres} {empleado.apellidoPaterno}</h2>

            <div className="detalle-seccion">
                <h3>Información básica</h3>
                <p>ID: {empleado.idEmpleado}</p>
                <p>DNI: {empleado.documentoIdentidad}</p>
                <p>Email: {empleado.email}</p>
                <p>Teléfono: {empleado.telefono}</p>
                <p>Área: {empleado.area || "Sin área"}</p>
            </div>

            {empleado.nombrePuesto && (
                <div className="detalle-seccion">
                    <h3>Puesto actual</h3>
                    <p>Nombre: {empleado.nombrePuesto}</p>
                    <p>Departamento: {empleado.departamento}</p>
                    <p>Nivel jerárquico: {empleado.nivelJerarquico}</p>
                    <p>Salario asignado: {empleado.salarioAsignado}</p>
                    <p>Fecha inicio: {empleado.fechaInicioPuesto}</p>
                    <p>Fecha fin: {empleado.fechaFinPuesto || "N/A"}</p>
                </div>
            )}

            {empleado.nombreHorario && (
                <div className="detalle-seccion">
                    <h3>Horario</h3>
                    <p>Nombre: {empleado.nombreHorario}</p>
                    <p>Hora entrada: {empleado.horaEntrada || "-"}</p>
                    <p>Hora salida: {empleado.horaSalida || "-"}</p>
                    <p>Días: {empleado.diasSemana || "-"}</p>
                </div>
            )}
        </div>
    );
}
