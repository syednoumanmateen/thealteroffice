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
const FEURL = process.env.NODE_MODE === "development" ? process.env.FRONTEND_URL_LOCAL_HOST : process.env.FRONTEND_URL
app.use(cors({
  origin: FEURL, // or use '*' for all origins (less secure)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adjust as needed
}));
// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/logs", logsRoutes)

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
