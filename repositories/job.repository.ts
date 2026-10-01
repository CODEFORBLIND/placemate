import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Job = Database["public"]["Tables"]["jobs"]["Row"];
type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];
type JobUpdate = Database["public"]["Tables"]["jobs"]["Update"];

type JobFilters = {
  companyId?: number;
  location?: string;
  jobType?: "REMOTE" | "ONSITE" | "HYBRID";
  isActive?: boolean;
  minCgpa?: number;
  maxBacklogs?: number;
  course?: "MCA" | "MSC";
};

type JobOptions = {
  page?: number;
  limit?: number;
  sortBy?: "title" | "created_at" | "application_deadline";
  ascending?: boolean;
};

export async function findMany(
  filters: JobFilters = {},
  options: JobOptions = {},
): Promise<Job[]> {
  let query = supabase.from("jobs").select("*");

  if (filters.companyId !== undefined) {
    query = query.eq("company_id", filters.companyId);
  }

  if (filters.location) {
    const escaped = filters.location.replace(/[%_\\]/g, "\\$&");
    query = query.ilike("location", `%${escaped}%`);
  }

  if (filters.jobType) {
    query = query.eq("job_type", filters.jobType);
  }

  if (filters.isActive !== undefined) {
    query = query.eq("is_active", filters.isActive);
  }

  if (filters.minCgpa !== undefined) {
    query = query.gte("min_cgpa", filters.minCgpa);
  }

  if (filters.maxBacklogs !== undefined) {
    query = query.lte("max_backlogs", filters.maxBacklogs);
  }

  if (filters.course) {
    query = query.contains("preferred_courses", [filters.course]);
  }

  const {
    page = 1,
    limit = 20,
    sortBy = "created_at",
    ascending = true,
  } = options;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order(sortBy, { ascending });
  query = query.range(from, to);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch jobs : ${error.message}`);
  }

  return data;
}

export async function findByCompanyId(
  company_id: number,
  options: JobOptions = {},
): Promise<Job[]> {
  let query = supabase.from("jobs").select("*").eq("company_id", company_id);

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
    throw new Error(`Failed to fetch jobs : ${error.message}`);
  }

  return data;
}

export async function findById(id: number): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch job : ${error.message}`);
  }

  return data;
}

export async function create(job: JobInsert): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .insert(job)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create job : ${error.message}`);
  }

  return data;
}

export async function update(id: number, job: JobUpdate): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .update({ ...job, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update job : ${error.message}`);
  }

  return data;
}

export async function remove(id: number): Promise<void> {
  const { error } = await supabase.from("jobs").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete job : ${error.message}`);
  }
}
