import { useState } from "react";
import "./ConfiguracionSonido.css";

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

function ConfiguracionSonido({ volver }) {
  const idUsuario = obtenerIdUsuario();

  const opciones = [
    { id: "clasico", nombre: "Clásico", emoji: "🔔" },
    { id: "suave", nombre: "Suave", emoji: "🌊" },
    { id: "digital", nombre: "Digital", emoji: "⏰" },
    { id: "campana", nombre: "Campana", emoji: "🛎️" },
    { id: "silencioso", nombre: "Sin sonido", emoji: "🔇" },
  ];

  const [sonidoSeleccionado, setSonidoSeleccionado] = useState(() => {
    if (!idUsuario) {
      return "clasico";
    }

    return localStorage.getItem(`sonidoAlarma_${idUsuario}`) || "clasico";
  });

  function probarSonido() {
    if (sonidoSeleccionado === "silencioso") {
      return;
    }

    const contexto = new AudioContext();
    const oscilador = contexto.createOscillator();
    const ganancia = contexto.createGain();

    oscilador.connect(ganancia);
    ganancia.connect(contexto.destination);

    switch (sonidoSeleccionado) {
      case "suave":
        oscilador.frequency.value = 500;
        oscilador.type = "sine";
        break;

      case "digital":
        oscilador.frequency.value = 1000;
        oscilador.type = "square";
        break;

      case "campana":
        oscilador.frequency.value = 1200;
        oscilador.type = "triangle";
        break;

      case "clasico":
      default:
        oscilador.frequency.value = 800;
        oscilador.type = "sine";
        break;
    }

    ganancia.gain.value = 0.3;

    oscilador.start();

    setTimeout(() => {
      oscilador.stop();
      contexto.close();
    }, 500);
  }

  function guardarConfiguracion() {
    if (!idUsuario) {
      return;
    }

    localStorage.setItem(`sonidoAlarma_${idUsuario}`, sonidoSeleccionado);

    volver();
  }

  return (
    <div className="configuracion-sonido">
      <div className="configuracion-sonido-contenedor">
        <h2>🔔 Sonido de alarma</h2>

        <p className="configuracion-sonido-descripcion">
          Selecciona el sonido que quieres utilizar cuando termine una sesión.
        </p>

        <div className="opciones-sonido">
          {opciones.map((opcion) => (
            <button
              key={opcion.id}
              className={`opcion-sonido ${
                sonidoSeleccionado === opcion.id ? "seleccionada" : ""
              }`}
              onClick={() => setSonidoSeleccionado(opcion.id)}
            >
              <span className="opcion-sonido-emoji">{opcion.emoji}</span>

              <span>{opcion.nombre}</span>

              {sonidoSeleccionado === opcion.id && (
                <span className="opcion-sonido-check">✓</span>
              )}
            </button>
          ))}
        </div>

        <div className="botones-configuracion-sonido">
          <button className="boton-probar-sonido" onClick={probarSonido}>
            ▶ Probar sonido
          </button>
          
          <button className="boton-volver" onClick={volver}>
            Volver
          </button>

          <button className="boton-guardar" onClick={guardarConfiguracion}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracionSonido;
