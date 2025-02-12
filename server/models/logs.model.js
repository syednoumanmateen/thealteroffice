import mongoose, { Schema } from "mongoose";

const logsSchema = new Schema(
    {
        message: { type: String, required: true, trim: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
        time: { type: Date, default: Date.now }, // Default timestamp
    },
    {
        timestamps: true,
        collection: "logs",
    }
);

const Logs = mongoose.model("Logs", logsSchema);

export default Logs;
