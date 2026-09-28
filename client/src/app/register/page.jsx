"use client";
import { useState } from "react";
import { registerSchema } from "@/scheme/userSchema";
import { registerUser } from "@/services/api";
import { useAppNavigation } from "@/hooks/useNavigation";

export default function Register() {
  const { goToLogin } = useAppNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {name,email,password,confirmPassword,role};
    try {
      await registerSchema.validate(formData, {
        abortEarly: false,
      });

      setErrors({});
      setMessage("");

      const response = await registerUser(formData);

      const result = await response.json();

      if (!response.ok) {
        setIsSuccess(false);
        setMessage(result.message || "Registration failed");
        return;
      }
      setIsSuccess(true);
      setMessage(result.message);
      console.log("Registration successful:", result);
      goToLogin();
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
    setIsSuccess(false);
    setMessage("Something went wrong");
  }
}
};
  return (
    <div className="flex flex-col items-center border border-black p-6 w-full max-w-md mx-auto mt-20">
      <h1 className="font-bold text-xl mb-6">Create Account</h1>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-md font-medium text-black mb-2"
          >
            Name
          </label>

          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-3 border rounded-lg border-black"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

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

          {errors.email && <p className="text-red-500">{errors.email}</p>}
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

          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-md font-medium text-black mb-2"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="w-full px-4 py-3 border rounded-lg border-black"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-md font-medium text-black mb-2"
          >
            Role
          </label>

          <select
            id="role"
            name="role"
            className="w-full px-4 py-3 border rounded-lg border-black bg-white"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="">Select your role</option>

            <option value="user">User</option>

            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-500">{errors.role}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
        >
          Create Account
        </button>
      </form>
      {message && <p className={`mb-4 text-center ${isSuccess ? "text-green-500" : "text-red-500"}`}>{message}</p>}
    </div>
  );
}
