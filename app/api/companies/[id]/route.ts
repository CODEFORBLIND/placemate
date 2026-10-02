import { NextRequest } from "next/server";
import { companyService } from "@/services";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession, requirePc, requireApproved } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    requireApproved(session);
    return ok(await companyService.getById(await routeId(params)));
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
    const company = await companyService.update(await routeId(params), body);
    return ok(company, "Company updated");
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
    await companyService.remove(await routeId(params));
    return ok(null, "Company deleted");
  } catch (error) {
    return handleError(error);
  }
}
