import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Assessment = Database["public"]["Tables"]["assessments"]["Row"];
type AssessmentInsert = Database["public"]["Tables"]["assessments"]["Insert"];
type AssessmentUpdate = Database["public"]["Tables"]["assessments"]["Update"];

type AssessmentOptions = {
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "score";
  ascending?: boolean;
};

export async function findByStudentId(
  student_id: number,
  options: AssessmentOptions = {},
): Promise<Assessment[]> {
  let query = supabase
    .from("assessments")
    .select("*")
    .eq("student_id", student_id);

  const { page = 1, limit = 20, sortBy = "score", ascending = false } = options;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order(sortBy, { ascending });
  query = query.range(from, to);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch assessment : ${error.message}`);
  }

  return data;
}

export async function findById(id: number): Promise<Assessment | null> {
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch assessment : ${error.message}`);
  }

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

  if (error) {
    throw new Error(`Failed to create assessment : ${error.message}`);
  }

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

  if (error) {
    throw new Error(`Failed to update assessment : ${error.message}`);
  }

  return data;
}
