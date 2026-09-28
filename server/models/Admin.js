import pool from "../config/db.js";

// Admin: Get all users with their todos
export async function getAllUsersWithTodos(limit, offset, search = "") {
    let whereClause = "WHERE is_active = true";
    let params = [limit, offset];
    
    if (search) {
        whereClause += ` AND (name ILIKE $3 OR email ILIKE $3)`;
        params.push(`%${search}%`);
    }
    const usersQuery = `
        WITH paginated_users AS (
            SELECT
                id,
                name,
                email,
                role,
                is_active
            FROM users
            ${whereClause}
            ORDER BY id ASC
            LIMIT $1
            OFFSET $2
        )
        SELECT
            u.id AS user_id,
            u.name AS user_name,
            u.email AS user_email,
            u.role AS user_role,
            u.is_active AS user_is_active,
            t.id AS todo_id,
            t.title AS todo_title,
            t.description AS todo_description,
            t.status AS todo_status,
            t.created_at AS todo_created_at,
            t.updated_at AS todo_updated_at
        FROM paginated_users u
        LEFT JOIN todos t
            ON u.id = t.user_id
        ORDER BY
            u.id ASC,
            t.created_at DESC;
    `;
    const countQuery = `
        SELECT COUNT(*)::int AS total_users
        FROM users
        ${whereClause};
    `;

    const [usersResult, countResult] = await Promise.all([
        pool.query(usersQuery, params),
        pool.query(countQuery, params)
    ]);
    const totalUsers = countResult.rows[0].total_users;
     return {
        users: usersResult.rows,
        totalUsers
    };
}
    // Old nested response logic
    /*
    const usersObj = {};
    for (let i = 0; i < usersResult.rows.length; i++) {
        const row = usersResult.rows[i];
        if (usersObj[row.user_id] == undefined) {
            usersObj[row.user_id] = {
                id: row.user_id,
                name: row.user_name,
                email: row.user_email,
                role: row.user_role,
                is_active: row.user_is_active,
                todos: []
            };
        }
        const user = usersObj[row.user_id];
        if (row.todo_id != null) {
            user.todos.push({
                id: row.todo_id,
                title: row.todo_title,
                description: row.todo_description,
                status: row.todo_status,
                created_at: row.todo_created_at,
                updated_at: row.todo_updated_at
            });
        }
    }

    return {
        users: Object.values(usersObj),
        totalUsers
    };
    */

   

// Admin: Get a specific todo by ID (Unused)
/*
export async function getAnyTodoById(todoId) {
    const query = `
        SELECT 
            t.id as todo_id,
            t.title as todo_title,
            t.description as todo_description,
            t.status as todo_status,
            t.created_at as todo_created_at,
            u.id as user_id,
            u.name as user_name,
            u.email as user_email
        FROM todos t
        JOIN users u ON t.user_id = u.id
        WHERE t.id = $1
    `;
    const result = await pool.query(query, [todoId]);
    return result.rows[0];
}
*/

// Admin: Update any todo by ID
export async function updateAnyTodo(todoId,title,description,status,userId) {
    const query = `
        UPDATE todos
        SET
            title = $1,
            description = $2,
            status = $3,
            user_id = $4,
            updated_at = CURRENT_TIMESTAMP

        WHERE id = $5

        RETURNING
            id,
            title,
            description,
            status,
            user_id,
            created_at,
            updated_at;
    `;

    const result = await pool.query(query, [title,description,status,userId,todoId]);

    return result.rows[0];
}

// Admin: Check if user exists
export async function checkUserExists(userId) {
    const query = `
        SELECT id
        FROM users
        WHERE id = $1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows.length > 0;
}