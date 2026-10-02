import { NextRequest } from "next/server";
import { authService } from "@/services";
import { handleError, created } from "@/lib/api-helpers";
import { getSession, requirePc } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    requirePc(session);
    const body = await request.json();
    const user = await authService.register(body);
    return created(
      user,
      "Account created, share the credentials with the user",
    );
  } catch (error) {
    return handleError(error);
  }
}
