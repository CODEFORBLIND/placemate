import type { NextRequest } from "next/server";
import { tokenFromRequest, readToken } from "./auth";
import { UnauthorizedError, ForbiddenError } from "@/services/errors";
import * as userRepo from "@/repositories/user.repository";
import * as studentRepo from "@/repositories/student.repository";
import type { User } from "@/repositories/user.repository";
import type { Student } from "@/repositories/student.repository";

export type Session = {
  user: User;
  student: Student | null;
  isPc: boolean;
  isApproved: boolean;
};

export async function getSession(request: NextRequest): Promise<Session> {
  const token = tokenFromRequest(request);
  if (!token) throw new UnauthorizedError();
  const data = readToken(token);
  if (!data)
    throw new UnauthorizedError("Session expired, please log in again");
  const user = await userRepo.findById(data.userId);
  if (!user) throw new UnauthorizedError("Please log in again");
  if (!user.is_active) throw new UnauthorizedError("Account is deactivated");
  const student = await studentRepo.findByUserId(user.id);
  const isPc =
    student?.pc_role === "MEMBER" || student?.pc_role === "COORDINATOR";
  return {
    user,
    student,
    isPc,
    isApproved: student?.profile_status === "APPROVED",
  };
}

export function requirePc(session: Session) {
  if (!session.isPc)
    throw new ForbiddenError("Only placement cell members can do this");
}

export function requireApproved(session: Session) {
  if (session.isPc) return;
  if (!session.student) throw new ForbiddenError("Complete your profile first");
  if (session.student.profile_status !== "APPROVED")
    throw new ForbiddenError("Your profile is not approved yet");
}

export function requireStudentAccess(session: Session, studentId: number) {
  if (session.isPc) return;
  if (session.student?.id !== studentId)
    throw new ForbiddenError("You can only access your own data");
}

export function ownStudentId(session: Session): number {
  if (!session.student) throw new ForbiddenError("Complete your profile first");
  return session.student.id;
}
