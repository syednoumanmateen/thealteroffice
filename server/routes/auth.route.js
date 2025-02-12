import express from "express";
import { googleLoginController, loginController, registerController } from "../controllers/auth.controller.js";

const router = express.Router();

// Manual Registration
router.post("/register", registerController);

// Manual Login
router.post("/login", loginController);

// Google OAuth Login
router.post("/google-login", googleLoginController);

export default router;
