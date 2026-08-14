import Estadisticas from "./components/Estadisticas";
import Historial from "./components/Historial";
import Temporizador from "./components/Temporizador";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Menu from "./components/Menu";
import { useState, useEffect } from "react";
import {
  obtenerSesionEnProgreso,
  cancelarSesionEnProgreso,
  finalizarSesion,
} from "./services/api";
import "./App.css";

function App() {
  const [actualizar, setActualizar] = useState(0);

  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const [autenticado, setAutenticado] = useState(
    localStorage.getItem("token") !== null,
  );

  const [sesionPendiente, setSesionPendiente] = useState(null);

  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const actualizarDatos = () => {
    setActualizar((anterior) => anterior + 1);
  };

  function manejarLogin() {
    setAutenticado(true);
  }

  useEffect(() => {
    if (autenticado) {
      obtenerSesionEnProgreso().then((sesion) => {
        setSesionPendiente(sesion);
      });
    }
  }, [autenticado]);

  async function manejarCancelarSesion() {
    await cancelarSesionEnProgreso(sesionPendiente.id);

    setSesionPendiente(null);
  }

  async function manejarCompletarSesion() {
    await finalizarSesion(sesionPendiente.id, 1500);

    setSesionPendiente(null);
    actualizarDatos();
  }

  function cerrarSesion() {
    localStorage.removeItem("token");
    setAutenticado(false);
  }

  if (!autenticado) {
    if (mostrarRegistro) {
      return <Registro volverAlLogin={() => setMostrarRegistro(false)} />;
    }

    return (
      <Login
        onLogin={manejarLogin}
        crearCuenta={() => setMostrarRegistro(true)}
      />
    );
  }

  if (sesionPendiente) {
    return (
      <>
        <h1>FocusFlow</h1>

        <p>
          Encontramos una sesión pendiente iniciada el:{" "}
          {new Date(sesionPendiente.inicio).toLocaleString()}
        </p>

        <button onClick={manejarCompletarSesion}>Completar sesión</button>

        <button onClick={manejarCancelarSesion}>Cancelar sesión</button>
      </>
    );
  }

  if (mostrarHistorial) {
    return (
      <>
        <h1>FocusFlow</h1>

        <button onClick={() => setMostrarHistorial(false)}>Volver</button>

        <Historial
          actualizar={actualizar}
          cambiarActualizacion={actualizarDatos}
        />
      </>
    );
  }

  return (
    <>
      <div className="encabezado">
        <h1>FocusFlow</h1>

        <div className="menu">
          <Menu
            mostrarHistorial={() => setMostrarHistorial(true)}
            cerrarSesion={cerrarSesion}
          />
        </div>
      </div>

      <Temporizador actualizarDatos={actualizarDatos} />

      <Estadisticas actualizar={actualizar} />
    </>
  );
}

export default App;
