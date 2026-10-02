import { NextRequest } from "next/server";
import { studentService } from "@/services";
import { ForbiddenError } from "@/services/errors";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    const id = await routeId(params);
    if (session.student?.id !== id)
      throw new ForbiddenError("You can only submit your own profile");
    const student = await studentService.submitForApproval(id);
    return ok(student, "Profile sent for approval");
  } catch (error) {
    return handleError(error);
  }
}
