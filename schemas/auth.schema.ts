import { z } from "zod";

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "Invalid email address" });

export const passwordField = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .max(72, { message: "Password must be at most 72 characters" });

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, { message: "Old password is required" }),
  newPassword: passwordField,
});

export const resetUserPasswordSchema = z.object({
  newPassword: passwordField,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetUserPasswordInput = z.infer<typeof resetUserPasswordSchema>;
