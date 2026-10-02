import { clearAuthCookie } from "@/lib/auth";
import { ok } from "@/lib/api-helpers";

export async function POST() {
  const response = ok(null, "Logged out");
  clearAuthCookie(response);
  return response;
}
