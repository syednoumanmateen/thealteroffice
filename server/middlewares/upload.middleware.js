import upload from "../config/upload.js";

export const uploadMiddleware = upload.single("image"); // For single file upload
export const uploadMultipleMiddleware = upload.array("images", 5); // For multiple images (max 5)
