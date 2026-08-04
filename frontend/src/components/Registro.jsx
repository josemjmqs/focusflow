import { useState } from "react";
import { register } from "../services/api";

function Registro({ volverAlLogin }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function crearCuenta() {
    try {
      await register(nombre, email, password);

      alert("Cuenta creada correctamente.");

      volverAlLogin();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div>
      <h2>Crear cuenta</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <br />

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={crearCuenta}>Crear cuenta</button>

      <p>¿Ya tienes cuenta?</p>

      <button onClick={volverAlLogin}>Iniciar sesión</button>
    </div>
  );
}

export default Registro;
