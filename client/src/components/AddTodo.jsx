"use client"
import React, { useState } from "react";
import { AddSchema } from "../scheme/addschema";
function AddTodo({ onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const handleAdd = async (event) => {
    event.preventDefault();
    const todoData = { title, description };

    try {
      await AddSchema.validate(todoData, { abortEarly: false })
      setErrors({});
      onAdd(todoData);
      onClose();
    } catch (error) {
      const newErrors = {};
      for (let i = 0; i < error.inner.length; i++) {
        const err = error.inner[i];

        newErrors[err.path] = err.message;
      }
      setErrors(newErrors);
    }
  };
  return (
    <div className="flex flex-col border border-black gap-4 p-4 w-[400px] bg-white mx-auto mt-20">
      <div className="flex justify-center items-center gap-[200px]"><h1 className="font-bold text-md p-2">Add Your Task</h1></div>
      <div >
        <form onSubmit={handleAdd}>
          <label className="font-bold text-md p-2">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter your task"
            className="w-full px-4 py-4 border rounded-lg border-black"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          {errors.title && (
            <p className="text-red-500 h-6">
              {errors.title}
            </p>)}
          <label className="font-bold text-md p-2">
            Description
          </label>
          <textarea
            placeholder="Enter task description"
            className="w-full px-4 py-4 border rounded-lg border-black"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {errors.description && (
            <p className="text-red-500 h-6">
              {errors.description}
            </p>)}
          <div className="flex justify-center items-center gap-4 mt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-blue-600 hover:bg-blue-400 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AddTodo;