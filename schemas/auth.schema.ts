import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email({ message: "Invalid email address" })
      .optional(),
    oldPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(6, { message: "New password must be at least 6 characters" }),
  })
  .refine((data) => data.email || data.oldPassword, {
    message: "Either email or oldPassword must be provided",
    path: ["email"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
