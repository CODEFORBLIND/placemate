import { NextRequest } from "next/server";
import { authService } from "@/services";
import { handleError, ok } from "@/lib/api-helpers";
import { getSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    const body = await request.json();
    const user = await authService.changePassword(session.user.id, body);
    return ok(user, "Password changed");
  } catch (error) {
    return handleError(error);
  }
}
