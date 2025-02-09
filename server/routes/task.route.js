import express from "express";
import { createTaskController, getAllTasksController, getTaskByIdController, updateTaskController, deleteTaskController } from "../controllers/task.controller.js";
import { authValidate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create a new task
router.post("/", authValidate, createTaskController);

// Get all tasks
router.get("/", authValidate, getAllTasksController);

// Get a single task by ID
router.get("/:id", authValidate, getTaskByIdController);

// Update a task by ID
router.put("/:id", authValidate, updateTaskController);

// Delete a task by ID
router.delete("/:id", authValidate, deleteTaskController);

export default router;
