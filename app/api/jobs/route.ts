import { NextRequest } from "next/server";
import { jobService } from "@/services";
import {
  handleError,
  ok,
  created,
  getPage,
  getNumber,
  getText,
  getFlag,
  getEnum,
} from "@/lib/api-helpers";
import {
  getSession,
  requirePc,
  requireApproved,
  ownStudentId,
} from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    requireApproved(session);
    const { page, limit } = getPage(request);

    if (getFlag(request, "eligible") === true) {
      const jobs = await jobService.eligibleForStudent(
        ownStudentId(session),
        page,
        limit,
      );
      return ok(jobs);
    }

    const jobs = await jobService.list(
      {
        companyId: getNumber(request, "companyId"),
        location: getText(request, "location"),
        jobType: getEnum(request, "jobType", ["REMOTE", "ONSITE", "HYBRID"]),
        isActive: getFlag(request, "isActive"),
        course: getEnum(request, "course", ["MCA", "MSC"]),
      },
      page,
      limit,
    );
    return ok(jobs);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    requirePc(session);
    const body = await request.json();
    const job = await jobService.create(body);
    return created(job, "Job created");
  } catch (error) {
    return handleError(error);
  }
}
