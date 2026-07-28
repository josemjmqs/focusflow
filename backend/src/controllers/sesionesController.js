import pool from "../config/database.js";

export const obtenerSesiones = async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT *
      FROM sesiones
      ORDER BY inicio DESC`,
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      mensaje: "Error al obtener sesiones",
    });
  }
};

export const crearSesion = async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM sesiones WHERE estado = $1",
      ["en_progreso"],
    );

    if (resultado.rows.length > 0) {
      return res.status(409).json({
        mensaje: "Ya existe una sesión en progreso",
      });
    }

    const inicio = new Date();
    const estado = "en_progreso";

    const nuevaSesion = await pool.query(
      `INSERT INTO sesiones (inicio, estado)
       VALUES ($1, $2)
       RETURNING *`,
      [inicio, estado],
    );

    res.status(201).json(nuevaSesion.rows[0]);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      mensaje: "Error al crear la sesión",
    });
  }
};

export const finalizarSesion = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query("SELECT * FROM sesiones WHERE id = $1", [
      id,
    ]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "La sesión no existe",
      });
    }

    const sesion = resultado.rows[0];

    if (sesion.estado !== "en_progreso") {
      return res.status(409).json({
        mensaje: "La sesión no está en progreso",
      });
    }

    const fin = new Date();

    const duracion = Math.floor((fin - sesion.inicio) / 1000);

    const resultadoActualizado = await pool.query(
      `UPDATE sesiones
      SET fin = $1,
          duracion = $2,
          estado = $3
      WHERE id = $4
      RETURNING *`,
      [fin, duracion, "completada", id],
    );

    res.json(resultadoActualizado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al finalizar la sesión",
    });
  }
};

export const cancelarSesion = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query("SELECT * FROM sesiones WHERE id = $1", [
      id,
    ]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "La sesión no existe",
      });
    }

    const sesion = resultado.rows[0];

    if (sesion.estado === "cancelada") {
      return res.status(409).json({
        mensaje: "La sesión ya está cancelada",
      });
    }

    if (sesion.estado !== "completada") {
      return res.status(409).json({
        mensaje: "Solo se pueden cancelar sesiones completadas",
      });
    }

    const resultadoActualizado = await pool.query(
      `UPDATE sesiones
    SET estado = $1
    WHERE id = $2
    RETURNING *`,
      ["cancelada", id],
    );

    res.json(resultadoActualizado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al cancelar la sesión",
    });
  }
};
