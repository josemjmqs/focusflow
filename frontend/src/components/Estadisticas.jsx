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
    <div>
      <h2>Estadísticas</h2>

      <div>
        <div>
          <h3>Hoy</h3>
          <p>{formatearDuracion(datos.tiempoHoy)}</p>
        </div>

        <div>
          <h3>Sesiones hoy</h3>
          <p>{datos.sesionesHoy}</p>
        </div>

        <div>
          <h3>Esta semana</h3>
          <p>{formatearDuracion(datos.tiempoSemana)}</p>
        </div>

        <div>
          <h3>Este mes</h3>
          <p>{formatearDuracion(datos.tiempoMes)}</p>
        </div>
      </div>

      <h3>Concentración esta semana</h3>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "20px",
          height: "250px",
        }}
      >
        {datos.tiempoPorDia.map((dia) => {
          const altura = (dia.tiempo / tiempoMaximo) * 200;

          return (
            <div
              key={dia.dia}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <span>{formatearDuracion(dia.tiempo)}</span>

              <div
                style={{
                  width: "40px",
                  height: `${altura}px`,
                  backgroundColor: "steelblue",
                }}
              />

              <span>{obtenerNombreDia(dia.dia)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Estadisticas;
