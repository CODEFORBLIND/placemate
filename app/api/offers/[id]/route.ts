import { NextRequest } from "next/server";
import { offerService, applicationService } from "@/services";
import { ForbiddenError } from "@/services/errors";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession, requirePc } from "@/lib/session";

async function checkAccess(
  session: Awaited<ReturnType<typeof getSession>>,
  id: number,
) {
  const offer = await offerService.getById(id);
  if (session.isPc) return offer;
  const application = await applicationService.getById(offer.application_id);
  if (session.student?.id !== application.student_id)
    throw new ForbiddenError("This offer is not yours");
  return offer;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    return ok(await checkAccess(session, await routeId(params)));
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
    const offer = await offerService.updateDetails(await routeId(params), body);
    return ok(offer, "Offer updated");
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
    await offerService.remove(await routeId(params));
    return ok(null, "Offer deleted");
  } catch (error) {
    return handleError(error);
  }
}
