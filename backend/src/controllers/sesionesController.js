import pool from "../config/database.js";

export const obtenerSesiones = async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM sesiones"
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      mensaje: "Error al obtener sesiones"
    });
  }
};