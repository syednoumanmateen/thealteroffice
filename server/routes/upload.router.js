import express from "express";
import { fetchImagesController, uploadImageController, uploadMultipleImagesController } from "../controllers/upload.controller.js";
import { uploadMiddleware, uploadMultipleMiddleware } from "../middlewares/upload.middleware.js";
import { authValidate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Upload Single
router.post("/upload-single", [authValidate, uploadMiddleware], uploadImageController);

// Upload Multiple
router.post("/upload-multiple", [authValidate, uploadMultipleMiddleware], uploadMultipleImagesController);

// Fetch Images (Use GET instead of POST)
router.post("/upload-fetch", authValidate, fetchImagesController);

export default router;
