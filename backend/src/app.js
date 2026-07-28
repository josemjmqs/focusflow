import express from "express";
import sesionesRoutes from "./routes/sesionesRoutes.js";
import estadisticasRoutes from "./routes/estadisticasRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/sesiones", sesionesRoutes);

app.use("/api/estadisticas", estadisticasRoutes);

export default app;