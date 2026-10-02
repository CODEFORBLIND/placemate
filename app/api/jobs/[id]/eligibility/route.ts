import { NextRequest } from "next/server";
import { jobService } from "@/services";
import { handleError, ok, routeId, getNumber } from "@/lib/api-helpers";
import {
  getSession,
  requireApproved,
  requireStudentAccess,
  ownStudentId,
} from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    requireApproved(session);
    const studentId = getNumber(request, "studentId") ?? ownStudentId(session);
    requireStudentAccess(session, studentId);
    const result = await jobService.checkEligibility(
      await routeId(params),
      studentId,
    );
    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}
