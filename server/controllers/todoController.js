import * as todoService from "../services/todoService.js";

export async function getAllTodos(req, res) {
    try {
        const userId = req.user.id;
        const limit = req.query.limit;
        const cursor = req.query.cursor;

        const result = await todoService.getAllTodos(userId, limit, cursor);

        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        console.error("Get todos error:", error.message);
        return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Failed to fetch todos" });
    }
}

export async function addTodo(req, res) {
    try {
        const userId = req.user.id;
        const { title, description, status } = req.body;

        const todo = await todoService.addTodo(userId, title, description, status, req.ip);

        return res.status(201).json({ success: true, message: "Todo created successfully", todo });
    } catch (error) {
        console.error("Create todo error:", error.message);
        return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Failed to create todo" });
    }
}

export async function editTodo(req, res) {
    try {
        const userId = req.user.id;
        const todoId = req.params.id;
        const { title, description, status } = req.body;

        const todo = await todoService.editTodo(userId, todoId, title, description, status, req.ip);

        return res.status(200).json({ success: true, message: "Todo updated successfully", todo });
    } catch (error) {
        console.error("Update todo error:", error.message);
        return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Failed to update todo" });
    }
}

export async function removeTodo(req, res) {
    try {
        const userId = req.user.id;
        const todoId = req.params.id;

        const todo = await todoService.removeTodo(userId, todoId, req.ip);

        return res.status(200).json({ success: true, message: "Todo deleted successfully", todo });
    } catch (error) {
        console.error("Delete todo error:", error.message);
        return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Failed to delete todo" });
    }
}