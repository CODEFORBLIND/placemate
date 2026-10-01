import { z } from "zod";

export const recordAssessmentSchema = z
  .object({
    studentId: z
      .number()
      .int()
      .positive({ message: "Valid student ID is required" }),
    title: z
      .string()
      .trim()
      .min(1, { message: "Assessment title is required" }),
    summary: z.string().trim().nullable().optional(),
    score: z
      .number()
      .int()
      .min(0, { message: "Assessment score cannot be negative" }),
    maxScore: z
      .number()
      .int()
      .min(1, { message: "Max score must be greater than zero" }),
    completedAt: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid completedAt date",
      }),
  })
  .refine((data) => data.score <= data.maxScore, {
    message: "Score cannot exceed max score",
    path: ["score"],
  });

export const updateAssessmentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Assessment title cannot be empty" })
      .optional(),
    summary: z.string().trim().nullable().optional(),
    score: z
      .number()
      .int()
      .min(0, { message: "Assessment score cannot be negative" })
      .optional(),
    maxScore: z
      .number()
      .int()
      .min(1, { message: "Max score must be greater than zero" })
      .optional(),
    completedAt: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid completedAt date",
      }),
  })
  .refine(
    (data) => {
      if (data.score !== undefined && data.maxScore !== undefined) {
        return data.score <= data.maxScore;
      }
      return true;
    },
    {
      message: "Score cannot exceed max score",
      path: ["score"],
    },
  );

export type RecordAssessmentInput = z.infer<typeof recordAssessmentSchema>;
export type UpdateAssessmentInput = z.infer<typeof updateAssessmentSchema>;
