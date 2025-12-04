// src/modules/asistencia/reportesMockData.js

export const mockSummary = {
  diasTrabajados: 0,
  faltas: 0,
  tardanzas: 0,
  horasExtra: 0
};

// Datos pensados para "ResumenPorEmpleado"
export const mockResumenPorEmpleado = [
  { id: 1, empleadoId: 1, empleado: "Estefano Alexis Ramírez García", area: "Recursos humanos", diasTrabajados: 22, faltas: 1, tardanzas: 3, horasExtra: 5.5 },
  { id: 2, empleadoId: 2, empleado: "María López", area: "Recursos humanos", diasTrabajados: 20, faltas: 0, tardanzas: 4, horasExtra: 2 },
  { id: 3, empleadoId: 3, empleado: "Juan Pérez", area: "Ventas", diasTrabajados: 18, faltas: 2, tardanzas: 1, horasExtra: 3 },
  { id: 4, empleadoId: 4, empleado: "Lucía Martínez", area: "Ventas", diasTrabajados: 21, faltas: 0, tardanzas: 5, horasExtra: 1.5 },
  { id: 5, empleadoId: 5, empleado: "Carlos Gómez", area: "Operaciones", diasTrabajados: 25, faltas: 0, tardanzas: 0, horasExtra: 10 },
  { id: 6, empleadoId: 6, empleado: "Ana Torres", area: "Operaciones", diasTrabajados: 23, faltas: 1, tardanzas: 2, horasExtra: 7.25 },
  { id: 7, empleadoId: 7, empleado: "Diego Fernández", area: "Logística", diasTrabajados: 24, faltas: 0, tardanzas: 1, horasExtra: 4 },
  { id: 8, empleadoId: 8, empleado: "Sofía Rojas", area: "Logística", diasTrabajados: 19, faltas: 1, tardanzas: 3, horasExtra: 2.5 },
  { id: 9, empleadoId: 9, empleado: "Miguel Sánchez", area: "IT", diasTrabajados: 22, faltas: 0, tardanzas: 2, horasExtra: 6 },
  { id: 10, empleadoId: 10, empleado: "Laura Herrera", area: "IT", diasTrabajados: 20, faltas: 1, tardanzas: 4, horasExtra: 3.75 },
  { id: 11, empleadoId: 11, empleado: "Pedro Castillo", area: "Marketing", diasTrabajados: 21, faltas: 0, tardanzas: 1, horasExtra: 5 },
  { id: 12, empleadoId: 12, empleado: "Valeria Núñez", area: "Marketing", diasTrabajados: 19, faltas: 2, tardanzas: 3, horasExtra: 1.5 },
  { id: 13, empleadoId: 13, empleado: "Andrés Vargas", area: "Finanzas", diasTrabajados: 23, faltas: 0, tardanzas: 2, horasExtra: 4.5 },
  { id: 14, empleadoId: 14, empleado: "Paola Medina", area: "Finanzas", diasTrabajados: 18, faltas: 1, tardanzas: 4, horasExtra: 2 },
  { id: 15, empleadoId: 15, empleado: "Jorge Ruiz", area: "Recursos humanos", diasTrabajados: 21, faltas: 0, tardanzas: 1, horasExtra: 3 },
  { id: 16, empleadoId: 16, empleado: "Camila Ortiz", area: "Ventas", diasTrabajados: 20, faltas: 0, tardanzas: 2, horasExtra: 2.75 },
  { id: 17, empleadoId: 17, empleado: "Ricardo Silva", area: "Operaciones", diasTrabajados: 24, faltas: 0, tardanzas: 1, horasExtra: 9 },
  { id: 18, empleadoId: 18, empleado: "Natalia Flores", area: "Logística", diasTrabajados: 22, faltas: 0, tardanzas: 3, horasExtra: 4.25 },
  { id: 19, empleadoId: 19, empleado: "Gustavo Aguilar", area: "IT", diasTrabajados: 23, faltas: 0, tardanzas: 0, horasExtra: 8 },
  { id: 20, empleadoId: 20, empleado: "Daniela Paredes", area: "Marketing", diasTrabajados: 21, faltas: 1, tardanzas: 2, horasExtra: 3.5 },
  { id: 21, empleadoId: 21, empleado: "Hugo Castro", area: "Finanzas", diasTrabajados: 20, faltas: 2, tardanzas: 1, horasExtra: 1 },
  { id: 22, empleadoId: 22, empleado: "Elena Prado", area: "Recursos humanos", diasTrabajados: 19, faltas: 0, tardanzas: 3, horasExtra: 2 },
  { id: 23, empleadoId: 23, empleado: "Tomás Arias", area: "Operaciones", diasTrabajados: 25, faltas: 0, tardanzas: 0, horasExtra: 11 },
  { id: 24, empleadoId: 24, empleado: "Isabela Molina", area: "Ventas", diasTrabajados: 22, faltas: 0, tardanzas: 1, horasExtra: 4 },
  { id: 25, empleadoId: 25, empleado: "Felipe Cornejo", area: "Logística", diasTrabajados: 23, faltas: 1, tardanzas: 2, horasExtra: 5 }
];

// Datos pensados para "DetallePorDia" (unos cuantos días de ejemplo)
export const mockDetallePorDia = [
  {
    id: 1001,
    fecha: "2025-11-01",
    empleadoId: 1,
    empleado: "Estefano Alexis Ramírez García",
    area: "Recursos humanos",
    estado: "Puntual",
    horaEntrada: "08:00",
    horaSalida: "16:00",
    horasTrabajadas: 8
  },
  {
    id: 1002,
    fecha: "2025-11-02",
    empleadoId: 1,
    empleado: "Estefano Alexis Ramírez García",
    area: "Recursos humanos",
    estado: "Tarde",
    horaEntrada: "08:20",
    horaSalida: "16:10",
    horasTrabajadas: 7.8
  },
  {
    id: 1003,
    fecha: "2025-11-01",
    empleadoId: 3,
    empleado: "Juan Pérez",
    area: "Ventas",
    estado: "Falta",
    horaEntrada: null,
    horaSalida: null,
    horasTrabajadas: 0
  },
  {
    id: 1004,
    fecha: "2025-11-03",
    empleadoId: 5,
    empleado: "Carlos Gómez",
    area: "Operaciones",
    estado: "Puntual",
    horaEntrada: "06:00",
    horaSalida: "14:00",
    horasTrabajadas: 8
  },
  {
    id: 1005,
    fecha: "2025-11-03",
    empleadoId: 9,
    empleado: "Miguel Sánchez",
    area: "IT",
    estado: "Tarde",
    horaEntrada: "09:20",
    horaSalida: "18:00",
    horasTrabajadas: 7.7
  },
  {
    id: 1006,
    fecha: "2025-11-04",
    empleadoId: 13,
    empleado: "Andrés Vargas",
    area: "Finanzas",
    estado: "Puntual",
    horaEntrada: "08:00",
    horaSalida: "16:00",
    horasTrabajadas: 8
  },
  {
    id: 1007,
    fecha: "2025-11-04",
    empleadoId: 18,
    empleado: "Natalia Flores",
    area: "Logística",
    estado: "Puntual",
    horaEntrada: "15:00",
    horaSalida: "23:00",
    horasTrabajadas: 8
  },
  {
    id: 1008,
    fecha: "2025-11-05",
    empleadoId: 2,
    empleado: "María López",
    area: "Recursos humanos",
    estado: "Falta",
    horaEntrada: null,
    horaSalida: null,
    horasTrabajadas: 0
  },
  {
    id: 1009,
    fecha: "2025-11-05",
    empleadoId: 6,
    empleado: "Ana Torres",
    area: "Operaciones",
    estado: "Tarde",
    horaEntrada: "06:25",
    horaSalida: "14:10",
    horasTrabajadas: 7.75
  },
  {
    id: 1010,
    fecha: "2025-11-06",
    empleadoId: 20,
    empleado: "Daniela Paredes",
    area: "Marketing",
    estado: "Puntual",
    horaEntrada: "12:30",
    horaSalida: "20:30",
    horasTrabajadas: 8
  }
];
