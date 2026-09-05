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

    function reproducirTono(frecuencia, inicio, duracion, tipo = "sine") {
      const oscilador = contexto.createOscillator();
      const ganancia = contexto.createGain();

      oscilador.connect(ganancia);
      ganancia.connect(contexto.destination);

      oscilador.frequency.value = frecuencia;
      oscilador.type = tipo;

      ganancia.gain.setValueAtTime(0.3, contexto.currentTime + inicio);
      ganancia.gain.exponentialRampToValueAtTime(
        0.01,
        contexto.currentTime + inicio + duracion,
      );

      oscilador.start(contexto.currentTime + inicio);
      oscilador.stop(contexto.currentTime + inicio + duracion);
    }

    switch (sonidoSeleccionado) {
      case "suave":
        reproducirTono(500, 0, 0.6);
        reproducirTono(650, 0.7, 0.6);
        break;

      case "digital":
        reproducirTono(1000, 0, 0.15, "square");
        reproducirTono(1000, 0.2, 0.15, "square");
        reproducirTono(1200, 0.4, 0.15, "square");
        reproducirTono(1000, 0.6, 0.15, "square");
        break;

      case "campana":
        reproducirTono(1200, 0, 1, "triangle");
        reproducirTono(800, 0.1, 1.2, "triangle");
        break;

      case "clasico":
      default:
        reproducirTono(800, 0, 0.4);
        reproducirTono(800, 0.5, 0.4);
        reproducirTono(1000, 1, 0.6);
        break;
    }

    setTimeout(() => {
      contexto.close();
    }, 2500);
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
