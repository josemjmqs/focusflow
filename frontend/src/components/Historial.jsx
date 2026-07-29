import { useEffect, useState } from "react";
import { obtenerSesiones } from "../services/api";

function formatearDuracion(segundos) {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    let texto = "";

    if (horas > 0) {
      texto += `${horas} h `;
    }

    if (minutos > 0) {
      texto += `${minutos} min `;
    }

    if (segundosRestantes > 0 || texto === "") {
      texto += `${segundosRestantes} s`;
    }

    return texto.trim();
  }

function Historial() {
  const [sesiones, setSesiones] = useState([]);

  useEffect(() => {
    obtenerSesiones().then((resultado) => {
      setSesiones(resultado);
    });
  }, []);

  return (
    <div>
      <h2>Historial</h2>

      {sesiones.map((sesion) => (
        <div key={sesion.id}>
          <p>Inicio: {new Date(sesion.inicio).toLocaleDateString("es-CL")}</p>

          <p>
            Hora:{" "}
            {new Date(sesion.inicio).toLocaleTimeString("es-CL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>Fin: {sesion.fin}</p>
          <p>Duración: {formatearDuracion(sesion.duracion)}</p>
          <p>Estado: {sesion.estado}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Historial;
