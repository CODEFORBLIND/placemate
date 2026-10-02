import * as assessmentRepo from "@/repositories/assessment.repository";
import * as studentRepo from "@/repositories/student.repository";
import type { Assessment } from "@/repositories/assessment.repository";
import { NotFoundError, ValidationError, validate } from "./errors";
import {
  recordAssessmentSchema,
  updateAssessmentSchema,
  type RecordAssessmentInput,
  type UpdateAssessmentInput,
} from "@/schemas/assessment.schema";

export type { RecordAssessmentInput, UpdateAssessmentInput };
export type { Assessment };

export type Performance = {
  studentId: number;
  total: number;
  averagePercent: number;
  highestPercent: number;
  latestPercent: number | null;
  level: "Best" | "Average" | "Poor" | "Not assessed";
};

export async function getById(id: number): Promise<Assessment> {
  const assessment = await assessmentRepo.findById(id);
  if (!assessment) throw new NotFoundError("Assessment", id);
  return assessment;
}

export async function listByStudent(
  studentId: number,
  page = 1,
  limit = 20,
): Promise<Assessment[]> {
  const student = await studentRepo.findById(studentId);
  if (!student) throw new NotFoundError("Student", studentId);
  return assessmentRepo.findByStudentId(studentId, page, limit);
}

export async function record(
  input: RecordAssessmentInput,
): Promise<Assessment> {
  const data = validate(recordAssessmentSchema, input);
  const student = await studentRepo.findById(data.studentId);
  if (!student) throw new NotFoundError("Student", data.studentId);
  return assessmentRepo.create({
    student_id: data.studentId,
    title: data.title,
    summary: data.summary ?? null,
    score: data.score,
    max_score: data.maxScore,
    completed_at: data.completedAt ?? new Date().toISOString(),
  });
}

export async function update(
  id: number,
  input: UpdateAssessmentInput,
): Promise<Assessment> {
  const current = await getById(id);
  const data = validate(updateAssessmentSchema, input);
  const score = data.score ?? current.score;
  const maxScore = data.maxScore ?? current.max_score;
  if (score > maxScore)
    throw new ValidationError("Score cannot exceed max score");
  return assessmentRepo.update(id, {
    title: data.title,
    summary: data.summary,
    score: data.score,
    max_score: data.maxScore,
    completed_at: data.completedAt,
  });
}

export async function performance(studentId: number): Promise<Performance> {
  const student = await studentRepo.findById(studentId);
  if (!student) throw new NotFoundError("Student", studentId);
  const list = await assessmentRepo.findByStudentId(studentId, 1, 200);
  if (list.length === 0)
    return {
      studentId,
      total: 0,
      averagePercent: 0,
      highestPercent: 0,
      latestPercent: null,
      level: "Not assessed",
    };
  const percents = list.map((a) => (a.score / a.max_score) * 100);
  const average = Math.round(
    percents.reduce((sum, p) => sum + p, 0) / percents.length,
  );
  return {
    studentId,
    total: list.length,
    averagePercent: average,
    highestPercent: Math.round(Math.max(...percents)),
    latestPercent: Math.round(percents[0]),
    level: average >= 80 ? "Best" : average < 50 ? "Poor" : "Average",
  };
}

export async function remove(id: number): Promise<void> {
  await getById(id);
  await assessmentRepo.remove(id);
}
