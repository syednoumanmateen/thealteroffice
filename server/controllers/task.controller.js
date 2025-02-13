import mongoose from "mongoose";
import Task from "../models/task.model.js";
import Logs from "../models/logs.model.js";

// Create a new task with Transactions
export const createTaskController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const task = await Task.create([{ ...req.body, userId: req.userId }], { session });

        if (!task[0]) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: "Task creation failed" });
        }

        await Logs.create([{ message: "You created this task", userId: req.userId, taskId: task[0]._id, time: new Date() }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ msg: "Task created successfully", task: task[0] });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: "Task creation failed", error: e.message });
    }
};

// Get all tasks
export const getAllTasksController = async (req, res) => {
    try {
        const { search, dueDate, category } = req.query;
        let filter = { userId: req.userId };

        if (search) filter.name = new RegExp(search, "i");
        if (dueDate) {
            filter.dueDate = {
                $gte: new Date(dueDate).setHours(0, 0, 0, 0),
                $lt: new Date(dueDate).setHours(23, 59, 59, 999)
            };
        }
        if (category) filter.category = category;

        const tasks = await Task.find(filter);
        res.status(200).json({ msg: "Tasks fetched successfully", tasks });
    } catch (e) {
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: "Error fetching tasks", error: e.message });
    }
};

// Update multiple tasks with Transactions
export const updateTaskMultipleController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { taskIds, status } = req.body;
        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: "Invalid request format" });
        }

        const existingTasks = await Task.find({ _id: { $in: taskIds } }).session(session);
        if (!existingTasks.length) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ msg: "No tasks found to update" });
        }

        const bulkOps = existingTasks.map(task => ({
            updateOne: { filter: { _id: task._id }, update: { $set: { status } } }
        }));

        const updateLogs = existingTasks.map(task => ({
            message: `You updated the status from ${task.status} to ${status}`,
            userId: req.userId,
            taskId: task._id,
            time: new Date()
        }));

        await Task.bulkWrite(bulkOps, { session });
        await Logs.insertMany(updateLogs, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ msg: "Tasks updated successfully" });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: "Tasks update failed", error: e.message });
    }
};

// Delete multiple tasks with Transactions
export const deleteTaskMultipleController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { taskIds } = req.body;
        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: "Invalid request format" });
        }

        const tasksToDelete = await Task.find({ _id: { $in: taskIds } }).session(session);
        if (!tasksToDelete.length) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ msg: "No tasks found to delete" });
        }

        await Task.deleteMany({ _id: { $in: taskIds } }, { session });

        const deleteLogs = tasksToDelete.map(task => ({
            message: `You deleted the task: ${task.name}`,
            userId: req.userId,
            taskId: task._id,
            time: new Date()
        }));

        await Logs.insertMany(deleteLogs, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ msg: "Tasks deleted successfully", deletedCount: tasksToDelete.length });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: "Tasks deletion failed", error: e.message });
    }
};
