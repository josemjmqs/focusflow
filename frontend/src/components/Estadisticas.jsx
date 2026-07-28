import { useEffect, useState } from "react";
import { obtenerEstadisticas } from "../services/api";

function Estadisticas() {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    obtenerEstadisticas()
      .then((resultado) => {
        setDatos(resultado);
      });
  }, []);

  if (!datos) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <h2>Estadísticas</h2>

      <p>Hoy: {datos.tiempoHoy} segundos</p>
      <p>Semana: {datos.tiempoSemana} segundos</p>
      <p>Mes: {datos.tiempoMes} segundos</p>
      <p>Sesiones: {datos.sesionesCompletadas}</p>
    </div>
  );
}

export default Estadisticas;