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

  async function iniciarTrabajo() {
    const fechaInicio = new Date();

    const sesion = await crearSesion();

    setIdSesion(sesion.id);

    setInicio(fechaInicio);

    setModo("trabajo");

    setTiempoRestante(duracionSeleccionada);

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
    if (!activo) {
      return;
    }

    const intervalo = setInterval(() => {
      setTiempoRestante((anterior) => {
        if (anterior <= 1) {
          clearInterval(intervalo);
          setActivo(false);

          return 0;
        }

        return anterior - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [activo]);

  useEffect(() => {
    if (tiempoRestante !== 0) {
      return;
    }

    async function finalizarTemporizador() {
      console.log("Terminó el temporizador");

      reproducirAlarma();

      if (modo === "trabajo") {
        const duracion = duracionSeleccionada - tiempoRestante;

        await finalizarSesion(idSesion, duracion);

        setInicio(null);
        actualizarDatos();
        setIdSesion(null);

        setModo("descanso");
        setTiempoRestante(3);
        setActivo(true);

        setTimeout(() => {
          setTiempoRestante(3);
          setActivo(true);
        }, 1000);
      } else {
        setTimeout(() => {
          iniciarTrabajo();
        }, 1000);
      }
    }

    finalizarTemporizador();
  }, [tiempoRestante, modo, idSesion]);

  return (
    <div>
      <h2>Temporizador</h2>
      <h3>{modo === "trabajo" ? "🍅 Trabajo" : "☕ Descanso"}</h3>
      <h1>{formatearTiempo(tiempoRestante)}</h1>

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
    </div>
  );
}

export default Temporizador;
