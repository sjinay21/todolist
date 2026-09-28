import * as adminService from "../services/adminService.js";

// Admin: Get all users with their todos
export async function getUsersWithTodos(req, res) {
    try {
        const result = await adminService.getUsersWithTodos(req.query.limit, req.query.offset, req.query.search);

        return res.status(200).json({
            success: true,
            message: "Users and todos fetched successfully",
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        console.error("Get users with todos error:", error.message);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch users and todos"
        });
    }
}

// Admin: Get a specific todo (Unused)
/*
export async function getAdminTodoById(req, res) {
    try {
        const todoId = req.params.id;
        const todo = await adminService.getAnyTodoById(todoId);
        
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: todo
        });
    } catch (error) {
        console.error("Get admin todo error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch todo"
        });
    }
}
*/

// Admin: Update any user's todo
export async function updateAdminTodo(req, res) {
    try {
        const adminId = req.user.id;
        const { id } = req.params;
        const { title, description, status, user_id } = req.body;

        const updatedTodo = await adminService.updateAdminTodo(adminId, id, title, description, status, user_id, req.ip);

        return res.status(200).json({
            success: true,
            message: "Todo updated successfully by admin",
            data: updatedTodo
        });
    } catch (error) {
        console.error("Update admin todo error:", error.message);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to update todo"
        });
    }
}

// Admin: Search basic users (for dropdowns)
export async function searchBasicUsers(req, res) {
    try {
        const result = await adminService.searchBasicUsers(req.query.limit, req.query.offset, req.query.search);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Search users error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to search users"
        });
    }
}