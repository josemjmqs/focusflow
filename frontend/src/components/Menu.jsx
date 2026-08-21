import { useState } from "react";

function Menu({ mostrarHistorial, mostrarConfiguracion, cerrarSesion }) {
  const [abierto, setAbierto] = useState(false);

  function manejarHistorial() {
    mostrarHistorial();
    setAbierto(false);
  }

  function manejarCerrarSesion() {
    cerrarSesion();
    setAbierto(false);
  }

  return (
    <div className="menu">
      <button
        className="boton-menu"
        onClick={() => setAbierto(!abierto)}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {abierto && (
        <div className="menu-desplegable">
          <button onClick={manejarHistorial}>Historial</button>
          <button onClick={mostrarConfiguracion}>Configuración Pomodoro</button>
          <button onClick={manejarCerrarSesion}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

export default Menu;
