/*
// --- OLD CODE (JSON File Based) ---
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, "../data/users.json");

function getAllUsers() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

function saveAllUsers(users) {
  fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), "utf8");
};

function findByEmail(email) {
  const users = getAllUsers();
  return users.find((user) => user.email == email);
};

function create(userData) {
  const users = getAllUsers();
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    ...userData,
  };
  users.push(newUser);
  saveAllUsers(users);
  return newUser;
};

export {
  findByEmail,
  create,
};
*/
import pool from "../config/db.js";

async function findByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

async function findById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

async function create(userData) {
  const { name, email, password, role } = userData;
  const result = await pool.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",[name, email, password, role]);
  return result.rows[0];
}

async function updateUserName(user, name) {
  const result = await pool.query(`UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role`,[name, user.id]);
  return result.rows[0];
}

async function updateUserEmail(user, email) {
  const result = await pool.query(`UPDATE users SET email = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role`,[email, user.id]);
  return result.rows[0];
}

async function updateUserPassword(user, password) {
  const result = await pool.query(`UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role`,
    [password, user.id]
  );
  return result.rows[0];
}

async function setUserActiveStatus(userId, isActive) {
  await pool.query(`UPDATE users SET is_active = $1 WHERE id = $2`, [isActive, userId]);
}

async function searchUsers(search = "", limit = 10, offset = 0) {
  let whereClause = "WHERE is_active = true";
  let params = [limit, offset];

  if (search) {
      whereClause += ` AND (name ILIKE $3 OR email ILIKE $3)`;
      params.push(`%${search}%`);
  }

  const query = `
      SELECT id AS user_id, name AS user_name, email AS user_email, role AS user_role, is_active AS user_is_active
      FROM users
      ${whereClause}
      ORDER BY name ASC
      LIMIT $1
      OFFSET $2
  `;

  const result = await pool.query(query, params);
  return result.rows;
}

export { findByEmail, findById, create, updateUserName, updateUserEmail, updateUserPassword, searchUsers, setUserActiveStatus };
