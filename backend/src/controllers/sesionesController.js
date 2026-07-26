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

export const crearSesion = async (req, res) => {
  try {
    const { inicio, fin, duracion, estado } = req.body;

    const resultado = await pool.query(
      `INSERT INTO sesiones (inicio, fin, duracion, estado)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [inicio, fin, duracion, estado]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      mensaje: "Error al crear la sesión"
    });
  }
};