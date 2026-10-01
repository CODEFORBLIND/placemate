import { NextRequest, NextResponse } from "next/server";
import {
  handleError,
  parsePagination,
  buildPaginatedResponse,
} from "@/lib/api-helpers";
import * as applicationService from "@/services/application.service";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const { page, limit } = parsePagination(request);
    const studentIdParam = url.searchParams.get("studentId");
    const jobIdParam = url.searchParams.get("jobId");
    const status = url.searchParams.get("status") as
      | "APPLIED"
      | "SHORTLISTED"
      | "INTERVIEWING"
      | "OFFERED"
      | "REJECTED"
      | null;
    const sortBy =
      (url.searchParams.get("sortBy") as "applied_on" | "created_at") ||
      "applied_on";
    const order = url.searchParams.get("order") || "desc";
    const ascending = order === "asc";

    if (studentIdParam) {
      const studentId = parseInt(studentIdParam, 10);
      const data = await applicationService.getApplicationsByStudent(
        studentId,
        { page, limit, sortBy, ascending, status: status || undefined },
      );
      const paginated = buildPaginatedResponse(request, data, { page, limit });
      return NextResponse.json(paginated, { status: 200 });
    }

    if (jobIdParam) {
      const jobId = parseInt(jobIdParam, 10);
      const data = await applicationService.getApplicationsByJob(jobId, {
        page,
        limit,
        sortBy,
        ascending,
        status: status || undefined,
      });
      const paginated = buildPaginatedResponse(request, data, { page, limit });
      return NextResponse.json(paginated, { status: 200 });
    }

    return NextResponse.json(
      { error: "Provide ?studentId= or ?jobId= query param" },
      { status: 400 },
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, jobId } = body;
    const application = await applicationService.apply(studentId, jobId);
    return NextResponse.json(
      { message: "Application created", data: application },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
