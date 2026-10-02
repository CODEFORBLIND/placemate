import { z } from "zod";

const dateString = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || !isNaN(Date.parse(value)), {
    message: "Invalid date",
  });

export const recordAssessmentSchema = z
  .object({
    studentId: z.number().int().positive("Valid student ID is required"),
    title: z.string().trim().min(1, "Assessment title is required"),
    summary: z.string().trim().nullable().optional(),
    score: z.number().int().min(0),
    maxScore: z.number().int().min(1),
    completedAt: dateString,
  })
  .refine((data) => data.score <= data.maxScore, {
    message: "Score cannot exceed max score",
    path: ["score"],
  });

export const updateAssessmentSchema = z.object({
  title: z.string().trim().min(1).optional(),
  summary: z.string().trim().nullable().optional(),
  score: z.number().int().min(0).optional(),
  maxScore: z.number().int().min(1).optional(),
  completedAt: dateString,
});

export type RecordAssessmentInput = z.infer<typeof recordAssessmentSchema>;
export type UpdateAssessmentInput = z.infer<typeof updateAssessmentSchema>;
