"use client";

import React, { useEffect, useState } from "react";
import { DEFAULT_PAGINATION_LIMIT } from "@/config/constants";
import AddTodo from "./AddTodo";
import TodoMenu from "./TodoMenu";
import { getTodos, createTodo, updateTodo, removeTodo } from "../services/api";

function Hero() {
  const [isOpen, isAddOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  
  // Pagination states
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [limit, setLimit] = useState(DEFAULT_PAGINATION_LIMIT);
  const [loading, setLoading] = useState(false);
  const [statusErrorId, setStatusErrorId] = useState(null);
  const [statusErrorMessage, setStatusErrorMessage] = useState("");

  // Old cursor pagination logic - kept for reference
  /*
  async function fetchTodos() {
    try {
      const response = await getTodos();
      const result = await response.json();

      if (!response.ok) {
        console.error(result.message);
        return;
      }

      setTodos(result.todos);
    } catch (error) {
      console.error("Fetch todos error:", error);
    }
  }
  */

  async function fetchTodos(isNextPage = false) {
    try {
      setLoading(true);
      const cursorToSend = isNextPage ? nextCursor : null;
      const response = await getTodos(limit, cursorToSend);
      const result = await response.json();

      if (!response.ok) {
        console.error(result.message);
        setLoading(false);
        return;
      }

      if (isNextPage) {
        setTodos((prev) => [...prev, ...result.todos]);
      } else {
        setTodos(result.todos);
      }

      setNextCursor(result.pagination.nextCursor);
      setHasNextPage(result.pagination.hasNextPage);
      setLoading(false);
    } catch (error) {
      console.error("Fetch todos error:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

 
  async function addTodo(todoData) {
    try {
      const response = await createTodo(todoData);

      const result = await response.json();

      if (!response.ok) {
        console.error(result.message);
        return;
      }

      setTodos([...todos, result.todo]);
    } catch (error) {
      console.error("Create todo error:", error);
    }
  }

  function editTodo(todosId, title) {
    setEditTodoId(todosId);
    setEditTitle(title);
  }

  async function updateTitle(todosId) {
    const selectedTodo = todos.find((todo) => todo.id === todosId);

    try {
      const response = await updateTodo(todosId, {
        title: editTitle,
        description: selectedTodo.description,
        status: selectedTodo.status,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result.message);
        return;
      }

      setTodos(
        todos.map((todo) =>
          todo.id === todosId ? result.todo : todo
        )
      );

      setEditTodoId(null);
    } catch (error) {
      console.error("Update todo error:", error);
    }
  }

  async function updateStatus(todosId, status) {
    const selectedTodo = todos.find((todo) => todo.id == todosId);

    // Reset error
    setStatusErrorId(null);
    setStatusErrorMessage("");

    // Validate transition
    const currentStatus = selectedTodo.status;
    let isValid = false;
    if (currentStatus == status) isValid = true;
    else if (currentStatus == "Upcoming" && status == "Progress") isValid = true;
    else if (currentStatus == "Progress" && status == "Complete") isValid = true;
    else if (currentStatus == "Progress" && status == "Upcoming") isValid = true;
    else if (currentStatus == "Complete" && status == "Progress") isValid = true;

    if (!isValid) {
      setStatusErrorId(todosId);
      if (currentStatus == "Upcoming" && status == "Complete") {
        setStatusErrorMessage(`You must move the todo from Upcoming to Progress before marking it Complete.`);
      } else if (currentStatus == "Complete" && status == "Upcoming") {
        setStatusErrorMessage(`You must move the todo from Complete to Progress before marking it Upcoming.`);
      } else {
        setStatusErrorMessage(`Invalid status transition.`);
      }
      return;
    }

    try {
      const response = await updateTodo(todosId, {
        title: selectedTodo.title,
        description: selectedTodo.description,
        status,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(result.message);
        setStatusErrorId(todosId);
        setStatusErrorMessage(result.message || "Failed to update status.");
        return;
      }

      setTodos(
        todos.map((todo) =>
          todo.id == todosId ? result.todo : todo
        )
      );
    } catch (error) {
      console.error("Update status error:", error);
      setStatusErrorId(todosId);
      setStatusErrorMessage("An error occurred while updating status.");
    }
  }
  async function deleteTodo(todosId) {
    try {
      const response = await removeTodo(todosId);

      const result = await response.json();

      if (!response.ok) {
        console.error(result.message);
        return;
      }

      setTodos(todos.filter((todo) => todo.id !== todosId));
    } catch (error) {
      console.error("Delete todo error:", error);
    }
  }

  return (
    // <div className="flex flex-col justify-center items-center border bg-blue-200 border-black gap-4 p-4 w-1/3 h-1/3 mx-auto mt-20">
    <div className="flex flex-col items-center bg-white shadow-2xl rounded-2xl border border-gray-100 gap-6 p-8 w-full max-w-2xl mx-auto mt-32 transition-all hover:shadow-blue-500/10">
      
      {/* <div className="flex justify-center items-center gap-[200px]"> */}
      <div className="flex justify-between items-center w-full mb-4 border-b border-gray-100 pb-4">
        
        {/* <h1 className="font-bold bg-blue-600 hover:bg-blue-400 text-md p-2">
          Todo App
        </h1> */}
        <h1 className="text-3xl font-black text-blue-800">
          My Tasks
        </h1>

         <button
          className="font-bold text-5xl text-blue-800 p-2 rounded hover:text-blue-400"
          onClick={() => isAddOpen(!isOpen)}
        >
          +
        </button> 
       {/* <button
          className="group flex items-center justify-center hover:blue-500 text-white font-bold h-10 w-10 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-blue-500/50"
          onClick={() => isAddOpen(!isOpen)}

        >
          <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        </button>*/}
      </div>

      {/* {isOpen && (
        <div className="fixed z-20 top-30">
          <AddTodo
            onAdd={addTodo}
            onClose={() => isAddOpen(false)}
          />
        </div>
      )} */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity">
          <AddTodo
            onAdd={addTodo}
            onClose={() => isAddOpen(false)}
          />
        </div>
      )}

      {/* <div className="w-full flex flex-col gap-2"> */}
      <div className="w-full flex flex-col gap-4">
        {todos.map((todo) => (
          // <div
          //   key={todo.id}
          //   className="flex justify-between items-center border border-black rounded-lg p-3"
          // >
          <div
            key={todo.id}
            className="flex justify-between items-center rounded-xl hover:bg-white hover:border-blue-100"
          >
            {/* <div className="flex items-center gap-[50px]"> */}
            <div className="flex flex-1 items-center gap-6 pr-4">
              {/* <div className="w-[250px]"> */}
              <div className="flex-1 min-w-0">
                {editTodoId == todo.id ? (
                  // <input
                  //   value={editTitle}
                  //   onChange={(event) =>
                  //     setEditTitle(event.target.value)
                  //   }
                  //   onBlur={() => updateTitle(todo.id)}
                  //   className="border border-black rounded w-full"
                  // />
                  <input
                    value={editTitle}
                    onChange={(event) =>
                      setEditTitle(event.target.value)
                    }
                    onBlur={() => updateTitle(todo.id)}
                    className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 outline-none"
                  />
                ) : (
                  // <h2 className="font-semibold">{todo.title}</h2>
                  <h2 className="font-semibold text-blue-800 text-lg group-hover:text-blue-600 ">{todo.title}</h2>
                )}
              </div>

              {/* <div className={`px-3 py-1 text-xs font-bold rounded-full border whitespace-nowrap shadow-sm ${
                todo.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' :
                todo.status === 'Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                todo.status === 'Upcoming' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                'bg-yellow-100 text-yellow-700 border-yellow-200'
              }`}>
                {todo.status}
              </div> */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 sm:gap-2 text-xs font-bold">
                  {/* Upcoming */}
                  <span className={`px-2 py-1 rounded-full border ${todo.status == 'Upcoming' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-green-100 text-green-700 border-green-200'}`}>Upcoming</span>
                  
                  <div className={`h-px w-2 sm:w-4 ${statusErrorId == todo.id ? 'bg-red-500' : (todo.status == 'Progress' || todo.status == 'Complete' ? 'bg-blue-500' : 'bg-gray-300')}`}></div>
                  
                  {/* Progress */}
                  <span className={`px-2 py-1 rounded-full border ${todo.status == 'Upcoming' ? 'bg-gray-100 text-gray-500 border-gray-200' : todo.status == 'Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-green-100 text-green-700 border-green-200'}`}>Progress</span>
                  
                  <div className={`h-px w-2 sm:w-4 ${statusErrorId == todo.id ? 'bg-red-500' : (todo.status == 'Complete' ? 'bg-green-500' : 'bg-gray-300')}`}></div>
                  
                  {/* Complete */}
                  <span className={`px-2 py-1 rounded-full border ${todo.status == 'Complete' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>Complete</span>
                </div>
                {statusErrorId == todo.id && (
                  <div className="text-red-500 text-[10px] sm:text-xs mt-2 max-w-[200px] sm:max-w-xs text-right font-medium leading-tight">
                    {statusErrorMessage}
                  </div>
                )}
              </div>
            </div>

            <div className="opacity-70 group-hover:opacity-100 transition-opacy">
              <TodoMenu
                todosId={todo.id}
                title={todo.title}
                onEdit={editTodo}
                onStatusChange={updateStatus}
                onDelete={deleteTodo}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Control */}
      {todos.length > 0 && (hasNextPage || loading) && (
        <div className="w-full flex justify-center mt-6">
          <button
            onClick={() => fetchTodos(true)}
            disabled={loading}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Hero;