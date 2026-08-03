import Estadisticas from "./components/Estadisticas";
import Historial from "./components/Historial";
import Temporizador from "./components/Temporizador";
import Login from "./components/Login";
import { useState } from "react";

function App() {
  const [actualizar, setActualizar] = useState(0);

  const [autenticado, setAutenticado] = useState(
    localStorage.getItem("token") !== null,
  );

  const actualizarDatos = () => {
    setActualizar((anterior) => anterior + 1);
  };

  function manejarLogin() {
    setAutenticado(true);
  }

  function cerrarSesion() {
    localStorage.removeItem("token");
    setAutenticado(false);
  }

  if (!autenticado) {
    return <Login onLogin={manejarLogin} />;
  }

  return (
    <>
      <h1>FocusFlow</h1>

      <button onClick={cerrarSesion}>Cerrar sesión</button>

      <Temporizador actualizarDatos={actualizarDatos} />

      <Estadisticas actualizar={actualizar} />

      <Historial
        actualizar={actualizar}
        cambiarActualizacion={actualizarDatos}
      />
    </>
  );
}

export default App;
