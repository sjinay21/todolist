import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findByEmail, create, updateUserName, updateUserEmail, updateUserPassword, setUserActiveStatus } from "../models/User.js";

async function register(userData) {
  const { name, email, password, confirmPassword, role } = userData;

  if (password != confirmPassword) {
    const error = new Error("Passwords do not match");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await findByEmail(email);
  if (existingUser) {
    const error = new Error("User already exists with this email");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = await create({ name, email, password: hashedPassword, role: role || "user" });

  return newUser;
}

async function login(email, password) {
  const user = await findByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const payload = { id: user.id, name: user.name, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

  await setUserActiveStatus(user.id, true);

  return token;
}

async function logout(userId) {
  if (userId) {
    await setUserActiveStatus(userId, false);
  }
}

async function updateName(user, name) {
  const updatedUser = await updateUserName(user, name);
  return updatedUser;
}

async function updateEmail(user, email) {
  const existingUser = await findByEmail(email);
  if (existingUser && existingUser.id != user.id) {
    const error = new Error("Email is already registered");
    error.statusCode = 400;
    throw error;
  }

  const updatedUser = await updateUserEmail(user, email);
  return updatedUser;
}

async function updatePassword(user, currentPassword, newPassword) {
  const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
  if (!isPasswordCorrect) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  const updatedUser = await updateUserPassword(user, hashedPassword);
  return updatedUser;
}

export { register, login, logout, updateName, updateEmail, updatePassword };