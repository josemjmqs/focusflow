import { useEffect, useState } from "react";
import { obtenerEstadisticas } from "../services/api";
import { formatearDuracion } from "../utils/formatearDuracion";

function Estadisticas({ actualizar }) {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    obtenerEstadisticas().then((resultado) => {
      setDatos(resultado);
    });
  }, [actualizar]);

  if (!datos) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Estadísticas</h2>

      <p>Hoy: {formatearDuracion(datos.tiempoHoy)}</p>
      <p>Semana: {formatearDuracion(datos.tiempoSemana)}</p>
      <p>Mes: {formatearDuracion(datos.tiempoMes)}</p>
      <p>Sesiones: {datos.sesionesCompletadas}</p>
    </div>
  );
}

export default Estadisticas;
