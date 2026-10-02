import { NextRequest } from "next/server";
import { studentService } from "@/services";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession, requirePc, requireStudentAccess } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    const id = await routeId(params);
    requireStudentAccess(session, id);
    return ok(await studentService.getById(id));
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
    const id = await routeId(params);
    requireStudentAccess(session, id);
    const body = await request.json();
    const student = await studentService.updateProfile(id, body);
    return ok(student, "Profile updated");
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
    await studentService.remove(await routeId(params));
    return ok(null, "Student deleted");
  } catch (error) {
    return handleError(error);
  }
}
