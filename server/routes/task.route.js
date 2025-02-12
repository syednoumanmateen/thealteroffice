import express from "express";
import { createTaskController, getAllTasksController, getTaskByIdController, updateTaskController, deleteTaskController, updateTaskMultipleController, deleteTaskMultipleController } from "../controllers/task.controller.js";
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

// Update a multiple task by ID
router.post("/multi/taskIds/update", authValidate, updateTaskMultipleController);

// Delete a task by ID
router.delete("/:id", authValidate, deleteTaskController);

// Delete a task by ID
router.post("/multi/taskIds/delete", authValidate, deleteTaskMultipleController);

export default router;
