import { NextRequest } from "next/server";
import { authService } from "@/services";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession, requirePc } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    requirePc(session);
    const body = await request.json();
    const user = await authService.resetUserPassword(
      await routeId(params),
      body,
    );
    return ok(user, "Password reset");
  } catch (error) {
    return handleError(error);
  }
}
