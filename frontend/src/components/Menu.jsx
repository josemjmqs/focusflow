import { useState } from "react";

function Menu({ mostrarHistorial, cerrarSesion }) {
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
    <div>
      <button onClick={() => setAbierto(!abierto)}>⋮</button>

      {abierto && (
        <div>
          <button onClick={manejarHistorial}>Historial</button>

          <button onClick={manejarCerrarSesion}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

export default Menu;