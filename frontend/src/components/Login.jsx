import { useState } from "react";
import { login } from "../services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function iniciarSesion() {
    try {
      const respuesta = await login(email, password);

      if (respuesta.token) {
        localStorage.setItem("token", respuesta.token);

        onLogin();
      } else {
        alert("Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);

      alert("Error al conectar con el servidor");
    }
  }

  return (
    <div>
      <h2>Iniciar sesión</h2>

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

      <button onClick={iniciarSesion}>Iniciar sesión</button>
    </div>
  );
}

export default Login;
