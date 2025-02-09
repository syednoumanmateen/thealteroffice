import Task from "../models/task.model.js";
import Logs from "../models/logs.model.js";

// Create a new task
export const createTaskController = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        if (!task) return res.status(200).json({})

        const logs = await Logs.create({ "message": "You Created this task", userId: req.userId, time: new Date() })
        if (!logs) return res.status(200).json({})
            
        res.status(201).json({ message: "Task created successfully", task });
    } catch (e) {
        res.status(500).json({ message: "Task creation failed", e: e?.message });
    }
};

// Get all tasks
export const getAllTasksController = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json({ tasks });
    } catch (e) {
        res.status(500).json({ message: "e fetching tasks", e: e?.message });
    }
};

// Get a single task by ID
export const getTaskByIdController = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ task });
    } catch (e) {
        res.status(500).json({ message: "e fetching task", e: e?.message });
    }
};

// Update a task by ID
export const updateTaskController = async (req, res) => {
    try {
        const taskExists = await Task.findById(req.params.id);
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const updateLogs = Object.keys(req.body).map((key) => {
            let message = "";
            if (key === "title") message = "You updated the Title";
            if (key === "description") message = "You updated the Description";
            if (key === "status") message = `You updated the Status from ${taskExists.status} to ${req.body.status}`;
            if (key === "category") message = `You updated the Category from ${taskExists.category} to ${req.body.category}`;
            if (key === "dueDate") message = "You updated the Due Date";
            if (key === "attachment") message = "You uploaded the file";

            return { message, userId: req.userId, time: new Date() };
        }).filter(log => log.message);
        const logs = await Logs.insertMany(updateLogs)

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (e) {
        res.status(500).json({ message: "Task update failed", e: e?.message });
    }
};

// Delete a task by ID
export const deleteTaskController = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (e) {
        res.status(500).json({ message: "Task deletion failed", e: e?.message });
    }
};
