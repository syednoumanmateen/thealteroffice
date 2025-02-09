import express from "express";
import { googleAuthController, googleLoginController, loginController, registerController } from "../controllers/auth.controller.js";

const router = express.Router();

// Manual Registration
router.post("/register", registerController);

// Manual Login
router.post("/login", loginController);

// Google OAuth Login
router.post("/google-login", googleLoginController);

// Google OAuth User Info
router.post("/google-user-info", googleAuthController);

export default router;
