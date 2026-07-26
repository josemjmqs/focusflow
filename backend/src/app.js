import express from "express";
import sesionesRoutes from "./routes/sesionesRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenido a la API de FocusFlow");
});

app.use("/api/sesiones", sesionesRoutes);

export default app;