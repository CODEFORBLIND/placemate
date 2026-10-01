import { NextRequest, NextResponse } from "next/server";
import {
  handleError,
  parsePagination,
  buildPaginatedResponse,
  parseId,
  parseSortParams,
} from "@/lib/api-helpers";
import * as jobService from "@/services/job.service";
import { ValidationError } from "@/services/errors";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const { page, limit } = parsePagination(request);

    const filters: Record<string, unknown> = {};
    const companyId = url.searchParams.get("companyId");
    if (companyId) {
      if (!/^\d+$/.test(companyId.trim()))
        throw new ValidationError("Invalid companyId");
      filters.companyId = Number(companyId);
    }
    const location = url.searchParams.get("location");
    if (location && location.trim()) filters.location = location.trim();
    const jobType = url.searchParams.get("jobType");
    if (jobType) {
      if (!["REMOTE", "ONSITE", "HYBRID"].includes(jobType))
        throw new ValidationError("Invalid jobType");
      filters.jobType = jobType;
    }
    const isActive = url.searchParams.get("isActive");
    if (isActive !== null) {
      if (!["true", "false"].includes(isActive))
        throw new ValidationError("isActive must be true or false");
      filters.isActive = isActive === "true";
    }
    const course = url.searchParams.get("course");
    if (course) {
      if (!["MCA", "MSC"].includes(course))
        throw new ValidationError("Invalid course");
      filters.course = course;
    }
    const minCgpa = url.searchParams.get("minCgpa");
    if (minCgpa) {
      const v = Number(minCgpa);
      if (isNaN(v) || v < 0 || v > 10)
        throw new ValidationError("Invalid minCgpa");
      filters.minCgpa = v;
    }
    const maxBacklogs = url.searchParams.get("maxBacklogs");
    if (maxBacklogs) {
      if (!/^\d+$/.test(maxBacklogs.trim()))
        throw new ValidationError("Invalid maxBacklogs");
      filters.maxBacklogs = Number(maxBacklogs);
    }

    const studentIdParam = url.searchParams.get("studentId");
    if (studentIdParam) {
      const studentId = parseId(studentIdParam);
      const offset = (page - 1) * limit;
      const jobs = await jobService.getEligibleJobsForStudent(studentId, {
        limit,
        offset,
      });
      const paginated = buildPaginatedResponse(request, jobs, { page, limit });
      return NextResponse.json(paginated, { status: 200 });
    }

    const { sortBy, ascending } = parseSortParams(
      request,
      ["title", "created_at", "application_deadline"],
      "created_at",
    );

    const data = await jobService.listJobs(
      filters as Parameters<typeof jobService.listJobs>[0],
      {
        page,
        limit,
        sortBy: sortBy as "title" | "created_at" | "application_deadline",
        ascending,
      },
    );
    const paginated = buildPaginatedResponse(request, data, { page, limit });
    return NextResponse.json(paginated, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const job = await jobService.createJob(body);
    return NextResponse.json(
      { message: "Job created", data: job },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
