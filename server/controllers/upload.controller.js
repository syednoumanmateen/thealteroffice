import mongoose from "mongoose";
import Upload from "../models/upload.model.js";
import { uploadFile, bufferToUrl } from "../config/upload.js";

// Upload Single Image Controller
export const uploadImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const data = { upload: await uploadFile(req.file) };
        const savedImage = await Upload.create(data);

        return res.json({ message: "Image uploaded successfully", image: savedImage });
    } catch (e) {
        return res.status(500).json({ message: "Image upload failed", error: e?.message });
    }
};

// Upload Multiple Images Controller
export const uploadMultipleImagesController = async (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const data = await Promise.all(
            req.files.map(async (file) => ({ upload: await uploadFile(file) }))
        );

        const savedImages = await Upload.insertMany(data);

        return res.json({ message: "Images uploaded successfully", images: savedImages });
    } catch (e) {
        return res.status(500).json({ message: "Image upload failed", error: e?.message });
    }
};

// Fetch Images Controller
export const fetchImagesController = async (req, res) => {
    try {
        const { images } = req.body;

        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: "No image IDs provided" });
        }

        // Convert string image IDs to ObjectId
        const objectIds = images.map((img) => new mongoose.Types.ObjectId(img));

        // Find documents where _id is in the provided array
        const result = await Upload.find({ _id: { $in: objectIds } });

        // Convert buffer data to base64 URLs
        const obj = await Promise.all(result.map(async (i) => await bufferToUrl(i.upload.data)));

        return res.json({ message: "Images fetched successfully", images: obj });
    } catch (e) {
        return res.status(500).json({ message: "Image fetch failed", error: e?.message });
    }
};
