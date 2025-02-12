import Logs from "../models/logs.model.js";

//  Get all logs
export const getAllLogsController = async (req, res) => {
    try {
        const logs = await Logs.find({ userId: req.userId, taskId: req.params.id });
        res.status(200).json({ msg: "Logs fetched successfully", logs });
    } catch (e) {
        console.log(`error: ${e}`)
        res.status(500).json({ msg: "Error fetching tasks", error: e.msg });
    }
};