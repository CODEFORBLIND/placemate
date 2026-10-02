import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

export type Assessment = Database["public"]["Tables"]["assessments"]["Row"];
export type AssessmentInsert =
  Database["public"]["Tables"]["assessments"]["Insert"];
export type AssessmentUpdate =
  Database["public"]["Tables"]["assessments"]["Update"];

function toRange(page: number, limit: number) {
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= 100 ? limit : 20;
  const from = (safePage - 1) * safeLimit;
  return { from, to: from + safeLimit - 1 };
}

export async function findById(id: number): Promise<Assessment | null> {
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch assessment: ${error.message}`);
  return data;
}

export async function findMany(page = 1, limit = 20): Promise<Assessment[]> {
  const { from, to } = toRange(page, limit);
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error(`Failed to fetch assessments: ${error.message}`);
  return data;
}

export async function findByStudentId(
  studentId: number,
  page = 1,
  limit = 20,
): Promise<Assessment[]> {
  const { from, to } = toRange(page, limit);
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error(`Failed to fetch assessments: ${error.message}`);
  return data;
}

export async function create(
  assessment: AssessmentInsert,
): Promise<Assessment> {
  const { data, error } = await supabase
    .from("assessments")
    .insert(assessment)
    .select()
    .single();
  if (error) throw new Error(`Failed to create assessment: ${error.message}`);
  return data;
}

export async function update(
  id: number,
  assessment: AssessmentUpdate,
): Promise<Assessment> {
  const { data, error } = await supabase
    .from("assessments")
    .update({ ...assessment, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`Failed to update assessment: ${error.message}`);
  return data;
}

export async function remove(id: number): Promise<void> {
  const { error } = await supabase.from("assessments").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete assessment: ${error.message}`);
}
