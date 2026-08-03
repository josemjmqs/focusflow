import express from "express";

import {
  registrar,
  login,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registrar);
router.post("/login", login);

export default router;