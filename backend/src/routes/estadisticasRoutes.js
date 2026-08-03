import express from "express";
import { obtenerEstadisticas } from "../controllers/estadisticasController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verificarToken, obtenerEstadisticas);

export default router;