import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(3,"Name must be of min 3 letters")
    .matches(/^[a-zA-Z ]+$/, "Name can only contain letters and spaces")
    .required("Name is required"),

  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf(
      [yup.ref("password")],
      "Passwords do not match"
    ),
    role: yup
  .string()
  .oneOf(["user", "admin"], "Please select a valid role")
  .required("Role is required"),
});
export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const updateProfileSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 letters")
    .matches(/^[a-zA-Z ]+$/, "Name can only contain letters and spaces")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  currentPassword: yup.string(),
  newPassword: yup.string()
    .test('min-length', 'Password must be at least 6 characters', val => !val || val.length >= 6),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], "Passwords do not match")
});