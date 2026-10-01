import * as jobRepo from "@/repositories/job.repository";
import * as companyRepo from "@/repositories/company.repository";
import * as studentRepo from "@/repositories/student.repository";
import type { Database } from "@/types/database";
import { NotFoundError, validateWithSchema } from "./errors";
import {
  createJobSchema,
  updateJobSchema,
  type CreateJobInput,
  type UpdateJobInput,
} from "@/schemas/job.schema";

export type { CreateJobInput, UpdateJobInput };

type Job = Database["public"]["Tables"]["jobs"]["Row"];

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export async function getJobById(id: number): Promise<Job> {
  const job = await jobRepo.findById(id);
  if (!job) {
    throw new NotFoundError("Job", id);
  }
  return job;
}

export async function listJobs(
  filters: Parameters<typeof jobRepo.findMany>[0] = {},
  options: Parameters<typeof jobRepo.findMany>[1] = {},
): Promise<Job[]> {
  return await jobRepo.findMany(filters, options);
}

export async function createJob(input: CreateJobInput): Promise<Job> {
  const validated = validateWithSchema(createJobSchema, input);

  const company = await companyRepo.findById(validated.companyId);
  if (!company) {
    throw new NotFoundError("Company", validated.companyId);
  }

  return await jobRepo.create({
    company_id: validated.companyId,
    title: validated.title.trim(),
    description: validated.description.trim(),
    preferred_courses: validated.preferredCourses ?? null,
    job_type: validated.jobType,
    location: validated.location ?? null,
    min_cgpa: validated.minCgpa ?? null,
    max_backlogs: validated.maxBacklogs ?? null,
    application_deadline: validated.applicationDeadline ?? null,
    is_active: validated.isActive ?? true,
  });
}

export async function updateJob(
  id: number,
  input: UpdateJobInput,
): Promise<Job> {
  await getJobById(id);
  const validated = validateWithSchema(updateJobSchema, input);

  const updateData: Parameters<typeof jobRepo.update>[1] = {};

  if (validated.title !== undefined) updateData.title = validated.title.trim();
  if (validated.description !== undefined)
    updateData.description = validated.description.trim();
  if (validated.preferredCourses !== undefined)
    updateData.preferred_courses = validated.preferredCourses;
  if (validated.jobType !== undefined) updateData.job_type = validated.jobType;
  if (validated.location !== undefined)
    updateData.location = validated.location;
  if (validated.minCgpa !== undefined) updateData.min_cgpa = validated.minCgpa;
  if (validated.maxBacklogs !== undefined)
    updateData.max_backlogs = validated.maxBacklogs;
  if (validated.applicationDeadline !== undefined)
    updateData.application_deadline = validated.applicationDeadline;
  if (validated.isActive !== undefined)
    updateData.is_active = validated.isActive;

  return await jobRepo.update(id, updateData);
}

export async function setJobActiveStatus(
  id: number,
  isActive: boolean,
): Promise<Job> {
  await getJobById(id);
  return await jobRepo.update(id, { is_active: isActive });
}

export async function deleteJob(id: number): Promise<void> {
  await getJobById(id);
  await jobRepo.remove(id);
}

export async function checkStudentEligibility(
  jobId: number,
  studentId: number,
): Promise<EligibilityResult> {
  const [job, student] = await Promise.all([
    getJobById(jobId),
    studentRepo.findById(studentId),
  ]);

  if (!student) {
    throw new NotFoundError("Student", studentId);
  }

  const reasons: string[] = [];

  if (student.profile_status !== "APPROVED") {
    reasons.push(
      `Student profile is ${student.profile_status}; only APPROVED profiles can apply.`,
    );
  }

  if (!job.is_active) {
    reasons.push("This job posting is currently closed/inactive.");
  }

  if (job.application_deadline) {
    const deadline = new Date(job.application_deadline);
    if (!isNaN(deadline.getTime())) {
      deadline.setHours(23, 59, 59, 999);
      if (new Date() > deadline) {
        reasons.push(`Application deadline was ${job.application_deadline}.`);
      }
    }
  }

  if (job.preferred_courses && job.preferred_courses.length > 0) {
    if (!job.preferred_courses.includes(student.course_name)) {
      reasons.push(
        `Job is restricted to [${job.preferred_courses.join(", ")}]. Student is in ${student.course_name}.`,
      );
    }
  }

  if (job.min_cgpa !== null && job.min_cgpa !== undefined) {
    if (student.cgpa === null || student.cgpa === undefined) {
      reasons.push(
        `Job requires min CGPA of ${job.min_cgpa}, but student CGPA is not recorded.`,
      );
    } else if (student.cgpa < job.min_cgpa) {
      reasons.push(
        `Student CGPA (${student.cgpa}) is lower than minimum requirement (${job.min_cgpa}).`,
      );
    }
  }

  if (job.max_backlogs !== null && job.max_backlogs !== undefined) {
    if (student.active_backlogs > job.max_backlogs) {
      reasons.push(
        `Student has ${student.active_backlogs} active backlogs, exceeding limit of ${job.max_backlogs}.`,
      );
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

export async function getEligibleJobsForStudent(
  studentId: number,
  options: { limit?: number; offset?: number } = {},
): Promise<Job[]> {
  const student = await studentRepo.findById(studentId);
  if (!student) {
    throw new NotFoundError("Student", studentId);
  }

  if (student.profile_status !== "APPROVED") {
    return [];
  }

  const activeJobs = await jobRepo.findMany(
    { isActive: true },
    { limit: 1000 },
  );

  const eligibleJobs = activeJobs.filter((job) => {
    if (job.application_deadline) {
      const deadline = new Date(job.application_deadline);
      if (!isNaN(deadline.getTime())) {
        deadline.setHours(23, 59, 59, 999);
        if (new Date() > deadline) return false;
      }
    }

    if (job.preferred_courses && job.preferred_courses.length > 0) {
      if (!job.preferred_courses.includes(student.course_name)) return false;
    }

    if (job.min_cgpa !== null && job.min_cgpa !== undefined) {
      if (
        student.cgpa === null ||
        student.cgpa === undefined ||
        student.cgpa < job.min_cgpa
      ) {
        return false;
      }
    }

    if (job.max_backlogs !== null && job.max_backlogs !== undefined) {
      if (student.active_backlogs > job.max_backlogs) {
        return false;
      }
    }

    return true;
  });

  const offset = options.offset ?? 0;
  const limit = options.limit ?? 20;
  return eligibleJobs.slice(offset, offset + limit);
}
