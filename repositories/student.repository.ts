import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Student = Database["public"]["Tables"]["students"]["Row"];
type StudentInsert = Database["public"]["Tables"]["students"]["Insert"];
type StudentUpdate = Database["public"]["Tables"]["students"]["Update"];

type StudentFilters = {
  courseName?: Database["public"]["Enums"]["course"];
  profileStatus?: Database["public"]["Enums"]["profile_status"];
  graduationYear?: number;
  pcRole?: Database["public"]["Enums"]["pc_role"];
  search?: string;
};

type StudentOptions = {
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "full_name" | "cgpa" | "graduation_year";
  ascending?: boolean;
};

export async function findById(id: number): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch student : ${error.message}`);
  }

  return data;
}

export async function findByUserId(userId: number): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch student : ${error.message}`);
  }

  return data;
}

export async function findByRollNo(rollNo: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("roll_no", rollNo)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch student : ${error.message}`);
  }

  return data;
}

export async function findMany(
  filters: StudentFilters = {},
  options: StudentOptions = {},
): Promise<Student[]> {
  let query = supabase.from("students").select("*");

  if (filters.courseName) {
    query = query.eq("course_name", filters.courseName);
  }

  if (filters.profileStatus) {
    query = query.eq("profile_status", filters.profileStatus);
  }

  if (filters.graduationYear !== undefined) {
    query = query.eq("graduation_year", filters.graduationYear);
  }

  if (filters.pcRole) {
    query = query.eq("pc_role", filters.pcRole);
  }

  if (filters.search) {
    const escaped = filters.search
      .replace(/[%_\\]/g, "\\$&")
      .replace(/,/g, "\\,");
    query = query.or(`full_name.ilike.%${escaped}%,roll_no.ilike.%${escaped}%`);
  }

  const {
    page = 1,
    limit = 20,
    sortBy = "created_at",
    ascending = false,
  } = options;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order(sortBy, { ascending });
  query = query.range(from, to);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch students : ${error.message}`);
  }

  return data;
}

export async function create(student: StudentInsert): Promise<Student> {
  const { data, error } = await supabase
    .from("students")
    .insert(student)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create student : ${error.message}`);
  }

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

  if (error) {
    throw new Error(`Failed to update student : ${error.message}`);
  }

  return data;
}

export async function remove(id: number): Promise<void> {
  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete student : ${error.message}`);
  }
}
