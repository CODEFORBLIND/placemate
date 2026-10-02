import { z } from "zod";

export const courseEnum = z.enum(["MCA", "MSC"]);
export const profileStatusEnum = z.enum([
  "DRAFT",
  "PENDING_APPROVAL",
  "APPROVED",
]);
export const pcRoleEnum = z.enum(["MEMBER", "COORDINATOR"]);

const yearsValid = (enrollmentYear: number, graduationYear: number) =>
  graduationYear >= enrollmentYear;

export const registerProfileSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    rollNo: z.string().trim().min(1, "Roll number is required"),
    contactNo: z.string().trim().nullable().optional(),
    courseName: courseEnum,
    enrollmentYear: z.number().int().min(2000).max(2100),
    graduationYear: z.number().int().min(2000).max(2100),
    cgpa: z.number().min(0).max(10).nullable().optional(),
    backlogs: z.number().int().min(0).default(0),
    activeBacklogs: z.number().int().min(0).default(0),
    preferredRoles: z.array(z.string().trim()).nullable().optional(),
    resumeStoragePath: z.string().trim().nullable().optional(),
  })
  .refine((data) => yearsValid(data.enrollmentYear, data.graduationYear), {
    message: "Graduation year cannot be earlier than enrollment year",
    path: ["graduationYear"],
  })
  .refine((data) => data.activeBacklogs <= data.backlogs, {
    message: "Active backlogs cannot exceed total backlogs",
    path: ["activeBacklogs"],
  });

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1).optional(),
  rollNo: z.string().trim().min(1).optional(),
  contactNo: z.string().trim().nullable().optional(),
  courseName: courseEnum.optional(),
  enrollmentYear: z.number().int().min(2000).max(2100).optional(),
  graduationYear: z.number().int().min(2000).max(2100).optional(),
  cgpa: z.number().min(0).max(10).nullable().optional(),
  backlogs: z.number().int().min(0).optional(),
  activeBacklogs: z.number().int().min(0).optional(),
  preferredRoles: z.array(z.string().trim()).nullable().optional(),
  resumeStoragePath: z.string().trim().nullable().optional(),
});

export const reviewProfileSchema = z.object({
  decision: z.enum(["APPROVED", "DRAFT"]),
  remark: z.string().trim().optional(),
});

export const pcRoleSchema = z.object({
  role: pcRoleEnum.nullable(),
});

export type RegisterProfileInput = z.infer<typeof registerProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ReviewProfileInput = z.infer<typeof reviewProfileSchema>;
