import { getAllUsersWithTodos, updateAnyTodo, checkUserExists } from "../models/Admin.js";
import { searchUsers } from "../models/User.js";
import { createLog } from "./auditLogService.js";

export async function getUsersWithTodos(rawLimit, rawOffset, search = "") {
    const limit = Number(rawLimit) || 5;
    const offset = Number(rawOffset) || 0;

    if (limit < 1 || offset < 0) {
        const error = new Error("Limit must be positive and offset cannot be negative");
        error.statusCode = 400;
        throw error;
    }

    const result = await getAllUsersWithTodos(limit, offset, search);
    const hasNextPage = offset + result.users.length < result.totalUsers;

    return {
        data: result.users,
        pagination: {
            limit,
            offset,
            totalUsers: result.totalUsers,
            hasNextPage
        }
    };
}

// Unused function
/*
export async function getAnyTodoById(todoId) {
    return await getAnyTodoByIdModel(todoId);
}
*/

export async function getAdminTodoById(todoId) {
    const todo = await getAnyTodoById(todoId);

    if (!todo) {
        const error = new Error("Todo not found");
        error.statusCode = 404;
        throw error;
    }

    return todo;
}

export async function updateAdminTodo(adminId, todoId, title, description, status, targetUserId, ip) {
    if (!title || !status || !targetUserId) {
        const error = new Error("Title, status, and user_id are required");
        error.statusCode = 400;
        throw error;
    }

    const userExists = await checkUserExists(targetUserId);

    if (!userExists) {
        const error = new Error("Target user not found");
        error.statusCode = 404;
        throw error;
    }

    const updatedTodo = await updateAnyTodo(todoId, title, description, status, targetUserId);

    if (!updatedTodo) {
        const error = new Error("Todo not found");
        error.statusCode = 404;
        throw error;
    }

    await createLog(adminId, "TODO_UPDATED_BY_ADMIN", "Todo", todoId, "Admin updated a user's todo", ip);

    return updatedTodo;
}

export async function searchBasicUsers(rawLimit, rawOffset, search) {
    const limit = Number(rawLimit) || 10;
    const offset = Number(rawOffset) || 0;
    return await searchUsers(search, limit, offset);
}
