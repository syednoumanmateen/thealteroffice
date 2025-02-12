import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");
    } catch (e) {
        console.log("🚀 ~ connectDB ~ e:", e?.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
