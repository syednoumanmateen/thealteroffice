import mongoose from "mongoose";
import Logs from "../models/logs.model.js";

// Get all logs with Transactions
export const getAllLogsController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId } = req;
        const { id: taskId } = req.params;

        if (!taskId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: "Task ID is required" });
        }

        const logs = await Logs.find({ userId, taskId }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ msg: "Logs fetched successfully", logs });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: "Error fetching logs", error: e.message });
    }
};
