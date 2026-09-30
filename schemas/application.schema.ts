import { z } from "zod";

export const applicationStatusEnum = z.enum(
  ["APPLIED", "SHORTLISTED", "INTERVIEWING", "OFFERED", "REJECTED"],
  {
    message:
      "Status must be one of APPLIED, SHORTLISTED, INTERVIEWING, OFFERED, or REJECTED",
  },
);

export const applySchema = z.object({
  studentId: z
    .number()
    .int()
    .positive({ message: "Valid student ID is required" }),
  jobId: z.number().int().positive({ message: "Valid job ID is required" }),
});

export const updateApplicationStatusSchema = z.object({
  status: applicationStatusEnum,
  remark: z.string().trim().optional(),
});

export type ApplyInput = z.infer<typeof applySchema>;
export type UpdateApplicationStatusInput = z.infer<
  typeof updateApplicationStatusSchema
>;
