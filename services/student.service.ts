import * as studentRepo from "@/repositories/student.repository";
import * as userRepo from "@/repositories/user.repository";
import type { Database } from "@/types/database";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  validateWithSchema,
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

type Student = Database["public"]["Tables"]["students"]["Row"];
type PcRole = Database["public"]["Enums"]["pc_role"];

export async function getStudentById(id: number): Promise<Student> {
  const student = await studentRepo.findById(id);
  if (!student) {
    throw new NotFoundError("Student profile", id);
  }
  return student;
}

export async function getStudentByUserId(userId: number): Promise<Student> {
  const student = await studentRepo.findByUserId(userId);
  if (!student) {
    throw new NotFoundError("Student profile for user", userId);
  }
  return student;
}

export async function getStudentByRollNo(
  rollNo: string,
): Promise<Student | null> {
  if (!rollNo || rollNo.trim().length === 0) {
    return null;
  }
  return await studentRepo.findByRollNo(rollNo.trim());
}

export async function listStudents(
  filters: Parameters<typeof studentRepo.findMany>[0] = {},
  options: Parameters<typeof studentRepo.findMany>[1] = {},
): Promise<Student[]> {
  return await studentRepo.findMany(filters, options);
}

export async function registerProfile(
  input: RegisterProfileInput,
): Promise<Student> {
  const validated = validateWithSchema(registerProfileSchema, input);

  const user = await userRepo.findById(validated.userId);
  if (!user) {
    throw new NotFoundError("User", validated.userId);
  }

  const existingProfile = await studentRepo.findByUserId(validated.userId);
  if (existingProfile) {
    throw new ConflictError(
      `User ${validated.userId} already has an associated student profile`,
    );
  }

  const cleanRollNo = validated.rollNo.trim();
  const existingRoll = await studentRepo.findByRollNo(cleanRollNo);
  if (existingRoll) {
    throw new ConflictError(
      `Student with roll number '${cleanRollNo}' already exists`,
    );
  }

  return await studentRepo.create({
    user_id: validated.userId,
    full_name: validated.fullName.trim(),
    roll_no: cleanRollNo,
    contact_no: validated.contactNo ?? null,
    course_name: validated.courseName,
    enrollment_year: validated.enrollmentYear,
    graduation_year: validated.graduationYear,
    cgpa: validated.cgpa ?? null,
    backlogs: validated.backlogs ?? 0,
    active_backlogs: validated.activeBacklogs ?? 0,
    preferred_roles: validated.preferredRoles ?? null,
    resume_storage_path: validated.resumeStoragePath ?? null,
    profile_status: "DRAFT",
    profile_remark: null,
    pc_role: null,
  });
}

export async function updateProfile(
  id: number,
  input: UpdateProfileInput,
): Promise<Student> {
  const current = await getStudentById(id);
  const validated = validateWithSchema(updateProfileSchema, input);

  if (validated.rollNo !== undefined) {
    const cleanRollNo = validated.rollNo.trim();
    if (cleanRollNo !== current.roll_no) {
      const existing = await studentRepo.findByRollNo(cleanRollNo);
      if (existing && existing.id !== id) {
        throw new ConflictError(
          `Roll number '${cleanRollNo}' is already registered to another student`,
        );
      }
    }
  }

  // Cross-field checks combining current values with updated values
  const enrollmentYear = validated.enrollmentYear ?? current.enrollment_year;
  const graduationYear = validated.graduationYear ?? current.graduation_year;
  if (graduationYear < enrollmentYear) {
    throw new ValidationError(
      "Graduation year cannot be earlier than enrollment year",
    );
  }

  const backlogs = validated.backlogs ?? current.backlogs;
  const activeBacklogs = validated.activeBacklogs ?? current.active_backlogs;
  if (activeBacklogs > backlogs) {
    throw new ValidationError("Active backlogs cannot exceed total backlogs");
  }

  const updateData: Parameters<typeof studentRepo.update>[1] = {};

  if (validated.fullName !== undefined)
    updateData.full_name = validated.fullName.trim();
  if (validated.rollNo !== undefined)
    updateData.roll_no = validated.rollNo.trim();
  if (validated.contactNo !== undefined)
    updateData.contact_no = validated.contactNo;
  if (validated.courseName !== undefined)
    updateData.course_name = validated.courseName;
  if (validated.enrollmentYear !== undefined)
    updateData.enrollment_year = validated.enrollmentYear;
  if (validated.graduationYear !== undefined)
    updateData.graduation_year = validated.graduationYear;
  if (validated.cgpa !== undefined) updateData.cgpa = validated.cgpa;
  if (validated.backlogs !== undefined) updateData.backlogs = validated.backlogs;
  if (validated.activeBacklogs !== undefined)
    updateData.active_backlogs = validated.activeBacklogs;
  if (validated.preferredRoles !== undefined)
    updateData.preferred_roles = validated.preferredRoles;
  if (validated.resumeStoragePath !== undefined)
    updateData.resume_storage_path = validated.resumeStoragePath;

  return await studentRepo.update(id, updateData);
}

export async function submitForApproval(studentId: number): Promise<Student> {
  const student = await getStudentById(studentId);

  if (student.profile_status === "APPROVED") {
    throw new ValidationError("Profile is already approved");
  }

  if (student.profile_status === "PENDING_APPROVAL") {
    throw new ValidationError("Profile is already pending approval");
  }

  if (!student.resume_storage_path) {
    throw new ValidationError(
      "Please upload a resume before submitting your profile for approval",
    );
  }

  if (student.cgpa === null || student.cgpa === undefined) {
    throw new ValidationError(
      "Please enter your CGPA before submitting for approval",
    );
  }

  return await studentRepo.update(studentId, {
    profile_status: "PENDING_APPROVAL",
    profile_remark: null,
  });
}

export async function reviewProfile(
  studentId: number,
  decision: "APPROVED" | "DRAFT",
  remark?: string,
): Promise<Student> {
  const validated = validateWithSchema(reviewProfileSchema, {
    decision,
    remark,
  });
  const student = await getStudentById(studentId);

  if (student.profile_status !== "PENDING_APPROVAL") {
    throw new ValidationError(
      `Cannot review profile in '${student.profile_status}' status. Must be PENDING_APPROVAL.`,
    );
  }

  return await studentRepo.update(studentId, {
    profile_status: validated.decision,
    profile_remark:
      validated.remark ??
      (validated.decision === "APPROVED"
        ? "Profile verified and approved"
        : "Changes requested"),
  });
}

export async function assignPcRole(
  studentId: number,
  role: PcRole | null,
): Promise<Student> {
  await getStudentById(studentId);
  return await studentRepo.update(studentId, {
    pc_role: role,
  });
}

export async function updateResume(
  studentId: number,
  resumeStoragePath: string,
): Promise<Student> {
  if (!resumeStoragePath || resumeStoragePath.trim().length === 0) {
    throw new ValidationError("Resume storage path cannot be empty");
  }
  await getStudentById(studentId);
  return await studentRepo.update(studentId, {
    resume_storage_path: resumeStoragePath.trim(),
  });
}

export async function updateProfileEmbedding(
  studentId: number,
  embedding: string,
): Promise<Student> {
  await getStudentById(studentId);
  return await studentRepo.update(studentId, {
    profile_embedding: embedding,
  });
}

export async function deleteStudent(studentId: number): Promise<void> {
  await getStudentById(studentId);
  await studentRepo.remove(studentId);
}
