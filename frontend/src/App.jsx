import Estadisticas from "./components/Estadisticas";
import Historial from "./components/Historial";
import Temporizador from "./components/Temporizador";
import { useState } from "react";

function App() {
  const [actualizar, setActualizar] = useState(0);

  const actualizarDatos = () => {
    setActualizar((anterior) => anterior + 1);
  };

  return (
    <>
      <h1>FocusFlow</h1>

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
