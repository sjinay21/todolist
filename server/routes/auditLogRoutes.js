import express from "express";
import { getAuditLogs } from "../controllers/auditLogController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
const router = express.Router();
router.get("/", authMiddleware, authorizeRoles("admin"), getAuditLogs);
export default router;