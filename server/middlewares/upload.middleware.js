import upload from "../config/upload.js";

// Middleware for single file upload
export const uploadMiddleware = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ msg: "File upload failed", error: err.message });
        }
        next();
    });
};

// Middleware for multiple file uploads (Max 5 files)
export const uploadMultipleMiddleware = (req, res, next) => {
    upload.array("images", 5)(req, res, (err) => {  // Changed max from 10 to 5
        if (err) {
            return res.status(400).json({ msg: "File upload failed", error: err.message });
        }
        next();
    });
};
