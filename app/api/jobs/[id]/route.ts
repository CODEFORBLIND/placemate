import { NextRequest } from "next/server";
import { jobService } from "@/services";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession, requirePc, requireApproved } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    requireApproved(session);
    return ok(await jobService.getById(await routeId(params)));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    requirePc(session);
    const body = await request.json();
    const job = await jobService.update(await routeId(params), body);
    return ok(job, "Job updated");
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
    requirePc(session);
    await jobService.remove(await routeId(params));
    return ok(null, "Job deleted");
  } catch (error) {
    return handleError(error);
  }
}
