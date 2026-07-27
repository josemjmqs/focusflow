import express from "express";
import { obtenerSesiones, crearSesion, finalizarSesion } from "../controllers/sesionesController.js";

const router = express.Router();

router.get("/", obtenerSesiones);

router.post("/", crearSesion);

router.put("/:id", finalizarSesion);

export default router;