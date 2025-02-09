import mongoose, { Schema } from "mongoose"

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ["WORK", "PERSONAL"], required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, default: "TO-DO", enum: ["TO-DO", "IN-PROGRESS", "COMPLETED"] },
    attachment: { type: Schema.Types.ObjectId, ref: "upload" },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
}, {
    timestamps: true,
    collection: "task"
})

const task = mongoose.model("task", taskSchema)

export default task