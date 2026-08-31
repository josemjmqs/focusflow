import { useState } from "react";
import "./ConfiguracionPomodoro.css";

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

  const [sesionesAntesDescansoLargo, setSesionesAntesDescansoLargo] = useState(
    () => {
      const guardada = localStorage.getItem("sesionesAntesDescansoLargo");
      return guardada ? Number(guardada) : 4;
    },
  );

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
    <div className="configuracion-pomodoro">
      <div className="configuracion-contenedor">
        <div className="configuracion-encabezado">
          <span className="configuracion-icono">⚙️</span>

          <div>
            <h1>Configuración Pomodoro</h1>
            <p>Personaliza tus tiempos de concentración y descanso.</p>
          </div>
        </div>

        <div className="configuracion-seccion">
          <h2>🎯 Concentración</h2>

          <div className="configuracion-opcion">
            <div>
              <label htmlFor="duracionTrabajo">Tiempo de concentración</label>

              <p>Duración de cada sesión de trabajo.</p>
            </div>

            <div className="configuracion-input">
              <input
                id="duracionTrabajo"
                type="number"
                min="0.0167"
                max="180"
                step="any"
                value={duracionTrabajo}
                onChange={(e) => setDuracionTrabajo(Number(e.target.value))}
              />

              <span>min</span>
            </div>
          </div>
        </div>

        <div className="configuracion-seccion">
          <h2>☕ Descansos</h2>

          <div className="configuracion-opcion">
            <div>
              <label htmlFor="duracionDescansoCorto">Descanso corto</label>

              <p>Descanso entre sesiones de concentración.</p>
            </div>

            <div className="configuracion-input">
              <input
                id="duracionDescansoCorto"
                type="number"
                min="0.0167"
                max="60"
                step="any"
                value={duracionDescansoCorto}
                onChange={(e) =>
                  setDuracionDescansoCorto(Number(e.target.value))
                }
              />

              <span>min</span>
            </div>
          </div>

          <div className="configuracion-opcion">
            <div>
              <label htmlFor="duracionDescansoLargo">Descanso largo</label>

              <p>Descanso después de completar el ciclo.</p>
            </div>

            <div className="configuracion-input">
              <input
                id="duracionDescansoLargo"
                type="number"
                min="0.0167"
                max="60"
                step="any"
                value={duracionDescansoLargo}
                onChange={(e) =>
                  setDuracionDescansoLargo(Number(e.target.value))
                }
              />

              <span>min</span>
            </div>
          </div>
        </div>

        <div className="configuracion-seccion">
          <h2>🔄 Ciclo Pomodoro</h2>

          <div className="configuracion-opcion">
            <div>
              <label htmlFor="sesionesAntesDescansoLargo">
                Sesiones antes del descanso largo
              </label>

              <p>
                Cantidad de sesiones de concentración antes de un descanso
                largo.
              </p>
            </div>

            <div className="configuracion-input">
              <input
                id="sesionesAntesDescansoLargo"
                type="number"
                min="1"
                max="10"
                step="1"
                value={sesionesAntesDescansoLargo}
                onChange={(e) =>
                  setSesionesAntesDescansoLargo(Number(e.target.value))
                }
              />

              <span>sesiones</span>
            </div>
          </div>
        </div>

        <div className="configuracion-acciones">
          <button className="boton-secundario" onClick={volver}>
            Volver
          </button>

          <button className="boton-guardar" onClick={guardarConfiguracion}>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracionPomodoro;
