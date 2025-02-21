import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import uploadRoutes from "./routes/upload.router.js";
import taskRoutes from "./routes/task.route.js";
import logsRoutes from "./routes/logs.route.js"

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_MODE === "development" ? process.env.FRONTEND_URL_LOCAL : process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers,
  credentials: true
}))

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/logs", logsRoutes)

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on host ${process.env.NODE_MODE}`);
});
