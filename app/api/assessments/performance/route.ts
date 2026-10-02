import { NextRequest } from "next/server";
import { assessmentService } from "@/services";
import { handleError, ok, getNumber } from "@/lib/api-helpers";
import { getSession, requireStudentAccess, ownStudentId } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    const studentId = getNumber(request, "studentId") ?? ownStudentId(session);
    requireStudentAccess(session, studentId);
    return ok(await assessmentService.performance(studentId));
  } catch (error) {
    return handleError(error);
  }
}
