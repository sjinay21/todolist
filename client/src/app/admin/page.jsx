"use client";

import React, { useState, useEffect } from "react";
import { getAdminUsers, updateAdminTodo, logoutUser, searchAdminUsers } from "@/services/api";
import { DEFAULT_PAGINATION_LIMIT } from "@/config/constants";
import { useAppNavigation } from "@/hooks/useNavigation";

export default function AdminDashboard() {
  const { goToTodos } = useAppNavigation();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_PAGINATION_LIMIT);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editError, setEditError] = useState("");
  
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalSearchInput, setModalSearchInput] = useState("");
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalUsers, setModalUsers] = useState([]);
  
  // State for the edit modal
  const [editingTodo, setEditingTodo] = useState(null);
  const [editForm, setEditForm] = useState({ 
    title: "", 
    description: "", 
    status: "", 
    original_user_id: "", 
    transfer_user_id: "" 
  });

  const groupedUsers = React.useMemo(() => {
    const groups = {};
    users.forEach(row => {
      if (!groups[row.user_id]) {
        groups[row.user_id] = {
          user_id: row.user_id,
          user_name: row.user_name,
          user_email: row.user_email,
          user_role: row.user_role,
          todos: []
        };
      }
      if (row.todo_id) {
        groups[row.user_id].todos.push({
          todo_id: row.todo_id,
          todo_title: row.todo_title,
          todo_description: row.todo_description,
          todo_status: row.todo_status
        });
      }
    });
    return Object.values(groups);
  }, [users]);

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      goToTodos();
      return;
    }
    fetchUsersAndTodos(false, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setModalSearchTerm(modalSearchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [modalSearchInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users specifically for the dropdown modal
  useEffect(() => {
    if (!editingTodo) return;
    const fetchModalUsers = async () => {
      try {
        const res = await searchAdminUsers(10, 0, modalSearchTerm);
        const data = await res.json();
        if (res.ok && data.success) {
          setModalUsers(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchModalUsers();
  }, [modalSearchTerm, editingTodo]);

  // Old offset pagination logic - kept for reference
  /*
  const fetchUsersAndTodos = async () => {
    try {
      const res = await getAdminUsers();

      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.data);
      } else {
        setError(data.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching data.");
    }
  };
  */

  const fetchUsersAndTodos = async (isNextPage = false, currentSearch = searchTerm) => {
    try {
      setIsLoading(true);
      const currentOffset = isNextPage ? offset + limit : 0;
      
      const res = await getAdminUsers(limit, currentOffset, currentSearch);
      const data = await res.json();
      
      if (res.ok && data.success) {
        if (isNextPage) {
          setUsers(prev => [...prev, ...data.data]);
        } else {
          setUsers(data.data);
        }
        setOffset(currentOffset);
        setTotalUsers(data.pagination?.totalUsers || 0);
        setHasNextPage(data.pagination?.hasNextPage || false);
      } else {
        setError(data.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (todo, userId) => {
    setEditingTodo(todo);
    setModalSearchInput(""); // Reset typing state
    setModalSearchTerm(""); // Reset debounced state
    setEditError("");
    setEditForm({
      title: todo.title,
      description: todo.description || "",
      status: todo.status,
      original_user_id: userId, // Store the backup right here in the form!
      transfer_user_id: "" // This empty string controls the dropdown
    });
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    setEditError("");
    
    // Status validation
    const currentStatus = editingTodo.status;
    const newStatus = editForm.status;
    
    let isValid = false;
    if (currentStatus == newStatus) isValid = true;
    else if (currentStatus == "Upcoming" && newStatus == "Progress") isValid = true;
    else if (currentStatus == "Progress" && newStatus == "Complete") isValid = true;
    else if (currentStatus == "Progress" && newStatus == "Upcoming") isValid = true;
    else if (currentStatus == "Complete" && newStatus == "Progress") isValid = true;

    if (!isValid) {
      if (currentStatus == "Upcoming" && newStatus == "Complete") {
        setEditError(`You must move the todo from Upcoming to Progress before marking it Complete.`);
      } else if (currentStatus == "Complete" && newStatus == "Upcoming") {
        setEditError(`You must move the todo from Complete to Progress before marking it Upcoming.`);
      } else {
        setEditError(`Invalid status transition.`);
      }
      return;
    }

    // If they left the dropdown blank, send the original user ID instead
    const payload = {
      title: editForm.title,
      description: editForm.description,
      status: editForm.status,
      user_id: editForm.transfer_user_id || editForm.original_user_id
    };

    try {
      const res = await updateAdminTodo(editingTodo.id, payload);

      const data = await res.json();
      if (res.ok && data.success) {
        // Refresh the list to show updated data
        fetchUsersAndTodos();
        setEditingTodo(null);
      } else {
        setEditError(data.message || "Failed to update todo");
      }
    } catch (err) {
      console.error(err);
      setEditError("An error occurred while updating todo.");
    }
  };
  return (
    <div className="pt-24 px-4 min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Total Users: {totalUsers}</p>
          </div>
          <input
            type="search"
            placeholder="Search users or todos..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {groupedUsers.length == 0 ? (
          <div className="text-center py-12 text-gray-500">No users found matching your search.</div>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {groupedUsers.map((user) => (
              <div key={user.user_id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-100">
                  <h2 className="font-bold text-lg text-gray-800">{user.user_name}</h2>
                  <p className="text-sm text-gray-500">{user.user_email} | {user.user_role}</p>
                </div>
                
                <div className="p-4">
                  {user.todos.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No todos for this user.</p>
                  ) : (
                    <div className="space-y-3">
                      {user.todos.map((todo) => (
                        <div key={todo.todo_id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-gray-800">{todo.todo_title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              todo.todo_status == 'Complete' ? 'bg-green-100 text-green-700' :
                              todo.todo_status == 'Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {todo.todo_status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2 truncate">{todo.todo_description || "No description"}</p>
                          <button 
                            onClick={() => openEditModal({
                              id: todo.todo_id,
                              title: todo.todo_title,
                              description: todo.todo_description,
                              status: todo.todo_status
                            }, user.user_id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Edit Todo
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination Control */}
        {users.length > 0 && (
          <div className="w-full flex justify-center mt-10">
            <button
              onClick={() => fetchUsersAndTodos(true)}
              disabled={isLoading || !hasNextPage}
              className="px-6 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg transition-colors hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTodo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
            {editError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded-lg text-sm">
                {editError}
              </div>
            )}
            <form onSubmit={handleUpdateTodo}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editForm.title}
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editForm.description}
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                  rows="3"
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2`}
                  value={editForm.status}
                  onChange={e => setEditForm({...editForm, status: e.target.value})}
                >
                  <option value="Upcoming" disabled={editingTodo.status === "Complete"}>Upcoming</option>
                  <option value="Progress">Progress</option>
                  <option value="Complete" disabled={editingTodo.status === "Upcoming"}>Complete</option>
                </select>
              </div>

              {/* Added: Transfer To User Dropdown with Search */}
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Transfer To User</label>
                <input
                  type="search"
                  placeholder="Search and select user..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={modalSearchInput}
                  onChange={(e) => {
                    setModalSearchInput(e.target.value);
                    setEditForm({...editForm, transfer_user_id: ""}); // Clear selection if they start typing again
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                />
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {modalUsers.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500 text-center">No users found</div>
                    ) : (
                      modalUsers.map((u, index) => (
                          <div 
                            key={`${u.user_id}-${index}`}
                            onMouseDown={() => {
                              setEditForm({...editForm, transfer_user_id: u.user_id});
                              setModalSearchInput(u.user_name);
                              setIsDropdownOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-800 transition-colors"
                          >
                            {u.user_name}
                          </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setEditingTodo(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
