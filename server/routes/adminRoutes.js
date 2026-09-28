import express from "express";
// import { getUsersWithTodos } from "../controllers/adminController.js";
import { getUsersWithTodos, updateAdminTodo, searchBasicUsers } from "../controllers/adminController.js";
const router = express.Router();
// GET /api/admin/tododetail
router.get("/tododetail", getUsersWithTodos);

// GET /api/admin/todos/:id (Unused)
// router.get("/todos/:id", getAdminTodoById);

// PUT /api/admin/todos/:id
router.put("/todos/:id", updateAdminTodo);

// GET /api/admin/search-users
router.get("/search-users", searchBasicUsers);

export default router;