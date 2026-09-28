import { createAuditLog, getAuditLogs } from "../models/AuditLog.js";

async function createLog(userId, action, entity, entityId, description, ipAddress) {
  return await createAuditLog(userId, action, entity, entityId, description, ipAddress);
}

async function getLogs(rawLimit, rawOffset) {
  const limit = Number(rawLimit) || 5;
  const offset = Number(rawOffset) || 0;

  if (limit < 1 || limit > 100) {
      const error = new Error("Limit must be between 1 and 100");
      error.statusCode = 400;
      throw error;
  }

  if (offset < 0) {
      const error = new Error("Offset cannot be negative");
      error.statusCode = 400;
      throw error;
  }

  const { logs, totalLogs } = await getAuditLogs(limit, offset);
  
  const hasNextPage = offset + logs.length < totalLogs;

  return {
      logs,
      pagination: {
          limit,
          offset,
          totalLogs,
          hasNextPage
      }
  };
}

export { createLog, getLogs };