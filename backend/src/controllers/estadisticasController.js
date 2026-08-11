import pool from "../config/database.js";

export const obtenerEstadisticas = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const resultado = await pool.query(
      `SELECT SUM(duracion) AS tiempo_hoy
      FROM sesiones
      WHERE estado = $1
      AND usuario_id = $2
      AND DATE(inicio) = CURRENT_DATE;`,
      ["completada", usuarioId],
    );

    const resultadoSemana = await pool.query(
      `SELECT SUM(duracion) AS tiempo_semana
      FROM sesiones
      WHERE estado = $1
      AND usuario_id = $2
      AND inicio >= DATE_TRUNC('week', CURRENT_DATE);`,
      ["completada", usuarioId],
    );

    const resultadoPorDia = await pool.query(
      `SELECT
        DATE(inicio) AS dia,
        COALESCE(SUM(duracion), 0) AS tiempo
      FROM sesiones
      WHERE estado = $1
        AND usuario_id = $2
        AND inicio >= DATE_TRUNC('week', CURRENT_DATE)
      GROUP BY DATE(inicio)
      ORDER BY dia;`,
      ["completada", usuarioId],
    );

    const resultadoMes = await pool.query(
      `SELECT SUM(duracion) AS tiempo_mes
      FROM sesiones
      WHERE estado = $1
      AND usuario_id = $2
      AND inicio >= DATE_TRUNC('month', CURRENT_DATE);`,
      ["completada", usuarioId],
    );

    const resultadoCantidad = await pool.query(
      `SELECT COUNT(*) AS sesiones_completadas
      FROM sesiones
      WHERE estado = $1
      AND usuario_id = $2`,
      ["completada", usuarioId],
    );

    res.json({
      tiempoHoy: Number(resultado.rows[0].tiempo_hoy) || 0,
      tiempoSemana: Number(resultadoSemana.rows[0].tiempo_semana) || 0,
      tiempoMes: Number(resultadoMes.rows[0].tiempo_mes) || 0,
      sesionesCompletadas:
        Number(resultadoCantidad.rows[0].sesiones_completadas) || 0,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener las estadísticas",
    });
  }
};
