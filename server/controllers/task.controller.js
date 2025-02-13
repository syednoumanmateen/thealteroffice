import Task from "../models/task.model.js";
import Logs from "../models/logs.model.js";

//  Create a new task
export const createTaskController = async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, userId: req.userId });
        if (!task) return res.status(400).json({ msg: "Task creation failed" });

        await Logs.create({ message: "You created this task", userId: req.userId, taskId: task._id, time: new Date() });

        res.status(201).json({ msg: "Task created successfully", task });
    } catch (e) {
        console.log(`error: ${e}`)
        res.status(500).json({ msg: "Task creation failed", error: e.msg });
    }
};

//  Get all tasks
export const getAllTasksController = async (req, res) => {
    try {
        const { search, dueDate, category } = req.query;
        let filter = {};

        // Search by task name (case-insensitive)
        if (search) {
            filter.name = new RegExp(search, "i");
        }

        // Filter by exact due date (if provided)
        if (dueDate) {
            filter.dueDate = { $gte: new Date(dueDate).setHours(0, 0, 0, 0), $lt: new Date(dueDate).setHours(23, 59, 59, 999) };
        }

        // Filter by category (if provided)
        if (category) {
            filter.category = category;
        }
        const tasks = await Task.find(filter);
        res.status(200).json({ msg: "Task fetched successfully", tasks });
    } catch (e) {
        console.log(`error: ${e}`)
        res.status(500).json({ msg: "Error fetching tasks", error: e.msg });
    }
};

//  Get a single task by ID
export const getTaskByIdController = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        res.status(200).json({ task });
    } catch (e) {
        console.log(`error: ${e}`)
        res.status(500).json({ msg: "Error fetching task", error: e.msg });
    }
};

//  Update a single task
export const updateTaskController = async (req, res) => {
    try {
        const taskExists = await Task.findById(req.params.id);
        if (!taskExists) return res.status(404).json({ msg: "Task not found" });

        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(400).json({ msg: "Task update failed" });

        // Generate logs for changes
        const updateLogs = Object.keys(req.body)
            .map((key) => {
                let message = "";
                if (key === "name") message = "You updated the name";
                if (key === "description") message = "You updated the description";
                if (key === "status") message = `You updated the status from ${taskExists.status} to ${req.body.status}`;
                if (key === "category") message = `You updated the category from ${taskExists.category} to ${req.body.category}`;
                if (key === "dueDate") message = "You updated the due date";
                if (key === "attachment") message = "You uploaded a file";
                return message ? { message, userId: req.userId, taskId: task._id, time: new Date() } : null;
            })
            .filter(Boolean);

        if (updateLogs.length > 0) await Logs.insertMany(updateLogs);

        res.status(200).json({ msg: "Task updated successfully", task });
    } catch (e) {
        console.log(`error: ${e}`)
        res.status(500).json({ msg: "Task update failed", error: e.msg });
    }
};

//  Update multiple tasks
export const updateTaskMultipleController = async (req, res) => {
    try {
        const { taskIds, status } = req.body;
        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
            return res.status(400).json({ msg: "Invalid request format" });
        }

        const existingTasks = await Task.find({ _id: { $in: taskIds } });

        if (!existingTasks.length) return res.status(404).json({ msg: "No tasks found to update" });

        const bulkOps = [];
        const updateLogs = [];

        taskIds.forEach((id) => {
            const existingTask = existingTasks.find(t => t._id === id);
            if (!existingTask) return;

            bulkOps.push({
                updateOne: { filter: { _id: id }, update: { $set: { status } } },
            });

            Object.keys(taskData).forEach((key) => {

                if (message) {
                    updateLogs.push({ message: `You updated the status from ${existingTask.status} to ${status}`, userId: req.userId, taskId: id, time: new Date() });
                }
            });
        });

        if (bulkOps.length > 0) await Task.bulkWrite(bulkOps);
        if (updateLogs.length > 0) await Logs.insertMany(updateLogs);

        res.status(200).json({ msg: "Tasks updated successfully" });
    } catch (e) {
        console.log(`error: ${e}`)
        res.status(500).json({ msg: "Tasks update failed", error: e.msg });
    }
};

//  Delete a single task
export const deleteTaskController = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        await Logs.create({ message: `You deleted the task: ${task.name}`, userId: req.userId, taskId: task._id, time: new Date() });

        res.status(200).json({ msg: "Task deleted successfully" });
    } catch (e) {
        console.log(`error: ${e}`)
        res.status(500).json({ msg: "Task deletion failed", error: e.msg });
    }
};

//  Delete multiple tasks
export const deleteTaskMultipleController = async (req, res) => {
    try {
        const { taskIds } = req.body;
        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
            return res.status(400).json({ msg: "Invalid request format" });
        }

        const tasksToDelete = await Task.find({ _id: { $in: taskIds } });

        if (!tasksToDelete.length) return res.status(404).json({ msg: "No tasks found to delete" });

        await Task.deleteMany({ _id: { $in: taskIds } });

        const deleteLogs = tasksToDelete.map(task => ({
            message: `You deleted the task: ${task.name}`, userId: req.userId, taskId: task._id, time: new Date()
        }));

        await Logs.insertMany(deleteLogs);

        res.status(200).json({ msg: "Tasks deleted successfully", deletedCount: tasksToDelete.length });
    } catch (e) {
        console.log(`error: ${e}`)
        res.status(500).json({ msg: "Tasks deletion failed", error: e.msg });
    }
};
