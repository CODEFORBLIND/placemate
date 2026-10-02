import { NextRequest } from "next/server";
import { applicationService } from "@/services";
import { ValidationError } from "@/services/errors";
import {
  handleError,
  ok,
  created,
  getPage,
  getNumber,
  getEnum,
} from "@/lib/api-helpers";
import { getSession, requireApproved, ownStudentId } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    const { page, limit } = getPage(request);
    const status = getEnum(request, "status", [
      "APPLIED",
      "SHORTLISTED",
      "INTERVIEWING",
      "OFFERED",
      "REJECTED",
    ]);

    if (session.isPc) {
      const studentId = getNumber(request, "studentId");
      const jobId = getNumber(request, "jobId");
      if (studentId !== undefined)
        return ok(
          await applicationService.listByStudent(
            studentId,
            status,
            page,
            limit,
          ),
        );
      if (jobId !== undefined)
        return ok(
          await applicationService.listByJob(jobId, status, page, limit),
        );
      throw new ValidationError("Provide ?studentId= or ?jobId=");
    }

    return ok(
      await applicationService.listByStudent(
        ownStudentId(session),
        status,
        page,
        limit,
      ),
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    requireApproved(session);
    const body = await request.json();
    if (typeof body.jobId !== "number")
      throw new ValidationError("jobId is required");
    const application = await applicationService.apply(
      ownStudentId(session),
      body.jobId,
    );
    return created(application, "Application submitted");
  } catch (error) {
    return handleError(error);
  }
}
