import { NextRequest, NextResponse } from "next/server";
import {
  handleError,
  parsePagination,
  buildPaginatedResponse,
  parseId,
  parseSortParams,
} from "@/lib/api-helpers";
import * as applicationService from "@/services/application.service";
import { ValidationError } from "@/services/errors";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const { page, limit } = parsePagination(request);
    const studentIdParam = url.searchParams.get("studentId");
    const jobIdParam = url.searchParams.get("jobId");
    const status = url.searchParams.get("status");
    if (
      status &&
      ![
        "APPLIED",
        "SHORTLISTED",
        "INTERVIEWING",
        "OFFERED",
        "REJECTED",
      ].includes(status)
    ) {
      throw new ValidationError("Invalid status");
    }
    const { sortBy, ascending } = parseSortParams(
      request,
      ["applied_on", "created_at"],
      "applied_on",
    );

    if (studentIdParam && jobIdParam) {
      throw new ValidationError(
        "Provide either ?studentId= or ?jobId=, not both",
      );
    }

    if (studentIdParam) {
      const studentId = parseId(studentIdParam);
      const data = await applicationService.getApplicationsByStudent(
        studentId,
        {
          page,
          limit,
          sortBy: sortBy as "applied_on" | "created_at",
          ascending,
          status:
            (status as
              | "APPLIED"
              | "SHORTLISTED"
              | "INTERVIEWING"
              | "OFFERED"
              | "REJECTED") || undefined,
        },
      );
      const paginated = buildPaginatedResponse(request, data, { page, limit });
      return NextResponse.json(paginated, { status: 200 });
    }

    if (jobIdParam) {
      const jobId = parseId(jobIdParam);
      const data = await applicationService.getApplicationsByJob(jobId, {
        page,
        limit,
        sortBy: sortBy as "applied_on" | "created_at",
        ascending,
        status:
          (status as
            | "APPLIED"
            | "SHORTLISTED"
            | "INTERVIEWING"
            | "OFFERED"
            | "REJECTED") || undefined,
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
