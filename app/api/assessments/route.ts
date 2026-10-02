import { NextRequest } from "next/server";
import { assessmentService } from "@/services";
import {
  handleError,
  ok,
  created,
  getPage,
  getNumber,
} from "@/lib/api-helpers";
import {
  getSession,
  requireApproved,
  requireStudentAccess,
  ownStudentId,
} from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    const { page, limit } = getPage(request);
    const studentId = getNumber(request, "studentId") ?? ownStudentId(session);
    requireStudentAccess(session, studentId);
    return ok(await assessmentService.listByStudent(studentId, page, limit));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    requireApproved(session);
    const body = await request.json();
    const studentId =
      typeof body.studentId === "number"
        ? body.studentId
        : ownStudentId(session);
    requireStudentAccess(session, studentId);
    const assessment = await assessmentService.record({
      ...body,
      studentId,
    });
    return created(assessment, "Assessment recorded");
  } catch (error) {
    return handleError(error);
  }
}
