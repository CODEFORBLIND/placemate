import * as applicationRepo from "@/repositories/application.repository";
import * as studentRepo from "@/repositories/student.repository";
import * as jobRepo from "@/repositories/job.repository";
import type { Application } from "@/repositories/application.repository";
import type { Database } from "@/types/database";
import { checkEligibility } from "./job.service";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  ForbiddenError,
  validate,
} from "./errors";
import {
  applySchema,
  updateApplicationStatusSchema,
  type ApplyInput,
  type UpdateApplicationStatusInput,
} from "@/schemas/application.schema";

export type { ApplyInput, UpdateApplicationStatusInput };
export type { Application };

type Status = Database["public"]["Enums"]["application_status"];

const nextAllowed: Record<Status, Status[]> = {
  APPLIED: ["SHORTLISTED", "INTERVIEWING", "REJECTED"],
  SHORTLISTED: ["INTERVIEWING", "OFFERED", "REJECTED"],
  INTERVIEWING: ["OFFERED", "REJECTED"],
  OFFERED: ["REJECTED"],
  REJECTED: [],
};

export async function getById(id: number): Promise<Application> {
  const application = await applicationRepo.findById(id);
  if (!application) throw new NotFoundError("Application", id);
  return application;
}

export async function listByStudent(
  studentId: number,
  status?: Status,
  page = 1,
  limit = 20,
): Promise<Application[]> {
  const student = await studentRepo.findById(studentId);
  if (!student) throw new NotFoundError("Student", studentId);
  return applicationRepo.findMany({ studentId, status }, page, limit);
}

export async function listByJob(
  jobId: number,
  status?: Status,
  page = 1,
  limit = 20,
): Promise<Application[]> {
  const job = await jobRepo.findById(jobId);
  if (!job) throw new NotFoundError("Job", jobId);
  return applicationRepo.findMany({ jobId, status }, page, limit);
}

export async function apply(
  studentId: number,
  jobId: number,
): Promise<Application> {
  const data = validate(applySchema, { studentId, jobId });
  const existing = await applicationRepo.findByStudentAndJob(
    data.studentId,
    data.jobId,
  );
  if (existing)
    throw new ConflictError("You have already applied for this job");
  const result = await checkEligibility(data.jobId, data.studentId);
  if (!result.eligible)
    throw new ValidationError(`Not eligible: ${result.reasons.join(". ")}`);
  return applicationRepo.create({
    student_id: data.studentId,
    job_id: data.jobId,
    status: "APPLIED",
    applied_on: new Date().toISOString().split("T")[0],
  });
}

export async function setStatus(
  id: number,
  status: Status,
  remark?: string,
): Promise<Application> {
  const data = validate(updateApplicationStatusSchema, { status, remark });
  const current = await getById(id);
  if (current.status === data.status) return current;
  if (!nextAllowed[current.status].includes(data.status))
    throw new ValidationError(
      `Cannot move application from ${current.status} to ${data.status}`,
    );
  return applicationRepo.update(id, {
    status: data.status,
    remark: data.remark ?? current.remark,
  });
}

export async function withdraw(
  id: number,
  studentId: number,
): Promise<Application> {
  const application = await getById(id);
  if (application.student_id !== studentId)
    throw new ForbiddenError("This application is not yours");
  if (application.status !== "APPLIED")
    throw new ValidationError("Only fresh applications can be withdrawn");
  return applicationRepo.update(id, {
    status: "REJECTED",
    remark: "Withdrawn by student",
  });
}

export async function remove(id: number): Promise<void> {
  await getById(id);
  await applicationRepo.remove(id);
}
