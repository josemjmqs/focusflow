import { useEffect, useState } from "react";
import {
  obtenerSesiones,
  cancelarSesion,
  restaurarSesion,
} from "../services/api";
import { formatearDuracion } from "../utils/formatearDuracion";
import "./Historial.css";

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
    <div className="historial">
      <h2 className="historial-titulo">Historial</h2>

      <div className="historial-lista">
        {sesiones.map((sesion) => (
          <div className="historial-sesion" key={sesion.id}>
            <div className="historial-datos">
              <p>
                <strong>Inicio:</strong> {formatearFechaHora(sesion.inicio)}
              </p>

              <p>
                <strong>Fin:</strong> {formatearFechaHora(sesion.fin)}
              </p>

              <p>
                <strong>Duración:</strong> {formatearDuracion(sesion.duracion)}
              </p>

              <p>
                <strong>Estado:</strong>{" "}
                <span className={`estado-${sesion.estado}`}>
                  {sesion.estado}
                </span>
              </p>
            </div>

            <div className="historial-acciones">
              {sesion.estado === "completada" && (
                <button
                  className="boton-cancelar"
                  onClick={() => handleCancelar(sesion.id)}
                >
                  Cancelar
                </button>
              )}

              {sesion.estado === "cancelada" && (
                <button
                  className="boton-restaurar"
                  onClick={() => handleRestaurar(sesion.id)}
                >
                  Restaurar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Historial;
