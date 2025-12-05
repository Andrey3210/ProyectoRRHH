// src/modules/asistencia/components/EditAttendanceModal.jsx
import { useState } from "react";

export default function EditAttendanceModal({ tramo, onClose, onSave }) {
  const [inicio, setInicio] = useState(tramo.inicio || "");
  const [fin, setFin] = useState(tramo.fin || "");
  const [estado, setEstado] = useState(tramo.estado);
  const [motivo, setMotivo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("EDIT SUBMIT:", { inicio, fin, estado, motivo, tramo }); // ← añade esto

    onSave({
      ...tramo,
      inicio,
      fin: fin || null,
      estado,
      motivo,
    });
  };


  return (
    <div className="et-modal-backdrop" onClick={onClose}>
      <div className="et-modal" onClick={e => e.stopPropagation()}>
        <h2 className="et-modal-title">Editar asistencia</h2>
        <p className="et-modal-subtitle">{tramo.empleadoNombre}</p>

        <form onSubmit={handleSubmit} className="et-modal-form">
          <div className="et-modal-row">
            <label>
              Hora de entrada
              <input
                type="time"
                value={inicio}
                onChange={e => setInicio(e.target.value)}
                required
              />
            </label>
            <label>
              Hora de salida
              <input
                type="time"
                value={fin}
                onChange={e => setFin(e.target.value)}
              />
            </label>
          </div>

          <div className="et-modal-row">
            <label>
              Estado
              <select
                value={estado}
                onChange={e => setEstado(e.target.value)}
              >
                <option value="Presente">Presente</option>
                <option value="Puntual">Puntual</option>
                <option value="Tarde">Tarde</option>
                <option value="Falta">Falta</option>
              </select>
            </label>
          </div>

          <label className="et-modal-full">
            Motivo / comentario
            <textarea
              rows={3}
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="Justificación u observaciones..."
            />
          </label>

          <div className="et-modal-actions">
            <button
              type="button"
              className="et-btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="et-btn-primary">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
