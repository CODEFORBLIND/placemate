import * as userRepo from "@/repositories/user.repository";
import * as studentRepo from "@/repositories/student.repository";
import { hashPassword, verifyPassword, signToken } from "@/lib/auth";
import {
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  validate,
} from "./errors";
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  resetUserPasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ChangePasswordInput,
  type ResetUserPasswordInput,
} from "@/schemas/auth.schema";

export type {
  LoginInput,
  RegisterInput,
  ChangePasswordInput,
  ResetUserPasswordInput,
};

export async function register(input: RegisterInput) {
  const data = validate(registerSchema, input);
  const existing = await userRepo.findByEmail(data.email);
  if (existing) throw new ConflictError("This email is already registered");
  const user = await userRepo.create({
    email: data.email,
    password_hash: await hashPassword(data.password),
    is_active: true,
  });
  return { id: user.id, email: user.email };
}

export async function login(input: LoginInput) {
  const data = validate(loginSchema, input);
  const user = await userRepo.findByEmail(data.email);
  if (!user) throw new UnauthorizedError("Invalid email or password");
  if (!user.is_active) throw new UnauthorizedError("Account is deactivated");
  const ok = await verifyPassword(data.password, user.password_hash);
  if (!ok) throw new UnauthorizedError("Invalid email or password");
  await userRepo.update(user.id, {
    last_login_at: new Date().toISOString(),
  });
  const token = signToken({ userId: user.id, email: user.email });
  return { token, user: { id: user.id, email: user.email } };
}

export async function getMe(userId: number) {
  const user = await userRepo.findById(userId);
  if (!user) throw new NotFoundError("User", userId);
  const student = await studentRepo.findByUserId(user.id);
  const isPc =
    student?.pc_role === "MEMBER" || student?.pc_role === "COORDINATOR";
  return {
    user: { id: user.id, email: user.email, isActive: user.is_active },
    student,
    isPc,
    isApproved: student?.profile_status === "APPROVED",
  };
}

export async function changePassword(
  userId: number,
  input: ChangePasswordInput,
) {
  const data = validate(changePasswordSchema, input);
  const user = await userRepo.findById(userId);
  if (!user) throw new UnauthorizedError("Please log in again");
  const ok = await verifyPassword(data.oldPassword, user.password_hash);
  if (!ok) throw new UnauthorizedError("Old password is incorrect");
  await userRepo.update(user.id, {
    password_hash: await hashPassword(data.newPassword),
  });
  return { id: user.id, email: user.email };
}

export async function resetUserPassword(
  userId: number,
  input: ResetUserPasswordInput,
) {
  const data = validate(resetUserPasswordSchema, input);
  const user = await userRepo.findById(userId);
  if (!user) throw new NotFoundError("User", userId);
  await userRepo.update(user.id, {
    password_hash: await hashPassword(data.newPassword),
  });
  return { id: user.id, email: user.email };
}

export async function refreshToken(userId: number) {
  const user = await userRepo.findById(userId);
  if (!user) throw new UnauthorizedError("Please log in again");
  if (!user.is_active) throw new UnauthorizedError("Account is deactivated");
  return signToken({ userId: user.id, email: user.email });
}
