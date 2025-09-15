const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const {connectDB} = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const busRoutes = require("./routes/bus");
const routeRoutes = require("./routes/route");
const ticketRoutes = require("./routes/ticket");
const alertRoutes = require("./routes/alert");
const userRoutes = require("./routes/user");
const analyticsRoutes = require("./routes/analytics");
const accessRoutes = require("./routes/access");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/access", accessRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
