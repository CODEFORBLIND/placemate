import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Offer = Database["public"]["Tables"]["offers"]["Row"];
type OfferInsert = Database["public"]["Tables"]["offers"]["Insert"];
type OfferUpdate = Database["public"]["Tables"]["offers"]["Update"];

type OfferOptions = {
  page?: number;
  limit?: number;
  sortBy?: "offered_on" | "created_at";
  ascending?: boolean;
};

export async function findByApplicationId(
  application_id: number,
): Promise<Offer | null> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("application_id", application_id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch offer : ${error.message}`);
  }

  return data;
}

export async function findById(id: number): Promise<Offer | null> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch offer : ${error.message}`);
  }

  return data;
}

export async function findByStudentId(
  student_id: number,
  options: OfferOptions = {},
): Promise<Offer[]> {
  let query = supabase
    .from("offers")
    .select("*, applications!inner(student_id)")
    .eq("applications.student_id", student_id);

  const {
    page = 1,
    limit = 20,
    sortBy = "offered_on",
    ascending = false,
  } = options;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order(sortBy, { ascending });
  query = query.range(from, to);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch offers : ${error.message}`);
  }

  return data as Offer[];
}

export async function create(offer: OfferInsert): Promise<Offer> {
  const { data, error } = await supabase
    .from("offers")
    .insert(offer)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create offer : ${error.message}`);
  }

  return data;
}

export async function update(id: number, offer: OfferUpdate): Promise<Offer> {
  const { data, error } = await supabase
    .from("offers")
    .update({ ...offer, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update offer : ${error.message}`);
  }

  return data;
}
