import { NextRequest } from "next/server";
import { userService } from "@/services";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession, requirePc } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    requirePc(session);
    const user = await userService.setActive(await routeId(params), false);
    return ok(userService.toPublic(user), "User deactivated");
  } catch (error) {
    return handleError(error);
  }
}
