import { createContext, useContext, useState, useEffect } from "react";

const GestionEmpleadoContext = createContext();

export function GestionEmpleadoProvider({ children }) {
    const [empleados, setEmpleados] = useState([]);
    const [areas, setAreas] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [cargado, setCargado] = useState(false);

    const cargarEmpleados = async () => {
        try {
            const [
                respTodos,
                respConPuesto,
                respConHorario
            ] = await Promise.all([
                fetch("http://localhost:8080/api/gempleados"),
                fetch("http://localhost:8080/api/gempleados/con-puesto"),
                fetch("http://localhost:8080/api/gempleados/con-horario")
            ]);

            const empleadosTodos = await respTodos.json();
            const empleadosConPuesto = await respConPuesto.json();
            const empleadosConHorario = await respConHorario.json();

            const mapa = new Map();

            // Base: todos los empleados
            empleadosTodos.forEach(e =>
                mapa.set(e.idEmpleado, {
                    ...e,
                    area: "",
                    nombreHorario: "Sin horario"
                })
            );

            // Merge: puestos
            empleadosConPuesto.forEach(e => {
                if (mapa.has(e.idEmpleado)) {
                    mapa.set(e.idEmpleado, {
                        ...mapa.get(e.idEmpleado),
                        ...e
                    });
                }
            });

            // Merge: horarios
            empleadosConHorario.forEach(e => {
                if (mapa.has(e.idEmpleado)) {
                    mapa.set(e.idEmpleado, {
                        ...mapa.get(e.idEmpleado),
                        nombreHorario: e.nombreHorario || "Sin horario"
                    });
                }
            });

            const combinados = Array.from(mapa.values());
            setEmpleados(combinados);

            // --- ÁREAS ---
            const distinctAreas = [...new Set(combinados.map(e => e.area || ""))];
            setAreas(["Todas las áreas", ...distinctAreas.map(a => a || "Sin área")]);

            // --- HORARIOS ---
            const distinctHorarios = [
                ...new Set(combinados.map(e => e.nombreHorario || "Sin horario"))
            ];

            setHorarios(["Todos los horarios", ...distinctHorarios]);

            setCargado(true);

        } catch (e) {
            console.error("Error cargando empleados", e);
        }
    };

    useEffect(() => {
        if (!cargado) cargarEmpleados();
    }, [cargado]);

    return (
        <GestionEmpleadoContext.Provider value={{
            empleados,
            areas,
            horarios,
            cargarEmpleados,
        }}>
            {children}
        </GestionEmpleadoContext.Provider>
    );
}

export const useGestionEmpleado = () => useContext(GestionEmpleadoContext);