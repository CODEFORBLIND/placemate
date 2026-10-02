import * as jobRepo from "@/repositories/job.repository";
import * as companyRepo from "@/repositories/company.repository";
import * as studentRepo from "@/repositories/student.repository";
import type { Job, JobFilters } from "@/repositories/job.repository";
import { NotFoundError, validate } from "./errors";
import {
  createJobSchema,
  updateJobSchema,
  type CreateJobInput,
  type UpdateJobInput,
} from "@/schemas/job.schema";

export type { CreateJobInput, UpdateJobInput };
export type { Job };

export type Eligibility = {
  eligible: boolean;
  reasons: string[];
};

export async function getById(id: number): Promise<Job> {
  const job = await jobRepo.findById(id);
  if (!job) throw new NotFoundError("Job", id);
  return job;
}

export async function list(
  filters: JobFilters = {},
  page = 1,
  limit = 20,
): Promise<Job[]> {
  return jobRepo.findMany(filters, page, limit);
}

export async function create(input: CreateJobInput): Promise<Job> {
  const data = validate(createJobSchema, input);
  const company = await companyRepo.findById(data.companyId);
  if (!company) throw new NotFoundError("Company", data.companyId);
  return jobRepo.create({
    company_id: data.companyId,
    title: data.title,
    description: data.description,
    preferred_courses: data.preferredCourses ?? null,
    job_type: data.jobType,
    location: data.location ?? null,
    min_cgpa: data.minCgpa ?? null,
    max_backlogs: data.maxBacklogs ?? null,
    application_deadline: data.applicationDeadline ?? null,
    is_active: data.isActive ?? true,
  });
}

export async function update(id: number, input: UpdateJobInput): Promise<Job> {
  await getById(id);
  const data = validate(updateJobSchema, input);
  return jobRepo.update(id, {
    title: data.title,
    description: data.description,
    preferred_courses: data.preferredCourses,
    job_type: data.jobType,
    location: data.location,
    min_cgpa: data.minCgpa,
    max_backlogs: data.maxBacklogs,
    application_deadline: data.applicationDeadline,
    is_active: data.isActive,
  });
}

export async function setActive(id: number, isActive: boolean): Promise<Job> {
  await getById(id);
  return jobRepo.update(id, { is_active: isActive });
}

export async function remove(id: number): Promise<void> {
  await getById(id);
  await jobRepo.remove(id);
}

function isPastDeadline(deadline: string | null): boolean {
  if (!deadline) return false;
  const end = new Date(deadline);
  if (isNaN(end.getTime())) return false;
  end.setHours(23, 59, 59, 999);
  return new Date() > end;
}

function checkRules(
  job: Job,
  student: NonNullable<Awaited<ReturnType<typeof studentRepo.findById>>>,
): string[] {
  const reasons: string[] = [];
  if (student.profile_status !== "APPROVED")
    reasons.push("Student profile is not approved");
  if (!job.is_active) reasons.push("This job is no longer active");
  if (isPastDeadline(job.application_deadline))
    reasons.push("Application deadline has passed");
  if (job.preferred_courses && job.preferred_courses.length > 0) {
    if (!job.preferred_courses.includes(student.course_name))
      reasons.push(
        `This job is only for ${job.preferred_courses.join(", ")} students`,
      );
  }
  if (job.min_cgpa !== null && job.min_cgpa !== undefined) {
    if (student.cgpa === null)
      reasons.push(`This job needs minimum CGPA of ${job.min_cgpa}`);
    else if (student.cgpa < job.min_cgpa)
      reasons.push(`CGPA ${student.cgpa} is below required ${job.min_cgpa}`);
  }
  if (job.max_backlogs !== null && job.max_backlogs !== undefined) {
    if (student.active_backlogs > job.max_backlogs)
      reasons.push(
        `Active backlogs exceed allowed limit of ${job.max_backlogs}`,
      );
  }
  return reasons;
}

export async function checkEligibility(
  jobId: number,
  studentId: number,
): Promise<Eligibility> {
  const job = await getById(jobId);
  const student = await studentRepo.findById(studentId);
  if (!student) throw new NotFoundError("Student", studentId);
  const reasons = checkRules(job, student);
  return { eligible: reasons.length === 0, reasons };
}

export async function eligibleForStudent(
  studentId: number,
  page = 1,
  limit = 20,
): Promise<Job[]> {
  const student = await studentRepo.findById(studentId);
  if (!student) throw new NotFoundError("Student", studentId);
  if (student.profile_status !== "APPROVED") return [];
  const jobs = await jobRepo.findMany({ isActive: true }, 1, 200);
  const ok = jobs.filter((job) => checkRules(job, student).length === 0);
  const start = (page - 1) * limit;
  return ok.slice(start, start + limit);
}
