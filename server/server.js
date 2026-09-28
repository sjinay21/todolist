import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import authorizeRoles from "./middleware/roleMiddleware.js";
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Built-in middleware
app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use("/api/audit-logs", auditLogRoutes);
// Public authentication routes
app.use("/", authRoutes);

// Protected Todo routes
app.use("/todos", authMiddleware, todoRoutes);

// Protected Admin routes
app.use("/api/admin", authMiddleware, authorizeRoles("admin"), adminRoutes);

// Start server
app.listen(PORT, () => {console.log(`Server running on http://localhost:${PORT}`);});