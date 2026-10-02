import { NextRequest } from "next/server";
import { authService } from "@/services";
import { setAuthCookie } from "@/lib/auth";
import { handleError, ok } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, user } = await authService.login(body);
    const response = ok(user, "Login successful");
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
