import * as userRepo from "@/repositories/user.repository";
import type { User } from "@/repositories/user.repository";
import { hashPassword } from "@/lib/auth";
import { NotFoundError, ConflictError, validate } from "./errors";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/schemas/user.schema";

export type { CreateUserInput, UpdateUserInput };
export type { User };

export async function getById(id: number): Promise<User> {
  const user = await userRepo.findById(id);
  if (!user) throw new NotFoundError("User", id);
  return user;
}

export async function getByEmail(email: string): Promise<User | null> {
  if (!email.trim()) return null;
  return userRepo.findByEmail(email);
}

export async function list(page = 1, limit = 20): Promise<User[]> {
  return userRepo.findMany(page, limit);
}

export async function create(input: CreateUserInput): Promise<User> {
  const data = validate(createUserSchema, input);
  const existing = await userRepo.findByEmail(data.email);
  if (existing) throw new ConflictError("This email is already registered");
  return userRepo.create({
    email: data.email,
    password_hash: await hashPassword(data.password),
    is_active: true,
  });
}

export async function update(
  id: number,
  input: UpdateUserInput,
): Promise<User> {
  await getById(id);
  const data = validate(updateUserSchema, input);
  if (data.email !== undefined) {
    const existing = await userRepo.findByEmail(data.email);
    if (existing && existing.id !== id)
      throw new ConflictError("This email is already in use");
  }
  return userRepo.update(id, {
    email: data.email,
    is_active: data.isActive,
  });
}

export async function setActive(id: number, isActive: boolean): Promise<User> {
  await getById(id);
  return userRepo.update(id, { is_active: isActive });
}

export async function remove(id: number): Promise<void> {
  await getById(id);
  await userRepo.remove(id);
}

export function toPublic(user: User) {
  return {
    id: user.id,
    email: user.email,
    isActive: user.is_active,
    lastLoginAt: user.last_login_at,
  };
}
