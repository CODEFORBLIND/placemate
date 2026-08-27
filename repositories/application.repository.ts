import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Application = Database["public"]["Tables"]["applications"]["Row"];
type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"];
type ApplicationUpdate = Database["public"]["Tables"]["applications"]["Update"];

type ApplicationOptions = {
  page?: number;
  limit?: number;
  sortBy?: "applied_on" | "created_at";
  ascending?: boolean;
  status?: Database["public"]["Enums"]["application_status"];
};

export async function findByStudentId(
  student_id: number,
  options: ApplicationOptions = {},
): Promise<Application[]> {
  let query = supabase
    .from("applications")
    .select("*")
    .eq("student_id", student_id);

  if (options.status) {
    query = query.eq("status", options.status);
  }

  const {
    page = 1,
    limit = 20,
    sortBy = "applied_on",
    ascending = false,
  } = options;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order(sortBy, { ascending });
  query = query.range(from, to);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch applications : ${error.message}`);
  }

  return data;
}

export async function findByJobId(
  job_id: number,
  options: ApplicationOptions = {},
): Promise<Application[]> {
  let query = supabase.from("applications").select("*").eq("job_id", job_id);

  if (options.status) {
    query = query.eq("status", options.status);
  }

  const {
    page = 1,
    limit = 20,
    sortBy = "applied_on",
    ascending = false,
  } = options;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order(sortBy, { ascending });
  query = query.range(from, to);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch applications : ${error.message}`);
  }

  return data;
}

export async function findByStudentAndJob(
  student_id: number,
  job_id: number,
): Promise<Application | null> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("student_id", student_id)
    .eq("job_id", job_id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch application : ${error.message}`);
  }

  return data;
}

export async function exists(
  student_id: number,
  job_id: number,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("applications")
    .select("id")
    .eq("student_id", student_id)
    .eq("job_id", job_id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to check application : ${error.message}`);
  }

  return data !== null;
}

export async function findById(id: number): Promise<Application | null> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch application : ${error.message}`);
  }

  return data;
}

export async function create(
  application: ApplicationInsert,
): Promise<Application> {
  const { data, error } = await supabase
    .from("applications")
    .insert(application)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create application : ${error.message}`);
  }

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

  if (error) {
    throw new Error(`Failed to update application : ${error.message}`);
  }

  return data;
}
