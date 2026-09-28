import * as auditLogService from "../services/auditLogService.js";

async function getAuditLogs(req, res) {
  try {
    const { limit, offset } = req.query;
  
    const result = await auditLogService.getLogs(limit, offset);
    res.status(200).json({
      success: true,
      message: "Audit logs fetched successfully",
      data: result.logs,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch audit logs"
    });
  }
}

export { getAuditLogs };