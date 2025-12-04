import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MonthlySummaryPie({ registros = [] }) {
  const now = new Date();
  const mesActual = now.toISOString().slice(0, 7); // "YYYY-MM"

  const registrosMes = registros.filter((r) => {
    if (!r.fecha) return false;
    // r.fecha viene como "YYYY-MM-DD"
    return r.fecha.slice(0, 7) === mesActual;
  });


  if (registrosMes.length === 0) {
    return (
      <div
        style={{
          width: "260px",
          height: "260px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: 12,
          textAlign: "center",
        }}
      >
        Sin registros en el mes actual.
      </div>
    );
  }

  let puntuales = 0;
  let tardes = 0;
  let faltas = 0;

  registrosMes.forEach((r) => {
    if (r.tipoRegistro === "PUNTUAL") puntuales++;
    else if (r.tipoRegistro === "TARDE") tardes++;
    else if (r.tipoRegistro === "FALTA") faltas++;
  });

  const data = {
    labels: ["Puntual", "Tarde", "Falta"],
    datasets: [
      {
        data: [puntuales, tardes, faltas],
        backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
      },
    ],
  };

  return (
    <div style={{ width: "260px", height: "260px" }}>
      <Pie data={data} />
    </div>
  );
}
