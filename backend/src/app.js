import express from "express";
import sesionesRoutes from "./routes/sesionesRoutes.js";
import estadisticasRoutes from "./routes/estadisticasRoutes.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "API de FocusFlow funcionando correctamente",
  });
});

app.use("/api/sesiones", sesionesRoutes);

app.use("/api/estadisticas", estadisticasRoutes);

app.use("/api/auth", authRoutes);

export default app;