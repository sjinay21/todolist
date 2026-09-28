"use client";

import { useState } from "react";
import { loginSchema } from "@/scheme/userSchema";
import { loginUser } from "@/services/api";
import { useAppNavigation } from "@/hooks/useNavigation";

export default function Login() {
  const { goToAdmin, goToTodos } = useAppNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      email,
      password,
    };

    try {
      await loginSchema.validate(formData, {
        abortEarly: false,
      });

      setErrors({});
      setMessage("");
      setMessageType("");

      const response = await loginUser(formData);

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Login failed");
        setMessageType("error");
        return;
      }

      localStorage.setItem("role", result.role);

      setMessage(result.message || "Login successful");
      setMessageType("success");

      if (result.role == "admin") {
        console.log("Selected redirect path: /admin");
        goToAdmin();
      } else {
        console.log("Selected redirect path: /todos");
        goToTodos();
      }
    } catch (error) {
      if (error.inner) {
        const newErrors = {};

        for (let i = 0; i < error.inner.length; i++) {
          const err = error.inner[i];
          newErrors[err.path] = err.message;
        }

        setErrors(newErrors);
      } else {
        console.error("Error:", error);
        setMessage("Something went wrong");
        setMessageType("error");
      }
    }
  };

  return (
    <div className="flex flex-col items-center border border-black p-6 w-full max-w-md mx-auto mt-20">
      <h1 className="font-bold text-xl mb-6">
        Login to your Account
      </h1>

      <form className="w-full" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-md font-medium text-black mb-2"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 border rounded-lg border-black"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          {errors.email && (
            <p className="text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-md font-medium text-black mb-2"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 border rounded-lg border-black"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {errors.password && (
            <p className="text-red-500">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
        >
          Login
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center ${
            messageType == "success"
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}