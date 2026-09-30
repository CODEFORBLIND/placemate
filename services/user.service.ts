import * as userRepo from "@/repositories/user.repository";
import type { Database } from "@/types/database";
import { NotFoundError, ConflictError, validateWithSchema } from "./errors";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/schemas/user.schema";

export type { CreateUserInput, UpdateUserInput };

type User = Database["public"]["Tables"]["users"]["Row"];

export async function getUserById(id: number): Promise<User> {
  const user = await userRepo.findById(id);
  if (!user) {
    throw new NotFoundError("User", id);
  }
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  if (!email || email.trim().length === 0) {
    return null;
  }
  return await userRepo.findByEmail(email.trim().toLowerCase());
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const validated = validateWithSchema(createUserSchema, input);

  const normalizedEmail = validated.email.toLowerCase();

  const existingUser = await userRepo.findByEmail(normalizedEmail);
  if (existingUser) {
    throw new ConflictError(
      `User with email '${normalizedEmail}' already exists`,
    );
  }

  return await userRepo.create({
    email: normalizedEmail,
    password_hash: validated.passwordHash,
    is_active: true,
  });
}

export async function updateUser(
  id: number,
  input: UpdateUserInput,
): Promise<User> {
  await getUserById(id);
  const validated = validateWithSchema(updateUserSchema, input);

  const updatePayload: Parameters<typeof userRepo.update>[1] = {};

  if (validated.email !== undefined) {
    const normalizedEmail = validated.email.toLowerCase();
    const existingUser = await userRepo.findByEmail(normalizedEmail);
    if (existingUser && existingUser.id !== id) {
      throw new ConflictError(`Email '${normalizedEmail}' is already in use`);
    }
    updatePayload.email = normalizedEmail;
  }

  if (validated.passwordHash !== undefined) {
    updatePayload.password_hash = validated.passwordHash;
  }

  if (validated.isActive !== undefined) {
    updatePayload.is_active = validated.isActive;
  }

  return await userRepo.update(id, updatePayload);
}

export async function deactivateUser(id: number): Promise<User> {
  return await updateUser(id, { isActive: false });
}

export async function activateUser(id: number): Promise<User> {
  return await updateUser(id, { isActive: true });
}

export async function recordLogin(id: number): Promise<User> {
  await getUserById(id);
  return await userRepo.update(id, {
    last_login_at: new Date().toISOString(),
  });
}
