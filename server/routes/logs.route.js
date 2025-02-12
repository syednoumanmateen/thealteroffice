import express from "express";
import { getAllLogsController } from "../controllers/logs.controller.js";
import { authValidate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all logs
router.get("/:id", authValidate, getAllLogsController);

export default router;
