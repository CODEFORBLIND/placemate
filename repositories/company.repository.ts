import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import { toRange } from "./util";

export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
export type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];

export type CompanyFilters = {
  name?: string;
  location?: string;
  industry?: string;
  isHiring?: boolean;
};

export async function findById(id: number): Promise<Company | null> {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch company: ${error.message}`);
  return data;
}

export async function findMany(
  filters: CompanyFilters = {},
  page = 1,
  limit = 20,
): Promise<Company[]> {
  let query = supabase.from("companies").select("*");

  if (filters.name && filters.name.trim())
    query = query.ilike("name", `%${filters.name.trim()}%`);
  if (filters.location && filters.location.trim())
    query = query.ilike("location", `%${filters.location.trim()}%`);
  if (filters.industry && filters.industry.trim())
    query = query.ilike("industry", `%${filters.industry.trim()}%`);
  if (filters.isHiring !== undefined)
    query = query.eq("is_hiring", filters.isHiring);

  const { from, to } = toRange(page, limit);
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error(`Failed to fetch companies: ${error.message}`);
  return data;
}

export async function create(company: CompanyInsert): Promise<Company> {
  const { data, error } = await supabase
    .from("companies")
    .insert(company)
    .select()
    .single();
  if (error) throw new Error(`Failed to create company: ${error.message}`);
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
  if (error) throw new Error(`Failed to update company: ${error.message}`);
  return data;
}

export async function remove(id: number): Promise<void> {
  const { error } = await supabase.from("companies").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete company: ${error.message}`);
}
