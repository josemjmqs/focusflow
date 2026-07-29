import { useEffect, useState } from "react";
import { crearSesion, finalizarSesion } from "../services/api";

function Temporizador({ actualizarDatos }) {
  const [tiempoRestante, setTiempoRestante] = useState(5);
  const [activo, setActivo] = useState(false);
  const [inicio, setInicio] = useState(null);
  const [idSesion, setIdSesion] = useState(null);

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
        setTiempoRestante(5);
      }, 1000);
    }

    finalizar();
  }, [tiempoRestante]);

  return (
    <div>
      <h2>Temporizador</h2>

      <h1>{tiempoRestante}</h1>

      <button onClick={() => iniciarTemporizador()}>Iniciar</button>
    </div>
  );
}

export default Temporizador;
