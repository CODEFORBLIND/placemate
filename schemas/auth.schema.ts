import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(72, { message: "Password must be at most 72 characters" }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }).max(72),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Invalid email address" })
      .optional(),
    oldPassword: z.string().min(1).optional(),
    newPassword: z
      .string()
      .min(6, { message: "New password must be at least 6 characters" })
      .max(72, { message: "New password must be at most 72 characters" }),
  })
  .refine((data) => data.email || data.oldPassword, {
    message: "Either email or oldPassword must be provided",
    path: ["email"],
  })
  .refine((data) => !(data.email && data.oldPassword), {
    message: "Provide either email or oldPassword, not both",
    path: ["email"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
