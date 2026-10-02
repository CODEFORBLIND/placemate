import { NextRequest } from "next/server";
import { studentService } from "@/services";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession, requirePc } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    requirePc(session);
    const body = await request.json();
    const student = await studentService.reviewProfile(
      await routeId(params),
      body,
    );
    return ok(student, "Profile reviewed");
  } catch (error) {
    return handleError(error);
  }
}
