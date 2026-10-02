import { NextRequest } from "next/server";
import { applicationService } from "@/services";
import { handleError, ok, routeId } from "@/lib/api-helpers";
import { getSession, ownStudentId } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession(request);
    const application = await applicationService.withdraw(
      await routeId(params),
      ownStudentId(session),
    );
    return ok(application, "Application withdrawn");
  } catch (error) {
    return handleError(error);
  }
}
