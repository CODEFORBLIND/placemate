import { z } from "zod";

export const courseEnum = z.enum(["MCA", "MSC"], {
  message: "Course must be either MCA or MSC",
});

export const profileStatusEnum = z.enum([
  "DRAFT",
  "PENDING_APPROVAL",
  "APPROVED",
]);
export const pcRoleEnum = z.enum(["MEMBER", "COORDINATOR"]);

export const registerProfileSchema = z
  .object({
    userId: z.number().int().positive({ message: "Valid user ID is required" }),
    fullName: z.string().trim().min(1, { message: "Full name is required" }),
    rollNo: z.string().trim().min(1, { message: "Roll number is required" }),
    contactNo: z.string().trim().nullable().optional(),
    courseName: courseEnum,
    enrollmentYear: z
      .number()
      .int()
      .min(2000, { message: "Enrollment year must be valid" }),
    graduationYear: z
      .number()
      .int()
      .min(2000, { message: "Graduation year must be valid" }),
    cgpa: z
      .number()
      .min(0.0, { message: "CGPA must be between 0.0 and 10.0" })
      .max(10.0, { message: "CGPA must be between 0.0 and 10.0" })
      .nullable()
      .optional(),
    backlogs: z
      .number()
      .int()
      .min(0, { message: "Backlogs cannot be negative" })
      .default(0),
    activeBacklogs: z
      .number()
      .int()
      .min(0, { message: "Active backlogs cannot be negative" })
      .default(0),
    preferredRoles: z.array(z.string().trim()).nullable().optional(),
    resumeStoragePath: z.string().trim().nullable().optional(),
  })
  .refine((data) => data.graduationYear >= data.enrollmentYear, {
    message: "Graduation year cannot be earlier than enrollment year",
    path: ["graduationYear"],
  })
  .refine((data) => data.activeBacklogs <= data.backlogs, {
    message: "Active backlogs cannot exceed total backlogs",
    path: ["activeBacklogs"],
  });

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, { message: "Full name cannot be empty" })
      .optional(),
    rollNo: z
      .string()
      .trim()
      .min(1, { message: "Roll number cannot be empty" })
      .optional(),
    contactNo: z.string().trim().nullable().optional(),
    courseName: courseEnum.optional(),
    enrollmentYear: z.number().int().min(2000).optional(),
    graduationYear: z.number().int().min(2000).optional(),
    cgpa: z
      .number()
      .min(0.0, { message: "CGPA must be between 0.0 and 10.0" })
      .max(10.0, { message: "CGPA must be between 0.0 and 10.0" })
      .nullable()
      .optional(),
    backlogs: z
      .number()
      .int()
      .min(0, { message: "Backlogs cannot be negative" })
      .optional(),
    activeBacklogs: z
      .number()
      .int()
      .min(0, { message: "Active backlogs cannot be negative" })
      .optional(),
    preferredRoles: z.array(z.string().trim()).nullable().optional(),
    resumeStoragePath: z.string().trim().nullable().optional(),
  })
  .refine(
    (data) => {
      if (
        data.enrollmentYear !== undefined &&
        data.graduationYear !== undefined
      ) {
        return data.graduationYear >= data.enrollmentYear;
      }
      return true;
    },
    {
      message: "Graduation year cannot be earlier than enrollment year",
      path: ["graduationYear"],
    },
  )
  .refine(
    (data) => {
      if (data.backlogs !== undefined && data.activeBacklogs !== undefined) {
        return data.activeBacklogs <= data.backlogs;
      }
      return true;
    },
    {
      message: "Active backlogs cannot exceed total backlogs",
      path: ["activeBacklogs"],
    },
  );

export const reviewProfileSchema = z.object({
  decision: z.enum(["APPROVED", "DRAFT"], {
    message: "Decision must be either APPROVED or DRAFT",
  }),
  remark: z.string().trim().optional(),
});

export type RegisterProfileInput = z.infer<typeof registerProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ReviewProfileInput = z.infer<typeof reviewProfileSchema>;
