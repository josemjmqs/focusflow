import { useEffect, useRef, useState } from "react";
import {
  crearSesion,
  finalizarSesion,
  obtenerSesionEnProgreso,
} from "../services/api";
import "./Temporizador.css";

function Temporizador({ actualizarDatos }) {
  // Temporizador
  const [tiempoRestante, setTiempoRestante] = useState(5);
  const [inicioTiempoExtra, setInicioTiempoExtra] = useState(null);
  const contextoAudio = useRef(null);
  const oscilador = useRef(null);
  const ganancia = useRef(null);

  // Estado
  const [modo, setModo] = useState("trabajo");
  const [activo, setActivo] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [tiempoTerminado, setTiempoTerminado] = useState(false);
  const [alarmaActiva, setAlarmaActiva] = useState(false);
  const [error, setError] = useState("");

  // Sesión
  const [inicioSesion, setInicioSesion] = useState(null);
  const [inicioTemporizador, setInicioTemporizador] = useState(null);
  const [duracionActual, setDuracionActual] = useState(0);
  const [tiempoAcumulado, setTiempoAcumulado] = useState(0);
  const [tiempoExtraAcumulado, setTiempoExtraAcumulado] = useState(0);
  const [idSesion, setIdSesion] = useState(null);
  const [iniciando, setIniciando] = useState(false);
  const [terminando, setTerminando] = useState(false);

  // Configuración
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

  // Funciones auxiliares
  function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    return `${String(minutos).padStart(2, "0")}:${String(segundosRestantes).padStart(2, "0")}`;
  }

  function obtenerDuracionDescanso() {
    return duracionDescansoCorto * 60;
  }

  function calcularSegundosTranscurridos() {
    if (!inicioTemporizador) {
      return tiempoAcumulado;
    }

    return (
      tiempoAcumulado +
      Math.floor((Date.now() - inicioTemporizador.getTime()) / 1000)
    );
  }

  function calcularSegundosExtraTranscurridos() {
    if (!inicioTiempoExtra) {
      return tiempoExtraAcumulado;
    }

    return (
      tiempoExtraAcumulado +
      Math.floor((Date.now() - inicioTiempoExtra.getTime()) / 1000)
    );
  }

  function terminarTemporizador(momentoFinalizacion) {
    setTiempoRestante(0);
    setTiempoTerminado(true);
    setAlarmaActiva(true);
    setInicioTiempoExtra(momentoFinalizacion);
  }

  function reiniciarEstadoTemporizador() {
    setTiempoTerminado(false);
    setTiempoExtraAcumulado(0);
    setInicioTiempoExtra(null);
    setAlarmaActiva(false);
  }

  function cambiarDuracionTrabajo(valor) {
    const duracion = Number(valor);

    setDuracionTrabajo(duracion);
    localStorage.setItem("duracionTrabajo", duracion);
  }

  function cambiarDuracionDescansoCorto(valor) {
    const duracion = Number(valor);

    setDuracionDescansoCorto(duracion);
    localStorage.setItem("duracionDescansoCorto", duracion);
  }

  function cambiarDuracionDescansoLargo(valor) {
    const duracion = Number(valor);

    setDuracionDescansoLargo(duracion);
    localStorage.setItem("duracionDescansoLargo", duracion);
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

    const duracion = duracionTrabajo * 60;

    const sesion = await crearSesion(duracion);

    setIdSesion(sesion.id);

    setInicioSesion(fechaInicio);
    setInicioTemporizador(fechaInicio);
    setTiempoAcumulado(0);
    setDuracionActual(duracion);

    setModo("trabajo");
    setTiempoRestante(duracion);

    reiniciarEstadoTemporizador();

    setActivo(true);
    setPausado(false);
  }

  async function terminarTrabajo() {
    if (!idSesion || !inicioSesion) {
      return;
    }

    const duracion = calcularSegundosTranscurridos();

    await finalizarSesion(idSesion, duracion);

    setInicioSesion(null);
    setInicioTemporizador(null);
    setTiempoAcumulado(0);
    setDuracionActual(0);
    setIdSesion(null);

    actualizarDatos();
  }

  async function terminarSesionManual() {
    setTerminando(true);

    try {
      setError("");
      setAlarmaActiva(false);

      await terminarTrabajo();

      setActivo(false);
      reiniciarEstadoTemporizador();
    } catch (error) {
      setError(error.message);
    } finally {
      setTerminando(false);
    }
  }

  // Manejo del temporizador
  async function iniciarTemporizador() {
    setIniciando(true);

    try {
      setError("");

      await iniciarTrabajo();
    } catch (error) {
      if (error.message === "Ya existe una sesión en progreso") {
        try {
          const sesion = await obtenerSesionEnProgreso();

          if (!sesion) {
            setError("No se encontró la sesión en progreso.");
            return;
          }

          setSesionEnProgreso(sesion);
        } catch (error) {
          setError(error.message);
        }

        return;
      }

      setError(error.message);
    } finally {
      setIniciando(false);
    }
  }

  function pausarTemporizador() {
    if (tiempoTerminado) {
      const transcurrido = calcularSegundosExtraTranscurridos();

      setTiempoExtraAcumulado(transcurrido);
      setInicioTiempoExtra(null);
    } else {
      const transcurrido = calcularSegundosTranscurridos();

      setTiempoAcumulado(transcurrido);
      setInicioTemporizador(null);
    }

    setActivo(false);
    setPausado(true);
    setAlarmaActiva(false);
  }

  function reanudarTemporizador() {
    if (tiempoTerminado) {
      setInicioTiempoExtra(new Date());
    } else {
      setInicioTemporizador(new Date());
    }

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
    setTerminando(true);

    try {
      setAlarmaActiva(false);

      await terminarTrabajo();

      const duracionDescanso = obtenerDuracionDescanso(duracionActual);
      const ahora = new Date();

      setModo("descanso");
      setInicioTemporizador(ahora);
      setDuracionActual(duracionDescanso);
      setTiempoRestante(duracionDescanso);

      reiniciarEstadoTemporizador();

      setActivo(true);
      setPausado(false);
    } finally {
      setTerminando(false);
    }
  }

  // Effects
  useEffect(() => {
    if (!activo || tiempoTerminado || !inicioTemporizador) {
      return;
    }

    const intervalo = setInterval(() => {
      const transcurrido = calcularSegundosTranscurridos();
      const restante = duracionActual - transcurrido;

      if (restante <= 0) {
        const exceso = transcurrido - duracionActual;

        const momentoFinalizacion = new Date(Date.now() - exceso * 1000);

        terminarTemporizador(momentoFinalizacion);
        return;
      }

      setTiempoRestante(restante);
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [activo, tiempoTerminado, inicioTemporizador, duracionActual]);

  useEffect(() => {
    if (!activo || !tiempoTerminado || !inicioTiempoExtra) {
      return;
    }

    const actualizarTiempoExtra = () => {
      setTiempoExtraAcumulado(calcularSegundosExtraTranscurridos());
    };

    actualizarTiempoExtra();

    const intervalo = setInterval(actualizarTiempoExtra, 1000);

    return () => clearInterval(intervalo);
  }, [activo, tiempoTerminado, inicioTiempoExtra]);

  useEffect(() => {
    async function recuperarSesion() {
      try {
        const sesion = await obtenerSesionEnProgreso();

        if (!sesion) {
          return;
        }

        const inicio = new Date(sesion.inicio);
        const duracion = sesion.duracion_objetivo;

        setIdSesion(sesion.id);
        setInicioSesion(inicio);
        setInicioTemporizador(inicio);
        setTiempoAcumulado(0);
        setDuracionActual(duracion);
        setModo("trabajo");
        setTiempoTerminado(false);
        setTiempoExtraAcumulado(0);
        setAlarmaActiva(false);
        setPausado(false);
        setActivo(true);

        const transcurrido = Math.floor((Date.now() - inicio.getTime()) / 1000);

        const restante = duracion - transcurrido;

        if (restante <= 0) {
          setTiempoRestante(0);
          setTiempoTerminado(true);
          setAlarmaActiva(true);

          const momentoFinalizacion = new Date(
            inicio.getTime() + duracion * 1000,
          );

          setInicioTiempoExtra(momentoFinalizacion);

          return;
        }

        setTiempoRestante(restante);
      } catch (error) {
        setError(error.message);
      }
    }

    recuperarSesion();
  }, []);

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
      if (!activo) {
        return;
      }

      if (tiempoTerminado && inicioTiempoExtra) {
        setTiempoExtraAcumulado(calcularSegundosExtraTranscurridos());
        return;
      }

      if (!inicioTemporizador || tiempoTerminado) {
        return;
      }

      const transcurrido = calcularSegundosTranscurridos();
      const restante = duracionActual - transcurrido;

      if (restante <= 0) {
        terminarTemporizador();
        return;
      }

      setTiempoRestante(restante);
    }

    document.addEventListener("visibilitychange", actualizarAlVolver);

    return () => {
      document.removeEventListener("visibilitychange", actualizarAlVolver);
    };
  }, [
    activo,
    inicioTemporizador,
    inicioTiempoExtra,
    tiempoTerminado,
    duracionActual,
  ]);

  const esTrabajo = modo === "trabajo";

  const tituloDialogo = esTrabajo
    ? "Terminaste tu tiempo de concentración 🧑‍💻"
    : "Terminaste tu descanso 🧘";

  const textoBotonPrincipal = esTrabajo
    ? "Iniciar descanso 🧘"
    : "Iniciar concentración 🧑‍💻";

  const accionBotonPrincipal = esTrabajo
    ? iniciarDescanso
    : iniciarTemporizador;

  const textoBotonSecundario = esTrabajo
    ? "Seguir concentrado 🧑‍💻"
    : "Seguir descansando 🧘";

  const accionBotonSecundario = esTrabajo
    ? seguirTrabajando
    : seguirDescansando;

  return (
    <div>
      <h3>{modo === "trabajo" ? "🧑‍💻 Trabajo" : "🧘 Descanso"}</h3>
      <div className="temporizador-tiempo">
        {tiempoTerminado ? (
          <div className="tiempo-extra">
            <span>Tiempo extra</span>
            <h1>+{formatearTiempo(tiempoExtraAcumulado)}</h1>
          </div>
        ) : (
          <h1>{formatearTiempo(tiempoRestante)}</h1>
        )}
      </div>

      <label htmlFor="duracionTrabajo">Tiempo de concentración:</label>

      <input
        id="duracionTrabajo"
        type="number"
        min="1"
        max="180"
        value={duracionTrabajo}
        onChange={(e) => cambiarDuracionTrabajo(e.target.value)}
        disabled={activo}
      />

      <span>minutos</span>
      <label htmlFor="duracionDescansoCorto">Descanso corto:</label>

      <input
        id="duracionDescansoCorto"
        type="number"
        min="1"
        max="60"
        value={duracionDescansoCorto}
        onChange={(e) => cambiarDuracionDescansoCorto(e.target.value)}
        disabled={activo}
      />

      <span>minutos</span>

      <label htmlFor="duracionDescansoLargo">Descanso largo:</label>

      <input
        id="duracionDescansoLargo"
        type="number"
        min="1"
        max="60"
        value={duracionDescansoLargo}
        onChange={(e) => cambiarDuracionDescansoLargo(e.target.value)}
        disabled={activo}
      />

      <span>minutos</span>
      {!activo && !pausado && (
        <button onClick={iniciarTemporizador} disabled={iniciando}>
          {iniciando ? "Iniciando..." : "Iniciar"}
        </button>
      )}

      {activo && <button onClick={pausarTemporizador}>⏸ Pausar</button>}

      {!activo && pausado && (
        <button onClick={reanudarTemporizador}>▶ Reanudar</button>
      )}

      {idSesion && (
        <button onClick={terminarSesionManual} disabled={terminando}>
          {terminando ? "Terminando..." : "Terminar sesión"}
        </button>
      )}

      {error && (
        <p
          style={{
            color: "#b91c1c",
            backgroundColor: "#fee2e2",
            padding: "10px 14px",
            borderRadius: "6px",
            margin: "10px 0",
          }}
        >
          {error}
        </p>
      )}

      {tiempoTerminado && (
        <div>
          <h3>{tituloDialogo}</h3>

          <button onClick={accionBotonPrincipal} disabled={terminando}>
            {terminando && !esTrabajo ? "Procesando..." : textoBotonPrincipal}
          </button>

          <button onClick={accionBotonSecundario}>
            {textoBotonSecundario}
          </button>
        </div>
      )}
    </div>
  );
}

export default Temporizador;
