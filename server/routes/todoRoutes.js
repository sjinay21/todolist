import express from "express";
import {getAllTodos,addTodo,editTodo,removeTodo} from "../controllers/todoController.js";
const router = express.Router();
// Get all logged-in user's todos
router.get("/", getAllTodos);
// Create todo
router.post("/", addTodo);
// Update todo
router.put("/:id", editTodo);
// Delete todo
router.delete("/:id", removeTodo);
export default router;