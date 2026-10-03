import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import { toRange } from "./util";

export type Student = Database["public"]["Tables"]["students"]["Row"];
export type StudentInsert = Database["public"]["Tables"]["students"]["Insert"];
export type StudentUpdate = Database["public"]["Tables"]["students"]["Update"];

export type StudentFilters = {
  courseName?: Database["public"]["Enums"]["course"];
  profileStatus?: Database["public"]["Enums"]["profile_status"];
  graduationYear?: number;
  pcRole?: Database["public"]["Enums"]["pc_role"];
  search?: string;
};

export async function findById(id: number): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch student: ${error.message}`);
  return data;
}

export async function findByUserId(userId: number): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch student: ${error.message}`);
  return data;
}

export async function findByRollNo(rollNo: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("roll_no", rollNo.trim())
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch student: ${error.message}`);
  return data;
}

export async function findMany(
  filters: StudentFilters = {},
  page = 1,
  limit = 20,
): Promise<Student[]> {
  let query = supabase.from("students").select("*");

  if (filters.courseName) query = query.eq("course_name", filters.courseName);
  if (filters.profileStatus)
    query = query.eq("profile_status", filters.profileStatus);
  if (filters.graduationYear !== undefined)
    query = query.eq("graduation_year", filters.graduationYear);
  if (filters.pcRole) query = query.eq("pc_role", filters.pcRole);
  if (filters.search && filters.search.trim())
    query = query.or(
      `full_name.ilike.%${filters.search.trim()}%,roll_no.ilike.%${filters.search.trim()}%`,
    );

  const { from, to } = toRange(page, limit);
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error(`Failed to fetch students: ${error.message}`);
  return data;
}

export async function create(student: StudentInsert): Promise<Student> {
  const { data, error } = await supabase
    .from("students")
    .insert(student)
    .select()
    .single();
  if (error) throw new Error(`Failed to create student: ${error.message}`);
  return data;
}

export async function update(
  id: number,
  student: StudentUpdate,
): Promise<Student> {
  const { data, error } = await supabase
    .from("students")
    .update({ ...student, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`Failed to update student: ${error.message}`);
  return data;
}

export async function remove(id: number): Promise<void> {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete student: ${error.message}`);
}
