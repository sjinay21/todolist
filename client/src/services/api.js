import { DEFAULT_PAGINATION_LIMIT } from "../config/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const customFetch = async (endpoint, options = {}) => {
  options.credentials = "include";
  if (!options.headers) {
    options.headers = {};
  }
  const fullUrl = API_URL + endpoint;
  const response = await fetch(fullUrl, options);
  if (response.status == 401 && !location.href.includes("login")) {
    localStorage.removeItem("role");
    location.href = "/login";
  }
  return response;
};

// Authentication
export const loginUser = (data) => customFetch("/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const registerUser = (data) => customFetch("/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const logoutUser = () => customFetch("/logout", {
  method: "POST",
});

export const updateProfile = (data) => customFetch("/update", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const getProfile = () => customFetch("/profile");

// Todos
export const getTodos = (limit = DEFAULT_PAGINATION_LIMIT, cursor = null) => {
  const params = new URLSearchParams();
  params.append("limit", String(limit));

  if (cursor !== null) {
    params.append("cursor", String(cursor));
  }

  return customFetch(`/todos?${params.toString()}`);
};

export const createTodo = (data) => customFetch("/todos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const updateTodo = (id, data) => customFetch(`/todos/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const removeTodo = (id) => customFetch(`/todos/${id}`, {
  method: "DELETE",
});

// Admin
export const getAdminUsers = (limit = DEFAULT_PAGINATION_LIMIT, offset = 0, search = "") => {
  const params = new URLSearchParams();
  params.append("limit", String(limit));
  params.append("offset", String(offset));
  if (search) {
      params.append("search", search);
  }

  return customFetch(`/api/admin/tododetail?${params.toString()}`);
};

export const searchAdminUsers = (limit = 10, offset = 0, search = "") => {
  const params = new URLSearchParams();
  params.append("limit", String(limit));
  params.append("offset", String(offset));
  if (search) {
      params.append("search", search);
  }

  return customFetch(`/api/admin/search-users?${params.toString()}`);
};

export const updateAdminTodo = (id, data) => customFetch(`/api/admin/todos/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});