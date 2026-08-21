import { useState } from "react";

function ConfiguracionPomodoro({ volver }) {
  const [duracionTrabajo, setDuracionTrabajo] = useState(() => {
    const guardada = localStorage.getItem("duracionTrabajo");
    return guardada ? Number(guardada) : 25;
  });

  const [duracionDescansoCorto, setDuracionDescansoCorto] = useState(() => {
    const guardada = localStorage.getItem("duracionDescansoCorto");
    return guardada ? Number(guardada) : 5;
  });

  const [duracionDescansoLargo, setDuracionDescansoLargo] = useState(() => {
    const guardada = localStorage.getItem("duracionDescansoLargo");
    return guardada ? Number(guardada) : 15;
  });

  const [sesionesAntesDescansoLargo, setSesionesAntesDescansoLargo] =
    useState(() => {
      const guardada = localStorage.getItem("sesionesAntesDescansoLargo");
      return guardada ? Number(guardada) : 4;
    });

  function guardarConfiguracion() {
    localStorage.setItem("duracionTrabajo", duracionTrabajo);
    localStorage.setItem("duracionDescansoCorto", duracionDescansoCorto);
    localStorage.setItem("duracionDescansoLargo", duracionDescansoLargo);
    localStorage.setItem(
      "sesionesAntesDescansoLargo",
      sesionesAntesDescansoLargo,
    );

    volver();
  }

  return (
    <div>
      <h1>Configuración Pomodoro</h1>

      <div>
        <label htmlFor="duracionTrabajo">
          Tiempo de concentración:
        </label>

        <input
          id="duracionTrabajo"
          type="number"
          min="1"
          max="180"
          value={duracionTrabajo}
          onChange={(e) => setDuracionTrabajo(Number(e.target.value))}
        />

        <span> minutos</span>
      </div>

      <div>
        <label htmlFor="duracionDescansoCorto">
          Descanso corto:
        </label>

        <input
          id="duracionDescansoCorto"
          type="number"
          min="1"
          max="60"
          value={duracionDescansoCorto}
          onChange={(e) =>
            setDuracionDescansoCorto(Number(e.target.value))
          }
        />

        <span> minutos</span>
      </div>

      <div>
        <label htmlFor="duracionDescansoLargo">
          Descanso largo:
        </label>

        <input
          id="duracionDescansoLargo"
          type="number"
          min="1"
          max="60"
          value={duracionDescansoLargo}
          onChange={(e) =>
            setDuracionDescansoLargo(Number(e.target.value))
          }
        />

        <span> minutos</span>
      </div>

      <div>
        <label htmlFor="sesionesAntesDescansoLargo">
          Sesiones antes del descanso largo:
        </label>

        <input
          id="sesionesAntesDescansoLargo"
          type="number"
          min="1"
          max="10"
          value={sesionesAntesDescansoLargo}
          onChange={(e) =>
            setSesionesAntesDescansoLargo(Number(e.target.value))
          }
        />

        <span> sesiones</span>
      </div>

      <button onClick={guardarConfiguracion}>Guardar</button>

      <button onClick={volver}>Volver</button>
    </div>
  );
}

export default ConfiguracionPomodoro;