import express from "express";
import { obtenerSesiones, crearSesion, finalizarSesion, cancelarSesion } from "../controllers/sesionesController.js";

const router = express.Router();

router.get("/", obtenerSesiones);
router.post("/", crearSesion);
router.put("/:id", finalizarSesion);
router.patch("/:id/cancelar", cancelarSesion);

export default router;