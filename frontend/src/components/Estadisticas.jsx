import { useEffect, useState } from "react";
import { obtenerEstadisticas } from "../services/api";
import { formatearDuracion } from "../utils/formatearDuracion";
import "./Estadisticas.css";

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

  function obtenerNombreDia(fecha) {
    const fechaLocal = new Date(fecha);

    return fechaLocal.toLocaleDateString("es-CL", {
      weekday: "short",
    });
  }

  const tiempoMaximo = Math.max(
    ...datos.tiempoPorDia.map((dia) => dia.tiempo),
    1,
  );

  return (
    <div className="estadisticas">
      <h2 className="estadisticas-titulo">Estadísticas</h2>

      <div className="estadisticas-resumen">
        <div className="estadistica">
          <h3>Hoy</h3>
          <p>{formatearDuracion(datos.tiempoHoy)}</p>
        </div>

        <div className="estadistica">
          <h3>Sesiones hoy</h3>
          <p>{datos.sesionesHoy}</p>
        </div>

        <div className="estadistica">
          <h3>Esta semana</h3>
          <p>{formatearDuracion(datos.tiempoSemana)}</p>
        </div>

        <div className="estadistica">
          <h3>Este mes</h3>
          <p>{formatearDuracion(datos.tiempoMes)}</p>
        </div>
      </div>

      <section className="estadisticas-semana">
        <h3>Concentración esta semana</h3>

        <div className="grafico">
          {datos.tiempoPorDia.map((dia) => {
            const altura = (dia.tiempo / tiempoMaximo) * 200;

            return (
              <div className="barra-contenedor" key={dia.dia}>
                <span className="barra-valor">
                  {formatearDuracion(dia.tiempo)}
                </span>

                <div className="barra" style={{ height: `${altura}px` }} />

                <span className="barra-dia">{obtenerNombreDia(dia.dia)}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Estadisticas;
