import * as studentRepo from "@/repositories/student.repository";
import * as userRepo from "@/repositories/user.repository";
import type {
  Student,
  StudentFilters,
} from "@/repositories/student.repository";
import type { Database } from "@/types/database";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  validate,
} from "./errors";
import {
  registerProfileSchema,
  updateProfileSchema,
  reviewProfileSchema,
  type RegisterProfileInput,
  type UpdateProfileInput,
  type ReviewProfileInput,
} from "@/schemas/student.schema";

export type { RegisterProfileInput, UpdateProfileInput, ReviewProfileInput };
export type { Student };

type PcRole = Database["public"]["Enums"]["pc_role"];

export async function getById(id: number): Promise<Student> {
  const student = await studentRepo.findById(id);
  if (!student) throw new NotFoundError("Student", id);
  return student;
}

export async function getByUserId(userId: number): Promise<Student | null> {
  return studentRepo.findByUserId(userId);
}

export async function requireByUserId(userId: number): Promise<Student> {
  const student = await studentRepo.findByUserId(userId);
  if (!student) throw new NotFoundError("Profile for user", userId);
  return student;
}

export async function list(
  filters: StudentFilters = {},
  page = 1,
  limit = 20,
): Promise<Student[]> {
  return studentRepo.findMany(filters, page, limit);
}

export async function createProfile(
  userId: number,
  input: RegisterProfileInput,
): Promise<Student> {
  const data = validate(registerProfileSchema, input);
  const user = await userRepo.findById(userId);
  if (!user) throw new NotFoundError("User", userId);
  const existing = await studentRepo.findByUserId(userId);
  if (existing) throw new ConflictError("You already have a profile");
  const rollTaken = await studentRepo.findByRollNo(data.rollNo);
  if (rollTaken) throw new ConflictError("This roll number is already used");
  return studentRepo.create({
    user_id: userId,
    full_name: data.fullName,
    roll_no: data.rollNo,
    contact_no: data.contactNo ?? null,
    course_name: data.courseName,
    enrollment_year: data.enrollmentYear,
    graduation_year: data.graduationYear,
    cgpa: data.cgpa ?? null,
    backlogs: data.backlogs,
    active_backlogs: data.activeBacklogs,
    preferred_roles: data.preferredRoles ?? null,
    resume_storage_path: data.resumeStoragePath ?? null,
    profile_status: "DRAFT",
  });
}

export async function updateProfile(
  id: number,
  input: UpdateProfileInput,
): Promise<Student> {
  const current = await getById(id);
  const data = validate(updateProfileSchema, input);

  if (data.rollNo !== undefined && data.rollNo !== current.roll_no) {
    const taken = await studentRepo.findByRollNo(data.rollNo);
    if (taken && taken.id !== id)
      throw new ConflictError("This roll number is already used");
  }

  const enrollmentYear = data.enrollmentYear ?? current.enrollment_year;
  const graduationYear = data.graduationYear ?? current.graduation_year;
  if (graduationYear < enrollmentYear)
    throw new ValidationError(
      "Graduation year cannot be earlier than enrollment year",
    );

  const backlogs = data.backlogs ?? current.backlogs;
  const activeBacklogs = data.activeBacklogs ?? current.active_backlogs;
  if (activeBacklogs > backlogs)
    throw new ValidationError("Active backlogs cannot exceed total backlogs");

  return studentRepo.update(id, {
    full_name: data.fullName,
    roll_no: data.rollNo,
    contact_no: data.contactNo,
    course_name: data.courseName,
    enrollment_year: data.enrollmentYear,
    graduation_year: data.graduationYear,
    cgpa: data.cgpa,
    backlogs: data.backlogs,
    active_backlogs: data.activeBacklogs,
    preferred_roles: data.preferredRoles,
    resume_storage_path: data.resumeStoragePath,
  });
}

export async function submitForApproval(id: number): Promise<Student> {
  const student = await getById(id);
  if (student.profile_status === "APPROVED")
    throw new ValidationError("Profile is already approved");
  if (student.profile_status === "PENDING_APPROVAL")
    throw new ValidationError("Profile is already waiting for approval");
  if (!student.resume_storage_path)
    throw new ValidationError("Upload your resume before submitting");
  if (student.cgpa === null)
    throw new ValidationError("Enter your CGPA before submitting");
  return studentRepo.update(id, {
    profile_status: "PENDING_APPROVAL",
    profile_remark: null,
  });
}

export async function reviewProfile(
  id: number,
  input: ReviewProfileInput,
): Promise<Student> {
  const data = validate(reviewProfileSchema, input);
  const student = await getById(id);
  if (student.profile_status !== "PENDING_APPROVAL")
    throw new ValidationError(
      "Only profiles waiting for approval can be reviewed",
    );
  return studentRepo.update(id, {
    profile_status: data.decision,
    profile_remark: data.remark ?? null,
  });
}

export async function setPcRole(
  id: number,
  role: PcRole | null,
): Promise<Student> {
  await getById(id);
  return studentRepo.update(id, { pc_role: role });
}

export async function setResume(
  id: number,
  resumeStoragePath: string,
): Promise<Student> {
  const path = resumeStoragePath.trim();
  if (!path) throw new ValidationError("Resume path cannot be empty");
  await getById(id);
  return studentRepo.update(id, { resume_storage_path: path });
}

export async function remove(id: number): Promise<void> {
  await getById(id);
  await studentRepo.remove(id);
}
