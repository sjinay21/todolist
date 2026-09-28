import * as authService from "../services/authService.js";
import jwt from "jsonwebtoken";
async function register(req, res) {
  try {
    await authService.register(req.body);
    res.status(201).json({ message: "Registration successful. Please log in." });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    const token = await authService.login(email, password);
    const decoded = jwt.decode(token);
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 });
    res.json({ message: "Login successful", token, role: decoded.role });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
}

async function logout(req, res) {
  try {
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await authService.logout(decoded.id);
      } catch (err) {
        // Ignore token errors on logout
      }
    }
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateProfile(req, res) {
  try {
    const user = req.user;
    const { name, email, password, currentPassword } = req.body;
    if (name) {
      await authService.updateName(user, name);
    }
    if (email) {
      await authService.updateEmail(user, email);
    }
    if (password && currentPassword) {
      await authService.updatePassword(user, currentPassword, password);
    }
    res.status(200).json({
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ message: "Server error during profile update" });
  }
}

async function getProfile(req, res) {
  try {
    const user = req.user;
    console.log("getProfile user:", user.id);
    const responsePayload = {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
    console.log("getProfile payload:", responsePayload);
    res.status(200).json(responsePayload);
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ message: "Server error during fetching profile" });
  }
}

export { register, login, logout, updateProfile, getProfile };