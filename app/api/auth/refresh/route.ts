import { NextRequest } from "next/server";
import { authService } from "@/services";
import { setAuthCookie } from "@/lib/auth";
import { handleError, ok } from "@/lib/api-helpers";
import { getSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    const token = await authService.refreshToken(session.user.id);
    const response = ok(null, "Token refreshed");
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
