import { NextRequest } from "next/server";
import { studentService } from "@/services";
import { validate } from "@/services/errors";
import { pcRoleSchema } from "@/schemas/student.schema";
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
    const data = validate(pcRoleSchema, body);
    const student = await studentService.setPcRole(
      await routeId(params),
      data.role,
    );
    return ok(student, "Role updated");
  } catch (error) {
    return handleError(error);
  }
}
