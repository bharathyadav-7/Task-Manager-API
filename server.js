const express = require("express");
const dotenv = require("dotenv");
const connectDB=require("./config/db");

const authRoutes = require("./routes/auth.routes");
const authMiddleware = require("./middleware/auth.middleware");
const taskRoutes = require("./routes/task.routes");

dotenv.config();

const app = express();
const errorMiddleware = require("./middleware/error.middleware");
const adminRoutes = require("./routes/admin.routes");

app.get("/", (req, res) => {
    res.json({
        message: "Task Manager API is running"
    });
});
app.use(express.json({ limit: "10kb" }));
app.use(errorMiddleware);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You accessed a protected route",
        user: req.user
    });
});
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
connectDB();