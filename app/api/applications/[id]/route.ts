import { NextRequest } from "next/server";
import { applicationService } from "@/services";
import { ForbiddenError } from "@/services/errors";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    const application = await applicationService.getById(await routeId(params));
    if (!session.isPc && session.student?.id !== application.student_id)
      throw new ForbiddenError("This application is not yours");
    return ok(application);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    if (!session.isPc) throw new ForbiddenError("Only PC members can do this");
    await applicationService.remove(await routeId(params));
    return ok(null, "Application deleted");
  } catch (error) {
    return handleError(error);
  }
}
