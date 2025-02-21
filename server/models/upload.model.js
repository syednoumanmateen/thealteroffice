import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
    upload: {
        data: Buffer,
        contentType:String
    }
}, {
    timestamps: true,
    collection: "uploads"
});

const Upload = mongoose.model("Upload", uploadSchema);
export default Upload;
