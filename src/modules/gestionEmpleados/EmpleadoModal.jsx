import React, { useState } from "react";
import "./EmpleadoModal.css";

export default function EmpleadoModal({ isOpen, onClose, onEmpleadoCreado }) {
    const [form, setForm] = useState({
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        documentoIdentidad: "",
        tipoDocumento:"DNI",
        email: "",
        telefono: "",
        fechaNacimiento: "",
        genero: "",
        estadoCivil: "",
        nacionalidad: "",
        direccion: "",
        tipoContrato:"JORNADA_COMPLETA",
        modalidadTrabajo:"PRESENCIAL"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resp = await fetch("http://localhost:8080/api/gempleados/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)  // solo los campos del formulario
            });

            if (!resp.ok) throw new Error("Error al crear empleado");

            const nuevoEmpleado = await resp.json();
            onEmpleadoCreado(nuevoEmpleado);
            onClose();

            // Reset formulario
            setForm({
                nombres: "",
                apellidoPaterno: "",
                apellidoMaterno: "",
                documentoIdentidad: "",
                tipoDocumento:"DNI",
                email: "",
                telefono: "",
                fechaNacimiento: "",
                genero: "",
                estadoCivil: "",
                nacionalidad: "",
                direccion: "",
                tipoContrato:"JORNADA_COMPLETA",
                modalidadTrabajo:"PRESENCIAL"
            });
        } catch (error) {
            console.error(error);
            alert("No se pudo crear el empleado.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Agregar Empleado</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" name="nombres" value={form.nombres} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Apellido Paterno</label>
                        <input type="text" name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Apellido Materno</label>
                        <input type="text" name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>DNI</label>
                        <input type="text" name="documentoIdentidad" value={form.documentoIdentidad} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" name="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Teléfono</label>
                        <input type="text" name="telefono" value={form.telefono} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Fecha de nacimiento</label>
                        <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Género</label>
                        <select name="genero" value={form.genero} onChange={handleChange}>
                            <option value="">Seleccione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Estado civil</label>
                        <select name="estadoCivil" value={form.estadoCivil} onChange={handleChange}>
                            <option value="">Seleccione</option>
                            <option value="Soltero">Soltero</option>
                            <option value="Casado">Casado</option>
                            <option value="Divorciado">Divorciado</option>
                            <option value="Viudo">Viudo</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Nacionalidad</label>
                        <input type="text" name="nacionalidad" value={form.nacionalidad} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Dirección</label>
                        <textarea name="direccion" value={form.direccion} onChange={handleChange}></textarea>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancelar</button>
                        <button type="submit">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
