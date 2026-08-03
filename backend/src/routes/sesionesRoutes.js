import express from "express";
import {
  obtenerSesiones,
  crearSesion,
  finalizarSesion,
  cancelarSesion,
  restaurarSesion,
} from "../controllers/sesionesController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verificarToken, obtenerSesiones);
router.post("/", verificarToken, crearSesion);
router.put("/:id", verificarToken, finalizarSesion);
router.patch("/:id/cancelar", verificarToken, cancelarSesion);
router.patch("/:id/restaurar", verificarToken, restaurarSesion);

export default router;
