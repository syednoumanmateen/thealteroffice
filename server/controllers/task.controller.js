import mongoose from "mongoose";
import Task from "../models/task.model.js";
import Logs from "../models/logs.model.js";

// Get all tasks
export const getAllTasksController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { search, dueDate, category } = req.query;
        let filter = {};

        // Search by task name (case-insensitive)
        if (search) {
            filter.name = new RegExp(search, "i");
        }

        // Filter by exact due date (if provided)
        if (dueDate) {
            const startOfDay = new Date(dueDate).setHours(0, 0, 0, 0);
            const endOfDay = new Date(dueDate).setHours(23, 59, 59, 999);
            filter.dueDate = { $gte: startOfDay, $lt: endOfDay };
        }

        // Filter by category (if provided)
        if (category) {
            filter.category = category;
        }

        const tasks = await Task.find(filter).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ msg: "Tasks fetched successfully", tasks });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: "Error fetching tasks", error: e.message });
    }
};

// Get a single task by ID
export const getTaskByIdController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const task = await Task.findById(req.params.id).session(session);
        if (!task) throw new Error("Task not found");

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ msg: "Task fetched successfully", task });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: "Error fetching task", error: e.message });
    }
};


// Create a new task
export const createTaskController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const task = await Task.create([{ ...req.body, userId: req.userId }], { session });

        if (!task[0]) throw new Error("Task creation failed");

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

// Update a single task
export const updateTaskController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const taskExists = await Task.findById(req.params.id).session(session);
        if (!taskExists) throw new Error("Task not found");

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, session });
        if (!updatedTask) throw new Error("Task update failed");

        const updateLogs = Object.keys(req.body)
            .map((key) => {
                let message = "";
                if (key === "name") message = "You updated the name";
                if (key === "description") message = "You updated the description";
                if (key === "status") message = `You updated the status from ${taskExists.status} to ${req.body.status}`;
                if (key === "category") message = `You updated the category from ${taskExists.category} to ${req.body.category}`;
                if (key === "dueDate") message = "You updated the due date";
                if (key === "attachment") message = "You uploaded a file";
                return message ? { message, userId: req.userId, taskId: updatedTask._id, time: new Date() } : null;
            })
            .filter(Boolean);

        if (updateLogs.length > 0) await Logs.insertMany(updateLogs, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ msg: "Task updated successfully", task: updatedTask });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: "Task update failed", error: e.message });
    }
};

// Update multiple tasks
export const updateTaskMultipleController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { taskIds, status } = req.body;
        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) throw new Error("Invalid request format");

        const existingTasks = await Task.find({ _id: { $in: taskIds } }).session(session);
        if (!existingTasks.length) throw new Error("No tasks found to update");

        const bulkOps = taskIds.map((id) => ({
            updateOne: { filter: { _id: id }, update: { $set: { status } } },
        }));

        await Task.bulkWrite(bulkOps, { session });

        const updateLogs = existingTasks.map((task) => ({
            message: `You updated the status from ${task.status} to ${status}`,
            userId: req.userId,
            taskId: task._id,
            time: new Date(),
        }));

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

// Delete a single task
export const deleteTaskController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const task = await Task.findByIdAndDelete(req.params.id, { session });
        if (!task) throw new Error("Task not found");

        await Logs.create([{ message: `You deleted the task: ${task.name}`, userId: req.userId, taskId: task._id, time: new Date() }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ msg: "Task deleted successfully" });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: "Task deletion failed", error: e.message });
    }
};

// Delete multiple tasks
export const deleteTaskMultipleController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { taskIds } = req.body;
        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) throw new Error("Invalid request format");

        const tasksToDelete = await Task.find({ _id: { $in: taskIds } }).session(session);
        if (!tasksToDelete.length) throw new Error("No tasks found to delete");

        await Task.deleteMany({ _id: { $in: taskIds } }, { session });

        const deleteLogs = tasksToDelete.map(task => ({
            message: `You deleted the task: ${task.name}`,
            userId: req.userId,
            taskId: task._id,
            time: new Date(),
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
