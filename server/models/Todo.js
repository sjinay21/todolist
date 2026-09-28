import pool from "../config/db.js";

// Get all todos of the logged-in user
// Get paginated todos of the logged-in user
export async function getTodosByUser(userId, limit, cursor) {
    let query;
    let values;
    if (cursor == null) {

        query = `SELECT * FROM todos WHERE user_id = $1 ORDER BY id ASC LIMIT $2;`;
        values = [userId, limit];
    } else {
        query = `SELECT * FROM todos WHERE user_id = $1 AND id > $2 ORDER BY id ASC LIMIT $3;`;
        values = [userId, cursor, limit];
    }
    const result = await pool.query(query, values);
    return result.rows;
}

// Get a specific todo by id
export async function getTodoById(todoId, userId) {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1 AND user_id = $2`, [todoId, userId]);
    return result.rows[0];
}

// Create a todo for the logged-in user
export async function createTodo(userId, title, description, status = "Upcoming") {
    const result = await pool.query(`INSERT INTO todos(user_id, title, description, status) VALUES($1, $2, $3, $4) RETURNING *`, [userId, title, description, status])
    return result.rows[0];
}

// Update a todo of the logged-in user
export async function updateTodo(todoId,userId,title,description,status) {
    const result = await pool.query(`UPDATE todos SET title = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING *`, [title, description, status, todoId, userId]);
    return result.rows[0];
}

// Delete a todo of the logged-in user
export async function deleteTodo(todoId, userId) {
    const result = await pool.query(`DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *`, [todoId, userId]);

    return result.rows[0];
}