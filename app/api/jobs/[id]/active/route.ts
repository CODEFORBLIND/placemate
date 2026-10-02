import { NextRequest } from "next/server";
import { jobService } from "@/services";
import { ValidationError } from "@/services/errors";
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
    if (typeof body.isActive !== "boolean")
      throw new ValidationError("isActive must be true or false");
    const job = await jobService.setActive(
      await routeId(params),
      body.isActive,
    );
    return ok(job, "Job status updated");
  } catch (error) {
    return handleError(error);
  }
}
