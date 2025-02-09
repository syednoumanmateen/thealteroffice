import express from "express";
import { fetchImagesController, uploadImageController, uploadMultipleImagesController } from "../controllers/upload.controller.js";
import { uploadMiddleware, uploadMultipleMiddleware } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Upload Single
router.post("/upload-single", uploadMiddleware, uploadImageController);

// Upload Multiple
router.post("/upload-multiple", uploadMultipleMiddleware, uploadMultipleImagesController);

// Fetch Images (Use GET instead of POST)
router.post("/upload-fetch", fetchImagesController);

export default router;
