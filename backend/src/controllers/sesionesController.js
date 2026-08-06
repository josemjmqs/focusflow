import pool from "../config/database.js";

export const obtenerSesiones = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const resultado = await pool.query(
      `SELECT *
       FROM sesiones
       WHERE usuario_id = $1
       ORDER BY inicio DESC`,
      [usuarioId],
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
  const usuarioId = req.usuario.id;

  try {
    const resultado = await pool.query(
      `SELECT *
      FROM sesiones
      WHERE usuario_id = $1
      AND estado = $2`,
      [usuarioId, "en_progreso"],
    );

    if (resultado.rows.length > 0) {
      return res.status(409).json({
        mensaje: "Ya existe una sesión en progreso",
      });
    }

    const inicio = new Date();
    const estado = "en_progreso";

    const nuevaSesion = await pool.query(
      `INSERT INTO sesiones (
        usuario_id,
        inicio,
        estado
      )
      VALUES ($1, $2, $3)
      RETURNING *`,
      [usuarioId, inicio, estado],
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
    const { duracion } = req.body;

    const usuarioId = req.usuario.id;

    const resultado = await pool.query(
      `SELECT *
      FROM sesiones
      WHERE id = $1
      AND usuario_id = $2`,
      [id, usuarioId],
    );

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

    const resultadoActualizado = await pool.query(
      `UPDATE sesiones
      SET fin = $1,
          duracion = $2,
          estado = $3
      WHERE id = $4
      AND usuario_id = $5
      RETURNING *`,
      [fin, duracion, "completada", id, usuarioId],
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
    const usuarioId = req.usuario.id;

    const resultado = await pool.query(
      `SELECT *
       FROM sesiones
       WHERE id = $1
       AND usuario_id = $2`,
      [id, usuarioId],
    );

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
       AND usuario_id = $3
       RETURNING *`,
      ["cancelada", id, usuarioId],
    );

    res.json(resultadoActualizado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al cancelar la sesión",
    });
  }
};

export const cancelarSesionEnProgreso = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const resultado = await pool.query(
      `
      SELECT *
      FROM sesiones
      WHERE id = $1
      AND usuario_id = $2
      `,
      [id, usuarioId],
    );

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

    if (sesion.estado !== "en_progreso") {
      return res.status(409).json({
        mensaje: "Solo se pueden cancelar sesiones en progreso",
      });
    }

    const resultadoActualizado = await pool.query(
      `
      UPDATE sesiones
      SET estado = 'cancelada'
      WHERE id = $1
      AND usuario_id = $2
      RETURNING *
      `,
      [id, usuarioId],
    );

    res.json(resultadoActualizado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al cancelar la sesión",
    });
  }
};

export const restaurarSesion = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const resultado = await pool.query(
      `SELECT *
       FROM sesiones
       WHERE id = $1
       AND usuario_id = $2`,
      [id, usuarioId],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensaje: "La sesión no existe",
      });
    }

    const sesion = resultado.rows[0];

    if (sesion.estado !== "cancelada") {
      return res.status(409).json({
        mensaje: "Solo se pueden restaurar sesiones canceladas",
      });
    }

    const resultadoActualizado = await pool.query(
      `UPDATE sesiones
       SET estado = $1
       WHERE id = $2
       AND usuario_id = $3
       RETURNING *`,
      ["completada", id, usuarioId],
    );

    res.json(resultadoActualizado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al restaurar la sesión",
    });
  }
};

export const obtenerSesionEnProgreso = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const resultado = await pool.query(
      `
      SELECT *
      FROM sesiones
      WHERE usuario_id = $1
      AND estado = $2
      `,
      [usuarioId, "en_progreso"],
    );

    if (resultado.rows.length === 0) {
      return res.json(null);
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener sesión en progreso",
    });
  }
};
