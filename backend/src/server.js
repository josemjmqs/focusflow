import app from "./app.js";
import pool from "./config/database.js";

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Conectado correctamente a PostgreSQL");

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con PostgreSQL:", error.message);
  }
}

iniciarServidor();