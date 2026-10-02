import { z } from "zod";
import { courseEnum } from "./student.schema";

export const jobTypeEnum = z.enum(["REMOTE", "ONSITE", "HYBRID"]);

const dateString = z
  .string()
  .trim()
  .nullable()
  .optional()
  .refine((value) => !value || !isNaN(Date.parse(value)), {
    message: "Invalid date",
  });

export const createJobSchema = z.object({
  companyId: z.number().int().positive("Valid company ID is required"),
  title: z.string().trim().min(1, "Job title is required"),
  description: z.string().trim().min(1, "Job description is required"),
  preferredCourses: z.array(courseEnum).nullable().optional(),
  jobType: jobTypeEnum,
  location: z.string().trim().nullable().optional(),
  minCgpa: z.number().min(0).max(10).nullable().optional(),
  maxBacklogs: z.number().int().min(0).nullable().optional(),
  applicationDeadline: dateString,
  isActive: z.boolean().optional(),
});

export const updateJobSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  preferredCourses: z.array(courseEnum).nullable().optional(),
  jobType: jobTypeEnum.optional(),
  location: z.string().trim().nullable().optional(),
  minCgpa: z.number().min(0).max(10).nullable().optional(),
  maxBacklogs: z.number().int().min(0).nullable().optional(),
  applicationDeadline: dateString,
  isActive: z.boolean().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
