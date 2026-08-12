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
        dias.dia,
        COALESCE(SUM(s.duracion), 0) AS tiempo
      FROM generate_series(
        DATE_TRUNC('week', CURRENT_DATE),
        DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days',
        INTERVAL '1 day'
      ) AS dias(dia)
      LEFT JOIN sesiones s
        ON DATE(s.inicio) = DATE(dias.dia)
        AND s.estado = $1
        AND s.usuario_id = $2
      GROUP BY dias.dia
      ORDER BY dias.dia;`,
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
         AND usuario_id = $2;`,
      ["completada", usuarioId],
    );

    const resultadoSesionesHoy = await pool.query(
      `SELECT COUNT(*) AS sesiones_hoy
       FROM sesiones
       WHERE estado = $1
         AND usuario_id = $2
         AND DATE(inicio) = CURRENT_DATE;`,
      ["completada", usuarioId],
    );

    res.json({
      tiempoHoy: Number(resultado.rows[0].tiempo_hoy) || 0,

      tiempoSemana: Number(resultadoSemana.rows[0].tiempo_semana) || 0,

      tiempoMes: Number(resultadoMes.rows[0].tiempo_mes) || 0,

      sesionesCompletadas:
        Number(resultadoCantidad.rows[0].sesiones_completadas) || 0,

      sesionesHoy: Number(resultadoSesionesHoy.rows[0].sesiones_hoy) || 0,

      tiempoPorDia: resultadoPorDia.rows.map((fila) => ({
        dia: fila.dia,
        tiempo: Number(fila.tiempo) || 0,
      })),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener las estadísticas",
    });
  }
};
