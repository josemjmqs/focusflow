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

  async function iniciarTemporizador() {
    console.log("Iniciar temporizador");

    const fechaInicio = new Date();

    console.log("Llamando a crearSesion()");

    const sesion = await crearSesion();

    setIdSesion(sesion.id);

    setInicio(fechaInicio);
    setActivo(true);
  }

  useEffect(() => {
    if (!activo) {
      setTiempoRestante(duracionSeleccionada);
    }
  }, [duracionSeleccionada, activo]);

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

    async function finalizar() {
      console.log("Terminó el temporizador");

      await finalizarSesion(idSesion, 1500);

      setInicio(null);
      actualizarDatos();
      setIdSesion(null);

      setTimeout(() => {
        setTiempoRestante(duracionSeleccionada);
      }, 1000);
    }

    finalizar();
  }, [tiempoRestante]);

  return (
    <div>
      <h2>Temporizador</h2>

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
      <button onClick={iniciarTemporizador} disabled={activo}>
        {activo ? "En progreso..." : "Iniciar"}
      </button>
    </div>
  );
}

export default Temporizador;
