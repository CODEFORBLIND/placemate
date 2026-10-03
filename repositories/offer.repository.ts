import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import { toRange } from "./util";

export type Offer = Database["public"]["Tables"]["offers"]["Row"];
export type OfferInsert = Database["public"]["Tables"]["offers"]["Insert"];
export type OfferUpdate = Database["public"]["Tables"]["offers"]["Update"];

export async function findById(id: number): Promise<Offer | null> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch offer: ${error.message}`);
  return data;
}

export async function findByApplicationId(
  applicationId: number,
): Promise<Offer | null> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("application_id", applicationId)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch offer: ${error.message}`);
  return data;
}

export async function findByStudentId(
  studentId: number,
  page = 1,
  limit = 20,
): Promise<Offer[]> {
  const { from, to } = toRange(page, limit);
  const { data, error } = await supabase
    .from("offers")
    .select("*, applications!inner(student_id)")
    .eq("applications.student_id", studentId)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error(`Failed to fetch offers: ${error.message}`);
  return data as Offer[];
}

export async function findMany(page = 1, limit = 20): Promise<Offer[]> {
  const { from, to } = toRange(page, limit);
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error(`Failed to fetch offers: ${error.message}`);
  return data;
}

export async function create(offer: OfferInsert): Promise<Offer> {
  const { data, error } = await supabase
    .from("offers")
    .insert(offer)
    .select()
    .single();
  if (error) throw new Error(`Failed to create offer: ${error.message}`);
  return data;
}

export async function update(id: number, offer: OfferUpdate): Promise<Offer> {
  const { data, error } = await supabase
    .from("offers")
    .update({ ...offer, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`Failed to update offer: ${error.message}`);
  return data;
}

export async function remove(id: number): Promise<void> {
  const { error } = await supabase.from("offers").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete offer: ${error.message}`);
}
