import * as assessmentRepo from "@/repositories/assessment.repository";
import * as studentRepo from "@/repositories/student.repository";
import type { Database } from "@/types/database";
import { NotFoundError, ValidationError, validateWithSchema } from "./errors";
import {
  recordAssessmentSchema,
  updateAssessmentSchema,
  type RecordAssessmentInput,
  type UpdateAssessmentInput,
} from "@/schemas/assessment.schema";

export type { RecordAssessmentInput, UpdateAssessmentInput };

type Assessment = Database["public"]["Tables"]["assessments"]["Row"];

export interface StudentPerformanceSummary {
  studentId: number;
  totalAssessments: number;
  averageScorePercentage: number;
  highestScorePercentage: number;
  latestScorePercentage: number | null;
  category: "Best" | "Average" | "Poor" | "Not assessed";
}

export async function getAssessmentById(id: number): Promise<Assessment> {
  const assessment = await assessmentRepo.findById(id);
  if (!assessment) {
    throw new NotFoundError("Assessment", id);
  }
  return assessment;
}

export async function getStudentAssessments(
  studentId: number,
  options: Parameters<typeof assessmentRepo.findByStudentId>[1] = {},
): Promise<Assessment[]> {
  const student = await studentRepo.findById(studentId);
  if (!student) {
    throw new NotFoundError("Student", studentId);
  }
  return await assessmentRepo.findByStudentId(studentId, options);
}

export async function recordAssessment(
  input: RecordAssessmentInput,
): Promise<Assessment> {
  const validated = validateWithSchema(recordAssessmentSchema, input);

  const student = await studentRepo.findById(validated.studentId);
  if (!student) {
    throw new NotFoundError("Student", validated.studentId);
  }

  return await assessmentRepo.create({
    student_id: validated.studentId,
    title: validated.title.trim(),
    summary: validated.summary ?? null,
    score: validated.score,
    max_score: validated.maxScore,
    completed_at: validated.completedAt ?? new Date().toISOString(),
  });
}

export async function updateAssessment(
  id: number,
  input: UpdateAssessmentInput,
): Promise<Assessment> {
  const current = await getAssessmentById(id);
  const validated = validateWithSchema(updateAssessmentSchema, input);

  const score = validated.score !== undefined ? validated.score : current.score;
  const maxScore =
    validated.maxScore !== undefined ? validated.maxScore : current.max_score;

  if (score > maxScore) {
    throw new ValidationError(
      `Score (${score}) cannot exceed max score (${maxScore})`,
    );
  }

  const updateData: Parameters<typeof assessmentRepo.update>[1] = {};

  if (validated.title !== undefined) updateData.title = validated.title.trim();
  if (validated.summary !== undefined) updateData.summary = validated.summary;
  if (validated.score !== undefined) updateData.score = validated.score;
  if (validated.maxScore !== undefined)
    updateData.max_score = validated.maxScore;
  if (validated.completedAt !== undefined)
    updateData.completed_at = validated.completedAt;

  return await assessmentRepo.update(id, updateData);
}

export async function getStudentPerformanceSummary(
  studentId: number,
): Promise<StudentPerformanceSummary> {
  const student = await studentRepo.findById(studentId);
  if (!student) {
    throw new NotFoundError("Student", studentId);
  }

  const assessments = await assessmentRepo.findByStudentId(studentId, {
    limit: 1000,
    sortBy: "created_at",
    ascending: false,
  });

  if (assessments.length === 0) {
    return {
      studentId,
      totalAssessments: 0,
      averageScorePercentage: 0,
      highestScorePercentage: 0,
      latestScorePercentage: null,
      category: "Not assessed",
    };
  }

  const percentages = assessments.map((a) => (a.score / a.max_score) * 100);
  const total = percentages.reduce((acc, p) => acc + p, 0);
  const avg = Math.round(total / percentages.length);
  const highest = Math.round(Math.max(...percentages));
  const latest = Math.round(percentages[0]);

  let category: "Best" | "Average" | "Poor" = "Average";
  if (avg >= 80) {
    category = "Best";
  } else if (avg < 50) {
    category = "Poor";
  }

  return {
    studentId,
    totalAssessments: assessments.length,
    averageScorePercentage: avg,
    highestScorePercentage: highest,
    latestScorePercentage: latest,
    category,
  };
}
