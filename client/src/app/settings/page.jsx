"use client";

import { useState, useEffect } from "react";
import { updateProfile, getProfile } from "@/services/api";
import { updateProfileSchema } from "@/scheme/userSchema";

export default function Settings() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(true);
  const [initialData, setInitialData] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setFormData(prev => ({
              ...prev,
              name: data.user.name || "",
              email: data.user.email || ""
            }));
            setInitialData({
              name: data.user.name || "",
              email: data.user.email || ""
            });
          }
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    const isNameUnchanged = formData.name.trim() === initialData.name;
    const isEmailUnchanged = formData.email.trim() === initialData.email;
    const isPasswordUnchanged = !formData.newPassword;

    if (isNameUnchanged && isEmailUnchanged && isPasswordUnchanged) {
      setErrors({ general: "Please update your information before clicking on update profile button" });
      setLoading(false);
      return;
    }

    try {
      // Validate all fields using Yup
      await updateProfileSchema.validate(formData, { abortEarly: false });
      
      // Custom cross-validation logic
      if (formData.newPassword && !formData.currentPassword) {
        setErrors({ currentPassword: "Current password is required to set a new password" });
        setLoading(false);
        return;
      }

      // Build payload
      const payload = {};
      if (formData.name.trim()) payload.name = formData.name.trim();
      if (formData.email.trim()) payload.email = formData.email.trim();
      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.password = formData.newPassword;
        payload.confirmPassword = formData.confirmPassword;
      }

      const response = await updateProfile(payload);
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Profile updated successfully");
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      } else {
        setErrors({ general: data.message || "Failed to update profile" });
      }
    } catch (err) {
      if (err.inner) {
        // Map Yup validation errors
        const validationErrors = {};
        err.inner.forEach(e => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ general: "Something went wrong" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return <div className="pt-24 px-4 text-center text-gray-500 font-medium">Loading profile...</div>;
  }

  return (
    <div className="pt-24 px-4 min-h-screen bg-gray-50 pb-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account preferences</p>
        </div>

        <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
          </div>
          
          <div className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-1 focus:ring-blue-500'}`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-1 focus:ring-blue-500'}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <hr className="border-gray-100 my-6" />
            <h3 className="text-md text-gray-800 mb-4">Change Password </h3>

            <div className="space-y-5 max-w-md">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.currentPassword ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-1 focus:ring-blue-500'}`}
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
                {errors.currentPassword && <p className="text-sm text-red-500 mt-1">{errors.currentPassword}</p>}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="At least 6 characters"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.newPassword ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-1 focus:ring-blue-500'}`}
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Retype new password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${errors.confirmPassword ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-1 focus:ring-blue-500'}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Error and Success Messages */}
            {errors.general && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}
            {message && (
              <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg text-sm">
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 flex justify-end border-t border-gray-100 mt-6 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow-sm w-full sm:w-auto transition-colors"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
