import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Company = Database["public"]["Tables"]["companies"]["Row"];
type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];

type CompanyFilters = {
  location?: string;
  industry?: string;
  isHiring?: boolean;
};

type CompanyOptions = {
  page?: number;
  limit?: number;
  sortBy?: "name" | "created_at";
  ascending?: boolean;
};

export async function findMany(
  filters: CompanyFilters = {},
  options: CompanyOptions = {},
): Promise<Company[]> {
  let query = supabase.from("companies").select("*");

  if (filters.location) {
    const escaped = filters.location.replace(/[%_\\]/g, "\\$&");
    query = query.ilike("location", `%${escaped}%`);
  }

  if (filters.industry) {
    const escaped = filters.industry.replace(/[%_\\]/g, "\\$&");
    query = query.ilike("industry", `%${escaped}%`);
  }

  if (filters.isHiring !== undefined) {
    query = query.eq("is_hiring", filters.isHiring);
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
    throw new Error(`Failed to fetch companies : ${error.message}`);
  }

  return data;
}

export async function findById(id: number): Promise<Company | null> {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch company : ${error.message}`);
  }

  return data;
}

export async function findByName(name: string): Promise<Company[]> {
  const escaped = name.replace(/[%_\\]/g, "\\$&");
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .ilike("name", `%${escaped}%`);

  if (error) {
    throw new Error(`Failed to search company : ${error.message}`);
  }

  return data;
}

export async function create(company: CompanyInsert): Promise<Company> {
  const { data, error } = await supabase
    .from("companies")
    .insert(company)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create company : ${error.message}`);
  }

  return data;
}

export async function update(
  id: number,
  company: CompanyUpdate,
): Promise<Company> {
  const { data, error } = await supabase
    .from("companies")
    .update({ ...company, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update company : ${error.message}`);
  }

  return data;
}
