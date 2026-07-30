import express from "express";
import {
  obtenerSesiones,
  crearSesion,
  finalizarSesion,
  cancelarSesion,
  restaurarSesion,
} from "../controllers/sesionesController.js";

const router = express.Router();

router.get("/", obtenerSesiones);
router.post("/", crearSesion);
router.put("/:id", finalizarSesion);
router.patch("/:id/cancelar", cancelarSesion);
router.patch("/:id/restaurar", restaurarSesion);

export default router;
