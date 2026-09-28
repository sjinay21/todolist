import pool from "../config/db.js";

async function createAuditLog(userId, action, entity, entityId, description, ipAddress) {
  const result = await pool.query(
    `INSERT INTO audit_logs (user_id, action, entity, entity_id, description, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, action, entity, entityId, description, ipAddress]
  );

  return result.rows[0];
}

async function getAuditLogs(limit, offset) {
  const result = await pool.query(
    `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2;`,
    [limit, offset]
  );

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total_logs FROM audit_logs;`
  );

  return {
    logs: result.rows,
    totalLogs: countResult.rows[0].total_logs
  };
}

export { createAuditLog, getAuditLogs };