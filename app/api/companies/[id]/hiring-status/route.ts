import { NextRequest } from "next/server";
import { companyService } from "@/services";
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
    if (typeof body.isHiring !== "boolean")
      throw new ValidationError("isHiring must be true or false");
    const company = await companyService.setHiring(
      await routeId(params),
      body.isHiring,
    );
    return ok(company, "Hiring status updated");
  } catch (error) {
    return handleError(error);
  }
}
