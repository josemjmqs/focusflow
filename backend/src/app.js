import express from "express";
import sesionesRoutes from "./routes/sesionesRoutes.js";
import estadisticasRoutes from "./routes/estadisticasRoutes.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/api/sesiones", sesionesRoutes);

app.use("/api/estadisticas", estadisticasRoutes);

app.use("/api/auth", authRoutes);

export default app;