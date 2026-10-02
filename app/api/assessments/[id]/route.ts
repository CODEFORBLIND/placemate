import { NextRequest } from "next/server";
import { assessmentService } from "@/services";
import { ForbiddenError } from "@/services/errors";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession, requirePc } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    const assessment = await assessmentService.getById(await routeId(params));
    if (!session.isPc && session.student?.id !== assessment.student_id)
      throw new ForbiddenError("This assessment is not yours");
    return ok(assessment);
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
    const assessment = await assessmentService.update(
      await routeId(params),
      body,
    );
    return ok(assessment, "Assessment updated");
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
    await assessmentService.remove(await routeId(params));
    return ok(null, "Assessment deleted");
  } catch (error) {
    return handleError(error);
  }
}
