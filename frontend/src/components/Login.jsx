import { useState } from "react";
import { login } from "../services/api";

function Login({ onLogin, crearCuenta }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function iniciarSesion() {
    try {
      const respuesta = await login(email, password);

      localStorage.setItem("token", respuesta.token);

      onLogin();
    } catch (error) {
      alert(error.message);
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

      <p>¿No tienes cuenta?</p>
      <button
        onClick={() => {
          console.log("Crear cuenta");
          crearCuenta();
        }}
      >
        Crear cuenta
      </button>
    </div>
  );
}

export default Login;
