import mongoose, { Schema } from "mongoose"

const logsSchema = new mongoose.Schema({
    message: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    time: { type: Date, required: true }
}, {
    timestamps: true,
     collection:"logs"
})

const logs = mongoose.model("logs", logsSchema)

export default logs