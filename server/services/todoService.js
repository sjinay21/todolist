import { getTodosByUser, createTodo, updateTodo, deleteTodo, getTodoById } from "../models/Todo.js";
import { createLog } from "./auditLogService.js";

function isValidStatusTransition(currentStatus, newStatus) {
    if (currentStatus == newStatus) return true;
    if (currentStatus == "Upcoming" && newStatus == "Progress") return true;
    if (currentStatus == "Progress" && newStatus == "Complete") return true;
    if (currentStatus == "Progress" && newStatus == "Upcoming") return true;
    if (currentStatus == "Complete" && newStatus == "Progress") return true;
    return false;
}

export async function getAllTodos(userId, rawLimit, rawCursor) {
    const limit = Number(rawLimit) || 5;
    const cursor = rawCursor == undefined ? null : Number(rawCursor);

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        const error = new Error("Limit must be an integer between 1 and 100");
        error.statusCode = 400;
        throw error;
    }

    if (cursor != null && (!Number.isInteger(cursor) || cursor < 1)) {
        const error = new Error("Cursor must be a positive integer");
        error.statusCode = 400;
        throw error;
    }

    const todos = await getTodosByUser(userId, limit, cursor);
    const hasNextPage = todos.length == limit;
    const nextCursor = todos.length > 0 ? todos[todos.length - 1].id : null;

    return { todos, pagination: { limit, nextCursor, hasNextPage } };
}

export async function addTodo(userId, title, description, status = "Upcoming", ip) {
    if (!title || title.trim() == "") {
        const error = new Error("Title is required");
        error.statusCode = 400;
        throw error;
    }

    const allowedStatuses = ["Upcoming", "Progress", "Complete"];

    if (!allowedStatuses.includes(status)) {
        const error = new Error("Invalid status");
        error.statusCode = 400;
        throw error;
    }

    const todo = await createTodo(userId, title, description, status);
    await createLog(userId, "TODO_CREATED", "Todo", todo.id, "User created a todo", ip);

    return todo;
}

export async function editTodo(userId, todoId, title, description, status, ip) {
    if (!title || title.trim() == "") {
        const error = new Error("Title is required");
        error.statusCode = 400;
        throw error;
    }

    const allowedStatuses = ["Upcoming", "Progress", "Complete"];

    if (!allowedStatuses.includes(status)) {
        const error = new Error("Invalid status");
        error.statusCode = 400;
        throw error;
    }

    const existingTodo = await getTodoById(todoId, userId);

    if (!existingTodo) {
        const error = new Error("Todo not found or not owned by this user");
        error.statusCode = 404;
        throw error;
    }

    const validTransition = isValidStatusTransition(existingTodo.status, status);

    if (!validTransition) {
        const error = new Error(`Invalid status transition: ${existingTodo.status} to ${status}. Allowed flow: Upcoming → Progress → Complete`);
        error.statusCode = 400;
        throw error;
    }

    const todo = await updateTodo(todoId, userId, title, description, status);

    if (!todo) {
        const error = new Error("Todo not found or not owned by this user");
        error.statusCode = 404;
        throw error;
    }

    await createLog(userId, "TODO_UPDATED", "Todo", todoId, "User updated a todo", ip);

    return todo;
}

export async function removeTodo(userId, todoId, ip) {
    const todo = await deleteTodo(todoId, userId);

    if (!todo) {
        const error = new Error("Todo not found or not owned by this user");
        error.statusCode = 404;
        throw error;
    }

    await createLog(userId, "TODO_DELETED", "Todo", todoId, "User deleted a todo", ip);

    return todo;
}
