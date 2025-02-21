import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type:String, required: true, trim: true },
        email: { type:String, required: true, unique: true, lowercase: true, trim: true },
        password: { type:String, minlength: 6, select: false }, // Hide password by default
        googleId: { type:String, default: null }
    },
    {
        timestamps: true,
        collection: "users", // Pluralized name for consistency
    }
);

const User = mongoose.model("User", userSchema);

export default User;
