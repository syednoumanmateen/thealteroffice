import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        name: { type:String, required: true, trim: true },
        description: { type:String, trim: true },
        category: { type:String, enum: ["Work", "Personal"], required: true },
        dueDate: { type: Date, required: true },
        status: { type:String, default: "To Do", enum: ["To Do", "In Progress", "Completed"] }, // Fixed typo in "To-Do"
        attachment: { type: Schema.Types.ObjectId, ref: "Upload" }, // Changed to PascalCase
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
        timestamps: true,
        collection: "tasks", // Plural for consistency
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
