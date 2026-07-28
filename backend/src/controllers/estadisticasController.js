import pool from "../config/database.js";

export const obtenerEstadisticas = async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT SUM(duracion) AS tiempo_hoy
      FROM sesiones
      WHERE estado = $1
      AND DATE(inicio) = CURRENT_DATE;`,
      ["completada"],
    );

    const resultadoSemana = await pool.query(
      `SELECT SUM(duracion) AS tiempo_semana
        FROM sesiones
        WHERE estado = $1
        AND inicio >= DATE_TRUNC('week', CURRENT_DATE);`,
      ["completada"],
    );

    const resultadoMes = await pool.query(
      `SELECT SUM(duracion) AS tiempo_mes
      FROM sesiones
      WHERE estado = $1
      AND inicio >= DATE_TRUNC('month', CURRENT_DATE);`,
      ["completada"],
    );

    const resultadoCantidad = await pool.query(
      `SELECT COUNT(*) AS sesiones_completadas
      FROM sesiones
      WHERE estado = $1`,
      ["completada"],
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
