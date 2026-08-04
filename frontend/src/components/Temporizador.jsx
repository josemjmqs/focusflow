import { useEffect, useState } from "react";
import { crearSesion, finalizarSesion } from "../services/api";

function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  return `${String(minutos).padStart(2, "0")}:${String(segundosRestantes).padStart(2, "0")}`;
}

function Temporizador({ actualizarDatos }) {
  const [tiempoRestante, setTiempoRestante] = useState(5);
  const [activo, setActivo] = useState(false);
  const [inicio, setInicio] = useState(null);
  const [idSesion, setIdSesion] = useState(null);
  const [duracionSeleccionada, setDuracionSeleccionada] = useState(5);
  const [modo, setModo] = useState("trabajo");
  const [pausado, setPausado] = useState(false);
  const [tiempoTerminado, setTiempoTerminado] = useState(false);
  const [tiempoExtra, setTiempoExtra] = useState(0);
  const [alarmaActiva, setAlarmaActiva] = useState(false);

  async function iniciarTrabajo() {
    const fechaInicio = new Date();

    const sesion = await crearSesion();

    setIdSesion(sesion.id);

    setInicio(fechaInicio);

    setModo("trabajo");
    setTiempoRestante(duracionSeleccionada);

    setTiempoTerminado(false);
    setTiempoExtra(0);
    setAlarmaActiva(false);

    setActivo(true);

    setPausado(false);
  }

  async function iniciarTemporizador() {
    console.log("Iniciar temporizador");

    await iniciarTrabajo();
  }

  function pausarTemporizador() {
    setActivo(false);
    setPausado(true);
  }

  function reanudarTemporizador() {
    setActivo(true);
    setPausado(false);
  }

  function seguirTrabajando() {
    setAlarmaActiva(false);
  }

  function seguirDescansando() {
    setAlarmaActiva(false);
  }

  async function empezarConcentracion() {
    setTiempoTerminado(false);
    setAlarmaActiva(false);
    setTiempoExtra(0);

    await iniciarTrabajo();
  }

  async function terminarTrabajo() {
    if (!idSesion || !inicio) {
      return;
    }

    const fin = new Date();

    const duracion = Math.floor((fin - inicio) / 1000);

    await finalizarSesion(idSesion, duracion);

    setInicio(null);
    setIdSesion(null);

    actualizarDatos();
  }

  async function terminarSesionManual() {
    await terminarTrabajo();

    setActivo(false);
    setTiempoTerminado(false);
    setTiempoExtra(0);
  }

  async function iniciarDescanso() {
    await terminarTrabajo();

    setModo("descanso");
    setTiempoTerminado(false);
    setAlarmaActiva(false);
    setTiempoExtra(0);
    setTiempoRestante(3);
    setActivo(true);
  }

  function reproducirAlarma() {
    const contexto = new AudioContext();

    const oscilador = contexto.createOscillator();
    const ganancia = contexto.createGain();

    oscilador.connect(ganancia);
    ganancia.connect(contexto.destination);

    oscilador.frequency.value = 800; // tono
    oscilador.type = "sine";

    ganancia.gain.value = 0.3;

    oscilador.start();

    setTimeout(() => {
      oscilador.stop();
      contexto.close();
    }, 1000);
  }

  useEffect(() => {
    if (tiempoRestante === 0) {
      reproducirAlarma();
    }
  }, [tiempoRestante]);

  useEffect(() => {
    if (!activo || tiempoTerminado) {
      return;
    }

    const intervalo = setInterval(() => {
      setTiempoRestante((anterior) => {
        if (anterior <= 1) {
          setTiempoTerminado(true);
          setAlarmaActiva(true);
          setActivo(true);

          return 0;
        }

        return anterior - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [activo, tiempoTerminado]);

  useEffect(() => {
    if (!activo || !tiempoTerminado) {
      return;
    }

    const intervalo = setInterval(() => {
      setTiempoExtra((anterior) => anterior + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [activo, tiempoTerminado]);

  return (
    <div>
      <h2>Temporizador</h2>
      <h3>{modo === "trabajo" ? "🍅 Trabajo" : "☕ Descanso"}</h3>
      <h1>
        {tiempoTerminado
          ? `+${formatearTiempo(tiempoExtra)}`
          : formatearTiempo(tiempoRestante)}
      </h1>

      <label htmlFor="duracion">Duración:</label>

      <select
        id="duracion"
        value={duracionSeleccionada}
        onChange={(e) => setDuracionSeleccionada(Number(e.target.value))}
        disabled={activo}
      >
        <option value={5}>5 segundos</option>
        <option value={1500}>25 minutos</option>
        <option value={2700}>45 minutos</option>
      </select>
      {!activo && !pausado && (
        <button onClick={iniciarTemporizador}>Iniciar</button>
      )}

      {activo && <button onClick={pausarTemporizador}>⏸ Pausar</button>}

      {!activo && pausado && (
        <button onClick={reanudarTemporizador}>▶ Reanudar</button>
      )}

      {idSesion && (
        <button onClick={terminarSesionManual}>Terminar sesión</button>
      )}

      {tiempoTerminado && modo === "trabajo" && (
        <div>
          <h3>Terminaste tu tiempo de concentración 🍅</h3>

          <button onClick={iniciarDescanso}>Iniciar descanso ☕</button>

          <button onClick={seguirTrabajando}>Seguir concentrado 💪</button>
        </div>
      )}

      {tiempoTerminado && modo === "descanso" && (
        <div>
          <h3>Terminó tu descanso ☕</h3>

          <button onClick={empezarConcentracion}>
            🍅 Empezar concentración
          </button>

          <button onClick={seguirDescansando}>😌 Seguir descansando</button>
        </div>
      )}
    </div>
  );
}

export default Temporizador;
