import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address format" }),
  passwordHash: z
    .string()
    .trim()
    .min(1, { message: "Password hash is required" }),
});

export const updateUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address format" })
    .optional(),
  passwordHash: z
    .string()
    .trim()
    .min(1, { message: "Password hash cannot be empty" })
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
