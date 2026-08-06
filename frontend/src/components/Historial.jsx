import { useEffect, useState } from "react";
import {
  obtenerSesiones,
  cancelarSesion,
  restaurarSesion,
} from "../services/api";
import { formatearDuracion } from "../utils/formatearDuracion";

function Historial({ actualizar, cambiarActualizacion }) {
  const [sesiones, setSesiones] = useState([]);

  useEffect(() => {
    obtenerSesiones().then((resultado) => {
      setSesiones(resultado);
    });
  }, [actualizar]);

  async function handleCancelar(id) {
    await cancelarSesion(id);

    cambiarActualizacion();

    const resultado = await obtenerSesiones();

    setSesiones(resultado);
  }

  async function handleRestaurar(id) {
    await restaurarSesion(id);

    cambiarActualizacion();

    const resultado = await obtenerSesiones();
    setSesiones(resultado);
  }

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
          {sesion.estado === "completada" && (
            <button onClick={() => handleCancelar(sesion.id)}>Cancelar</button>
          )}
          {sesion.estado === "cancelada" && (
            <button onClick={() => handleRestaurar(sesion.id)}>
              Restaurar
            </button>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Historial;
