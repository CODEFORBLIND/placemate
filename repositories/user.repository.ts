import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

function toRange(page: number, limit: number) {
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= 100 ? limit : 20;
  const from = (safePage - 1) * safeLimit;
  return { from, to: from + safeLimit - 1 };
}

export async function findById(id: number): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch user: ${error.message}`);
  return data;
}

export async function findByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch user: ${error.message}`);
  return data;
}

export async function findMany(page = 1, limit = 20): Promise<User[]> {
  const { from, to } = toRange(page, limit);
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) throw new Error(`Failed to fetch users: ${error.message}`);
  return data;
}

export async function create(user: UserInsert): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert(user)
    .select()
    .single();
  if (error) throw new Error(`Failed to create user: ${error.message}`);
  return data;
}

export async function update(id: number, user: UserUpdate): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .update({ ...user, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`Failed to update user: ${error.message}`);
  return data;
}

export async function remove(id: number): Promise<void> {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete user: ${error.message}`);
}
