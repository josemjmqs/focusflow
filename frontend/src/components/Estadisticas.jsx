import { useEffect, useState } from "react";

import { obtenerEstadisticas } from "../services/api";
import { formatearDuracion } from "../utils/formatearDuracion";

import "./Estadisticas.css";

function Estadisticas({ actualizar }) {
  const [datos, setDatos] = useState(null);

  console.log("DATOS ACTUALES:", datos);

  useEffect(() => {
    const cargarEstadisticas = () => {
      console.log("Cargando estadísticas...", new Date().toLocaleTimeString());
      obtenerEstadisticas()
        .then((resultado) => {
          console.log("ESTADÍSTICAS RECIBIDAS:", resultado);
          setDatos(resultado);
        })
        .catch((error) => {
          console.error("Error obteniendo estadísticas:", error);
        });
    };

    cargarEstadisticas();

    const ahora = new Date();

    const proximaMedianoche = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate() + 1,
      0,
      0,
      1,
    );

    const tiempoHastaMedianoche = proximaMedianoche.getTime() - ahora.getTime();

    const temporizador = setTimeout(() => {
      cargarEstadisticas();
    }, tiempoHastaMedianoche);

    return () => {
      clearTimeout(temporizador);
    };
  }, [actualizar]);

  if (!datos) {
    return <p>Cargando...</p>;
  }

  function obtenerNombreDia(fecha) {
    const [año, mes, dia] = fecha.split("-");

    const fechaLocal = new Date(año, mes - 1, dia);

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
      <div className="estadistica-hoy">
        <h3>Hoy</h3>

        <div className="estadistica-hoy-datos">
          <div>
            <span className="estadistica-hoy-valor">
              {formatearDuracion(datos.tiempoHoy)}
            </span>

            <span>Tiempo de concentración</span>
          </div>

          <div>
            <span className="estadistica-hoy-valor">{datos.sesionesHoy}</span>

            <span>Sesiones</span>
          </div>
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
