import { NextRequest } from "next/server";
import { authService } from "@/services";
import { handleError, ok } from "@/lib/api-helpers";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    const me = await authService.getMe(session.user.id);
    return ok(me);
  } catch (error) {
    return handleError(error);
  }
}
