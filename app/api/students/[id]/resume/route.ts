import { NextRequest } from "next/server";
import { studentService } from "@/services";
import { ValidationError } from "@/services/errors";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession, requireStudentAccess } from "@/lib/session";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    const id = await routeId(params);
    requireStudentAccess(session, id);
    const body = await request.json();
    if (typeof body.resumeStoragePath !== "string")
      throw new ValidationError("resumeStoragePath is required");
    const student = await studentService.setResume(id, body.resumeStoragePath);
    return ok(student, "Resume updated");
  } catch (error) {
    return handleError(error);
  }
}
