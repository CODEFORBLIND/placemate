import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

export type Application = Database["public"]["Tables"]["applications"]["Row"];
export type ApplicationInsert =
  Database["public"]["Tables"]["applications"]["Insert"];
export type ApplicationUpdate =
  Database["public"]["Tables"]["applications"]["Update"];

export type ApplicationFilters = {
  studentId?: number;
  jobId?: number;
  status?: Database["public"]["Enums"]["application_status"];
};

function toRange(page: number, limit: number) {
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= 100 ? limit : 20;
  const from = (safePage - 1) * safeLimit;
  return { from, to: from + safeLimit - 1 };
}

export async function findById(id: number): Promise<Application | null> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch application: ${error.message}`);
  return data;
}

export async function findByStudentAndJob(
  studentId: number,
  jobId: number,
): Promise<Application | null> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("student_id", studentId)
    .eq("job_id", jobId)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch application: ${error.message}`);
  return data;
}

export async function findMany(
  filters: ApplicationFilters = {},
  page = 1,
  limit = 20,
): Promise<Application[]> {
  let query = supabase.from("applications").select("*");

  if (filters.studentId !== undefined)
    query = query.eq("student_id", filters.studentId);
  if (filters.jobId !== undefined) query = query.eq("job_id", filters.jobId);
  if (filters.status) query = query.eq("status", filters.status);

  const { from, to } = toRange(page, limit);
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error(`Failed to fetch applications: ${error.message}`);
  return data;
}

export async function findByStudentId(
  studentId: number,
  page = 1,
  limit = 20,
): Promise<Application[]> {
  return findMany({ studentId }, page, limit);
}

export async function findByJobId(
  jobId: number,
  page = 1,
  limit = 20,
): Promise<Application[]> {
  return findMany({ jobId }, page, limit);
}

export async function create(
  application: ApplicationInsert,
): Promise<Application> {
  const { data, error } = await supabase
    .from("applications")
    .insert(application)
    .select()
    .single();
  if (error) throw new Error(`Failed to create application: ${error.message}`);
  return data;
}

export async function update(
  id: number,
  application: ApplicationUpdate,
): Promise<Application> {
  const { data, error } = await supabase
    .from("applications")
    .update({ ...application, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`Failed to update application: ${error.message}`);
  return data;
}

export async function remove(id: number): Promise<void> {
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete application: ${error.message}`);
}
