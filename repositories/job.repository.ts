import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];
export type JobUpdate = Database["public"]["Tables"]["jobs"]["Update"];

export type JobFilters = {
  companyId?: number;
  location?: string;
  jobType?: Database["public"]["Enums"]["job_type"];
  isActive?: boolean;
  course?: Database["public"]["Enums"]["course"];
};

function toRange(page: number, limit: number) {
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= 100 ? limit : 20;
  const from = (safePage - 1) * safeLimit;
  return { from, to: from + safeLimit - 1 };
}

export async function findById(id: number): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch job: ${error.message}`);
  return data;
}

export async function findMany(
  filters: JobFilters = {},
  page = 1,
  limit = 20,
): Promise<Job[]> {
  let query = supabase.from("jobs").select("*");

  if (filters.companyId !== undefined)
    query = query.eq("company_id", filters.companyId);
  if (filters.location && filters.location.trim())
    query = query.ilike("location", `%${filters.location.trim()}%`);
  if (filters.jobType) query = query.eq("job_type", filters.jobType);
  if (filters.isActive !== undefined)
    query = query.eq("is_active", filters.isActive);
  if (filters.course)
    query = query.contains("preferred_courses", [filters.course]);

  const { from, to } = toRange(page, limit);
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error(`Failed to fetch jobs: ${error.message}`);
  return data;
}

export async function findByCompanyId(
  companyId: number,
  page = 1,
  limit = 20,
): Promise<Job[]> {
  return findMany({ companyId }, page, limit);
}

export async function create(job: JobInsert): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .insert(job)
    .select()
    .single();
  if (error) throw new Error(`Failed to create job: ${error.message}`);
  return data;
}

export async function update(id: number, job: JobUpdate): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .update({ ...job, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`Failed to update job: ${error.message}`);
  return data;
}

export async function remove(id: number): Promise<void> {
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete job: ${error.message}`);
}
