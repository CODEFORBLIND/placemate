import { NextRequest } from "next/server";
import { offerService } from "@/services";
import { handleError, ok, created, getPage } from "@/lib/api-helpers";
import {
  getSession,
  requirePc,
  requireApproved,
  ownStudentId,
} from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    requireApproved(session);
    const { page, limit } = getPage(request);
    if (session.isPc) return ok(await offerService.list(page, limit));
    return ok(
      await offerService.listByStudent(ownStudentId(session), page, limit),
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    requirePc(session);
    const body = await request.json();
    const offer = await offerService.create(body);
    return created(offer, "Offer created");
  } catch (error) {
    return handleError(error);
  }
}
