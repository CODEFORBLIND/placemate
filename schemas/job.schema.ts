import { z } from "zod";
import { courseEnum } from "./student.schema";

export const jobTypeEnum = z.enum(["REMOTE", "ONSITE", "HYBRID"], {
  message: "Job type must be REMOTE, ONSITE, or HYBRID",
});

export const createJobSchema = z.object({
  companyId: z
    .number()
    .int()
    .positive({ message: "Valid company ID is required" }),
  title: z.string().trim().min(1, { message: "Job title is required" }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Job description is required" }),
  preferredCourses: z.array(courseEnum).optional(),
  jobType: jobTypeEnum,
  location: z.string().trim().nullable().optional(),
  minCgpa: z
    .number()
    .min(0.0, {
      message: "Minimum CGPA requirement must be between 0.0 and 10.0",
    })
    .max(10.0, {
      message: "Minimum CGPA requirement must be between 0.0 and 10.0",
    })
    .nullable()
    .optional(),
  maxBacklogs: z
    .number()
    .int()
    .min(0, { message: "Maximum allowed backlogs cannot be negative" })
    .nullable()
    .optional(),
  applicationDeadline: z.string().trim().nullable().optional(),
  isActive: z.boolean().default(true).optional(),
});

export const updateJobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Job title cannot be empty" })
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, { message: "Job description cannot be empty" })
    .optional(),
  preferredCourses: z.array(courseEnum).optional(),
  jobType: jobTypeEnum.optional(),
  location: z.string().trim().nullable().optional(),
  minCgpa: z
    .number()
    .min(0.0, {
      message: "Minimum CGPA requirement must be between 0.0 and 10.0",
    })
    .max(10.0, {
      message: "Minimum CGPA requirement must be between 0.0 and 10.0",
    })
    .nullable()
    .optional(),
  maxBacklogs: z
    .number()
    .int()
    .min(0, { message: "Maximum allowed backlogs cannot be negative" })
    .nullable()
    .optional(),
  applicationDeadline: z.string().trim().nullable().optional(),
  isActive: z.boolean().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
