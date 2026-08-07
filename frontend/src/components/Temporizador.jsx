import { useEffect, useRef, useState } from "react";
import { crearSesion, finalizarSesion } from "../services/api";

function Temporizador({ actualizarDatos }) {
  // Temporizador
  const [tiempoRestante, setTiempoRestante] = useState(5);
  const [tiempoExtra, setTiempoExtra] = useState(0);
  const contextoAudio = useRef(null);
  const oscilador = useRef(null);
  const ganancia = useRef(null);

  // Estado
  const [modo, setModo] = useState("trabajo");
  const [activo, setActivo] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [tiempoTerminado, setTiempoTerminado] = useState(false);
  const [alarmaActiva, setAlarmaActiva] = useState(false);

  // Sesión
  const [inicio, setInicio] = useState(null);
  const [idSesion, setIdSesion] = useState(null);

  // Configuración
  const [duracionSeleccionada, setDuracionSeleccionada] = useState(5);
  const [duracionActual, setDuracionActual] = useState(5);

  // Funciones auxiliares
  function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    return `${String(minutos).padStart(2, "0")}:${String(segundosRestantes).padStart(2, "0")}`;
  }

  function calcularSegundosTranscurridos() {
    if (!inicio) return 0;

    console.log("Inicio:", inicio);
    console.log("Date.now():", Date.now());
    console.log("inicio.getTime():", inicio.getTime());

    return Math.floor((Date.now() - inicio.getTime()) / 1000);
  }

  function reiniciarEstadoTemporizador() {
    setTiempoTerminado(false);
    setTiempoExtra(0);
    setAlarmaActiva(false);
  }

  function reproducirAlarma() {
    if (contextoAudio.current) {
      return;
    }

    contextoAudio.current = new AudioContext();

    oscilador.current = contextoAudio.current.createOscillator();
    ganancia.current = contextoAudio.current.createGain();

    oscilador.current.connect(ganancia.current);
    ganancia.current.connect(contextoAudio.current.destination);

    oscilador.current.frequency.value = 800;
    oscilador.current.type = "sine";

    ganancia.current.gain.value = 0.3;

    oscilador.current.start();
  }

  function detenerAlarma() {
    if (!contextoAudio.current) {
      return;
    }

    oscilador.current.stop();

    contextoAudio.current.close();

    contextoAudio.current = null;
    oscilador.current = null;
    ganancia.current = null;
  }

  // Funciones relacionadas con sesiones
  async function iniciarTrabajo() {
    const fechaInicio = new Date();

    const sesion = await crearSesion();

    setIdSesion(sesion.id);

    setInicio(fechaInicio);

    setModo("trabajo");

    setDuracionActual(duracionSeleccionada);
    setTiempoRestante(duracionSeleccionada);

    reiniciarEstadoTemporizador();

    setActivo(true);

    setPausado(false);
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
    setAlarmaActiva(false);

    await terminarTrabajo();

    setActivo(false);
    reiniciarEstadoTemporizador();
  }

  // Manejo del temporizador
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

  // Decisiones del usuario
  function seguirTrabajando() {
    setAlarmaActiva(false);
  }

  function seguirDescansando() {
    setAlarmaActiva(false);
  }

  async function iniciarDescanso() {
    setAlarmaActiva(false);

    await terminarTrabajo();

    const descanso = 3;

    setModo("descanso");
    setDuracionActual(descanso);
    setInicio(new Date());
    setTiempoRestante(descanso);

    reiniciarEstadoTemporizador();

    setActivo(true);
  }

  async function empezarConcentracion() {
    reiniciarEstadoTemporizador();

    await iniciarTrabajo();
  }

  // Effects
  useEffect(() => {
    if (!activo || tiempoTerminado) {
      return;
    }

    const intervalo = setInterval(() => {
      const transcurrido = calcularSegundosTranscurridos();

      console.log({
        inicio,
        ahora: new Date(),
        transcurrido,
        duracionSeleccionada,
      });

      const restante = duracionActual - transcurrido;

      if (restante <= 0) {
        setTiempoRestante(0);

        setTiempoTerminado(true);
        setAlarmaActiva(true);

        return;
      }

      setTiempoRestante(restante);
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [activo, tiempoTerminado, inicio, duracionSeleccionada]);

  useEffect(() => {
    if (!activo || !tiempoTerminado) {
      return;
    }

    const intervalo = setInterval(() => {
      setTiempoExtra((anterior) => anterior + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [activo, tiempoTerminado]);

  // Alarma
  useEffect(() => {
    if (alarmaActiva) {
      reproducirAlarma();
    } else {
      detenerAlarma();
    }
  }, [alarmaActiva]);

  useEffect(() => {
    function actualizarAlVolver() {
      if (!activo || !inicio || tiempoTerminado) return;

      const transcurrido = calcularSegundosTranscurridos();
      const restante = duracionSeleccionada - transcurrido;

      if (restante <= 0) {
        setTiempoRestante(0);
        setTiempoTerminado(true);
        setAlarmaActiva(true);
        return;
      }

      setTiempoRestante(restante);
    }

    document.addEventListener("visibilitychange", actualizarAlVolver);

    return () => {
      document.removeEventListener("visibilitychange", actualizarAlVolver);
    };
  }, [activo, inicio, tiempoTerminado, duracionSeleccionada]);

  const esTrabajo = modo === "trabajo";

  const tituloDialogo = esTrabajo
    ? "Terminaste tu tiempo de concentración 🍅"
    : "Terminaste tu descanso ☕";

  const textoBotonPrincipal = esTrabajo
    ? "Iniciar descanso ☕"
    : "Empezar concentración 🍅";

  const accionBotonPrincipal = esTrabajo
    ? iniciarDescanso
    : empezarConcentracion;

  const textoBotonSecundario = esTrabajo
    ? "Seguir concentrado 💪"
    : "Seguir descansando 😌";

  const accionBotonSecundario = esTrabajo
    ? seguirTrabajando
    : seguirDescansando;

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

      {tiempoTerminado && (
        <div>
          <h3>{tituloDialogo}</h3>

          <button onClick={accionBotonPrincipal}>{textoBotonPrincipal}</button>

          <button onClick={accionBotonSecundario}>
            {textoBotonSecundario}
          </button>
        </div>
      )}
    </div>
  );
}

export default Temporizador;
