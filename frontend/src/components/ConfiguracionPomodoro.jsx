import { useState } from "react";
import "./ConfiguracionPomodoro.css";

function ConfiguracionPomodoro({ volver }) {
  function obtenerIdUsuario() {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  }

  const idUsuario = obtenerIdUsuario();

  const [duracionTrabajo, setDuracionTrabajo] = useState(() => {
    if (!idUsuario) {
      return 25 * 60;
    }

    return (
      Number(localStorage.getItem(`duracionTrabajo_${idUsuario}`)) || 25 * 60
    );
  });

  const [duracionDescansoCorto, setDuracionDescansoCorto] = useState(() => {
    if (!idUsuario) {
      return 5 * 60;
    }

    return (
      Number(localStorage.getItem(`duracionDescansoCorto_${idUsuario}`)) ||
      5 * 60
    );
  });

  const [duracionDescansoLargo, setDuracionDescansoLargo] = useState(() => {
    if (!idUsuario) {
      return 15 * 60;
    }

    return (
      Number(localStorage.getItem(`duracionDescansoLargo_${idUsuario}`)) ||
      15 * 60
    );
  });

  const [sesionesAntesDescansoLargo, setSesionesAntesDescansoLargo] = useState(
    () => {
      if (!idUsuario) {
        return 4;
      }

      return (
        Number(
          localStorage.getItem(`sesionesAntesDescansoLargo_${idUsuario}`),
        ) || 4
      );
    },
  );

  const [duracionTrabajoInput, setDuracionTrabajoInput] = useState(() => {
    if (!idUsuario) {
      return "25";
    }

    const segundos =
      Number(localStorage.getItem(`duracionTrabajo_${idUsuario}`)) || 25 * 60;

    return String(segundosAMinutos(segundos));
  });

  const [duracionDescansoCortoInput, setDuracionDescansoCortoInput] = useState(
    () => {
      const segundos =
        Number(localStorage.getItem(`duracionDescansoCorto_${idUsuario}`)) ||
        5 * 60;

      return String(segundosAMinutos(segundos));
    },
  );

  const [duracionDescansoLargoInput, setDuracionDescansoLargoInput] = useState(
    () => {
      const segundos =
        Number(localStorage.getItem(`duracionDescansoLargo_${idUsuario}`)) ||
        15 * 60;

      return String(segundosAMinutos(segundos));
    },
  );

  console.log("duracionTrabajo:", duracionTrabajo);
  console.log("mostrado:", segundosAMinutos(duracionTrabajo));

  const [error, setError] = useState("");

  const SEGUNDO_EN_MINUTOS = 1 / 60;

  function segundosAMinutos(segundos) {
    return segundos / 60;
  }

  function minutosASegundos(minutos) {
    return Math.round(minutos * 60);
  }

  function guardarConfiguracion() {
    if (
      duracionTrabajo === "" ||
      duracionDescansoCorto === "" ||
      duracionDescansoLargo === "" ||
      sesionesAntesDescansoLargo === ""
    ) {
      setError("Completa todos los campos antes de guardar.");
      return;
    }

    if (duracionTrabajo < 1 || duracionTrabajo > 180 * 60) {
      setError(
        "El tiempo de concentración debe estar entre 1 segundo y 180 minutos.",
      );
      return;
    }

    if (duracionDescansoCorto < 1 || duracionDescansoCorto > 60 * 60) {
      setError("El descanso corto debe estar entre 1 segundo y 60 minutos.");
      return;
    }

    if (duracionDescansoLargo < 1 || duracionDescansoLargo > 60 * 60) {
      setError("El descanso largo debe estar entre 1 segundo y 60 minutos.");
      return;
    }

    if (sesionesAntesDescansoLargo < 1 || sesionesAntesDescansoLargo > 10) {
      setError(
        "Las sesiones antes del descanso largo deben estar entre 1 y 10.",
      );
      return;
    }

    if (!idUsuario) {
      setError("No se pudo identificar al usuario.");
      return;
    }

    setError("");

    localStorage.setItem(`duracionTrabajo_${idUsuario}`, duracionTrabajo);

    localStorage.setItem(
      `duracionDescansoCorto_${idUsuario}`,
      duracionDescansoCorto,
    );

    localStorage.setItem(
      `duracionDescansoLargo_${idUsuario}`,
      duracionDescansoLargo,
    );

    localStorage.setItem(
      `sesionesAntesDescansoLargo_${idUsuario}`,
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
              <div className="campo-duracion">
                <input
                  id="duracionTrabajo"
                  type="number"
                  min="0.0166666667"
                  max="180"
                  step="any"
                  value={duracionTrabajoInput}
                  onChange={(e) => {
                    const valor = e.target.value;

                    setDuracionTrabajoInput(valor);

                    if (valor === "") {
                      setDuracionTrabajo("");
                      return;
                    }

                    setDuracionTrabajo(minutosASegundos(Number(valor)));
                  }}
                />

                <div className="botones-duracion">
                  <button
                    type="button"
                    onClick={() => {
                      setDuracionTrabajo((valor) => {
                        const nuevoValor = Math.min(
                          valor === "" ? 1 : valor + 1,
                          180 * 60,
                        );

                        setDuracionTrabajoInput(
                          String(segundosAMinutos(nuevoValor)),
                        );

                        return nuevoValor;
                      });
                    }}
                  >
                    ▲
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDuracionTrabajo((valor) => {
                        const nuevoValor = Math.max(
                          valor === "" ? 1 : valor - 1,
                          1,
                        );

                        setDuracionTrabajoInput(
                          String(segundosAMinutos(nuevoValor)),
                        );

                        return nuevoValor;
                      });
                    }}
                  >
                    ▼
                  </button>
                </div>
              </div>

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
              <div className="campo-duracion">
                <input
                  id="duracionDescansoCorto"
                  type="number"
                  min="0.0166666667"
                  max="60"
                  step="any"
                  value={duracionDescansoCortoInput}
                  onChange={(e) => {
                    const valor = e.target.value;

                    setDuracionDescansoCortoInput(valor);

                    if (valor === "") {
                      setDuracionDescansoCorto("");
                      return;
                    }

                    setDuracionDescansoCorto(minutosASegundos(Number(valor)));
                  }}
                />

                <div className="botones-duracion">
                  <button
                    type="button"
                    onClick={() => {
                      setDuracionDescansoCorto((valor) => {
                        const nuevoValor = Math.min(
                          valor === "" ? 1 : valor + 1,
                          60 * 60,
                        );

                        setDuracionDescansoCortoInput(
                          String(segundosAMinutos(nuevoValor)),
                        );

                        return nuevoValor;
                      });
                    }}
                  >
                    ▲
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDuracionDescansoCorto((valor) => {
                        const nuevoValor = Math.max(
                          valor === "" ? 1 : valor - 1,
                          1,
                        );

                        setDuracionDescansoCortoInput(
                          String(segundosAMinutos(nuevoValor)),
                        );

                        return nuevoValor;
                      });
                    }}
                  >
                    ▼
                  </button>
                </div>
              </div>

              <span>min</span>
            </div>
          </div>

          <div className="configuracion-opcion">
            <div>
              <label htmlFor="duracionDescansoLargo">Descanso largo</label>

              <p>Descanso después de completar el ciclo.</p>
            </div>

            <div className="configuracion-input">
              <div className="campo-duracion">
                <input
                  id="duracionDescansoLargo"
                  type="number"
                  min="0.0166666667"
                  max="60"
                  step="any"
                  value={duracionDescansoLargoInput}
                  onChange={(e) => {
                    const valor = e.target.value;

                    setDuracionDescansoLargoInput(valor);

                    if (valor === "") {
                      setDuracionDescansoLargo("");
                      return;
                    }

                    setDuracionDescansoLargo(minutosASegundos(Number(valor)));
                  }}
                />

                <div className="botones-duracion">
                  <button
                    type="button"
                    onClick={() => {
                      setDuracionDescansoLargo((valor) => {
                        const nuevoValor = Math.min(
                          valor === "" ? 1 : valor + 1,
                          60 * 60,
                        );

                        setDuracionDescansoLargoInput(
                          String(segundosAMinutos(nuevoValor)),
                        );

                        return nuevoValor;
                      });
                    }}
                  >
                    ▲
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDuracionDescansoLargo((valor) => {
                        const nuevoValor = Math.max(
                          valor === "" ? 1 : valor - 1,
                          1,
                        );

                        setDuracionDescansoLargoInput(
                          String(segundosAMinutos(nuevoValor)),
                        );

                        return nuevoValor;
                      });
                    }}
                  >
                    ▼
                  </button>
                </div>
              </div>

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
                  setSesionesAntesDescansoLargo(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />

              <span>sesiones</span>
            </div>
          </div>
        </div>

        {error && <p className="configuracion-error">{error}</p>}

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
