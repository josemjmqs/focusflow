import express from "express";
import { obtenerSesiones } from "../controllers/sesionesController.js";

const router = express.Router();

router.get("/", obtenerSesiones);

export default router;