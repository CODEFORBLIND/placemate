import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Student = Database["public"]["Tables"]["students"]["Row"];
type StudentInsert = Database["public"]["Tables"]["students"]["Insert"];
type StudentUpdate = Database["public"]["Tables"]["students"]["Update"];

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
    .update(student)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create student : ${error.message}`);
  }

  return data;
}

export async function remove(id: number): Promise<void> {
  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete student : ${error.message}`);
  }
}
