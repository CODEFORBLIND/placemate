import * as applicationRepo from "@/repositories/application.repository";
import * as jobRepo from "@/repositories/job.repository";
import * as studentRepo from "@/repositories/student.repository";
import { checkStudentEligibility } from "./job.service";
import type { Database } from "@/types/database";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  ForbiddenError,
  validateWithSchema,
} from "./errors";
import {
  applySchema,
  updateApplicationStatusSchema,
  type ApplyInput,
  type UpdateApplicationStatusInput,
} from "@/schemas/application.schema";

export type { ApplyInput, UpdateApplicationStatusInput };

type Application = Database["public"]["Tables"]["applications"]["Row"];
type ApplicationStatus = Database["public"]["Enums"]["application_status"];

const VALID_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  APPLIED: ["SHORTLISTED", "INTERVIEWING", "REJECTED"],
  SHORTLISTED: ["INTERVIEWING", "OFFERED", "REJECTED"],
  INTERVIEWING: ["OFFERED", "REJECTED"],
  OFFERED: ["REJECTED"],
  REJECTED: [],
};

export async function getApplicationById(id: number): Promise<Application> {
  const application = await applicationRepo.findById(id);
  if (!application) {
    throw new NotFoundError("Application", id);
  }
  return application;
}

export async function getApplicationsByStudent(
  studentId: number,
  options: Parameters<typeof applicationRepo.findByStudentId>[1] = {},
): Promise<Application[]> {
  const student = await studentRepo.findById(studentId);
  if (!student) {
    throw new NotFoundError("Student", studentId);
  }
  return await applicationRepo.findByStudentId(studentId, options);
}

export async function getApplicationsByJob(
  jobId: number,
  options: Parameters<typeof applicationRepo.findByJobId>[1] = {},
): Promise<Application[]> {
  const job = await jobRepo.findById(jobId);
  if (!job) {
    throw new NotFoundError("Job", jobId);
  }
  return await applicationRepo.findByJobId(jobId, options);
}

export async function apply(
  studentId: number,
  jobId: number,
): Promise<Application> {
  const validated = validateWithSchema(applySchema, { studentId, jobId });

  const alreadyApplied = await applicationRepo.exists(
    validated.studentId,
    validated.jobId,
  );
  if (alreadyApplied) {
    throw new ConflictError("You have already applied for this job");
  }

  const eligibility = await checkStudentEligibility(
    validated.jobId,
    validated.studentId,
  );
  if (!eligibility.eligible) {
    throw new ValidationError(
      `Cannot apply. Eligibility criteria not met: ${eligibility.reasons.join("; ")}`,
    );
  }

  return await applicationRepo.create({
    student_id: validated.studentId,
    job_id: validated.jobId,
    status: "APPLIED",
    applied_on: new Date().toISOString().split("T")[0],
    remark: null,
  });
}

export async function updateApplicationStatus(
  applicationId: number,
  newStatus: ApplicationStatus,
  remark?: string,
): Promise<Application> {
  const validated = validateWithSchema(updateApplicationStatusSchema, {
    status: newStatus,
    remark,
  });
  const current = await getApplicationById(applicationId);

  if (current.status === validated.status) {
    return current;
  }

  const allowedNext = VALID_TRANSITIONS[current.status];
  if (!allowedNext.includes(validated.status)) {
    throw new ValidationError(
      `Invalid application status transition from '${current.status}' to '${validated.status}'. Allowed: ${allowedNext.join(", ") || "None (Terminal state)"}`,
    );
  }

  return await applicationRepo.update(applicationId, {
    status: validated.status,
    remark: validated.remark !== undefined ? validated.remark : current.remark,
  });
}

export async function withdrawApplication(
  applicationId: number,
  studentId: number,
): Promise<Application> {
  const application = await getApplicationById(applicationId);

  if (application.student_id !== studentId) {
    throw new ForbiddenError(
      "You are not authorized to withdraw this application",
    );
  }

  if (application.status !== "APPLIED") {
    throw new ValidationError(
      `Cannot withdraw application with status '${application.status}'. Only 'APPLIED' status can be withdrawn.`,
    );
  }

  return await applicationRepo.update(applicationId, {
    status: "REJECTED",
    remark: "Withdrawn by student",
  });
}
