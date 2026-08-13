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

  function formatearFechaHora(fecha) {
    const fechaLocal = new Date(fecha);

    return fechaLocal.toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  return (
    <div>
      <h2>Historial</h2>

      {sesiones.map((sesion) => (
        <div key={sesion.id}>
          <p>Inicio: {formatearFechaHora(sesion.inicio)}</p>

          <p>Fin: {formatearFechaHora(sesion.fin)}</p>

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
