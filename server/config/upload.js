import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDirectory = "uploads/";
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });
export default upload;

// Convert Buffer Data to Base64 URL
export const bufferToUrl = (bufferData) => {
    return `data:image/png;base64,${bufferData.toString("base64")}`;
};

// Process Uploaded File (Save in DB, then Delete from Storage)
export const uploadFile = (file) => {
    try {
        const imgPath = file.path;
        const imgData = fs.readFileSync(imgPath);
        const contentType = file.mimetype;

        const upload = {
            data: imgData,
            contentType: contentType
        };

        // Delete file after reading
        fs.unlinkSync(imgPath);

        return upload;
    } catch (e) {
        console.log("🚀 ~ uploadFile ~ Error:", e);
        return null;
    }
};
