import mongoose from "mongoose";
import Upload from "../models/upload.model.js";
import { uploadFile, bufferToUrl } from "../config/upload.js";

// Upload a Single Image
export const uploadImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const uploadedFile = await uploadFile(req.file);
        const savedImage = await Upload.create({ upload: uploadedFile, userId: req.userId });

        return res.status(201).json({
            message: "Image uploaded successfully",
            imageId: savedImage._id
        });
    } catch (e) {
        console.error(`Error: ${e}`);
        return res.status(500).json({ message: "Image upload failed", error: e.message });
    }
};

// Upload Multiple Images
export const uploadMultipleImagesController = async (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const uploadedFiles = await Promise.all(req.files.map(uploadFile));
        const savedImages = await Upload.insertMany(uploadedFiles.map(upload => ({
            upload,
            userId: req.userId
        })));

        return res.status(201).json({
            message: "Images uploaded successfully",
            imageIds: savedImages.map(i => i._id)
        });
    } catch (e) {
        console.error(`Error: ${e}`);
        return res.status(500).json({ message: "Image upload failed", error: e.message });
    }
};

// Fetch Images
export const fetchImagesController = async (req, res) => {
    try {
        const { images } = req.body;
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: "No image IDs provided" });
        }

        // Validate and convert IDs
        const validObjectIds = images.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validObjectIds.length === 0) {
            return res.status(400).json({ message: "Invalid image IDs provided" });
        }

        const result = await Upload.find({ _id: { $in: validObjectIds } }).lean();

        if (result.length === 0) {
            return res.status(404).json({ message: "No images found" });
        }

        // Convert buffer data to URLs safely
        const imageUrls = await Promise.all(
            result.map(i => (i.upload?.data ? bufferToUrl(i.upload.data) : null))
        );

        return res.status(200).json({ message: "Images fetched successfully", images: imageUrls.filter(Boolean) });
    } catch (e) {
        console.error(`Error: ${e}`);
        return res.status(500).json({ message: "Image fetch failed", error: e.message });
    }
};
