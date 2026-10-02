import { NextRequest } from "next/server";
import { applicationService } from "@/services";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession, requirePc } from "@/lib/session";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    requirePc(session);
    const body = await request.json();
    const application = await applicationService.setStatus(
      await routeId(params),
      body.status,
      body.remark,
    );
    return ok(application, "Application status updated");
  } catch (error) {
    return handleError(error);
  }
}
