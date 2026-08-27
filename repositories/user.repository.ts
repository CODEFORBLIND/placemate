import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type User = Database["public"]["Tables"]["users"]["Row"];
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export async function findById(id: number): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch user : ${error.message}`);
  }

  return data;
}

export async function findByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch user : ${error.message}`);
  }

  return data;
}

export async function create(user: UserInsert): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert(user)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user : ${error.message}`);
  }

  return data;
}

export async function update(id: number, user: UserUpdate): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .update(user)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user : ${error.message}`);
  }

  return data;
}
