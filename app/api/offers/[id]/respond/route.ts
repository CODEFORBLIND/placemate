import { NextRequest } from "next/server";
import { offerService } from "@/services";
import { ValidationError } from "@/services/errors";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession, ownStudentId } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    const body = await request.json();
    if (body.decision !== "ACCEPTED" && body.decision !== "REJECTED")
      throw new ValidationError("decision must be ACCEPTED or REJECTED");
    const offer = await offerService.respond(
      await routeId(params),
      ownStudentId(session),
      body.decision,
    );
    return ok(offer, `Offer ${body.decision.toLowerCase()}`);
  } catch (error) {
    return handleError(error);
  }
}
