import { NextRequest, NextResponse } from "next/server";
import {
  handleError,
  parsePagination,
  buildPaginatedResponse,
} from "@/lib/api-helpers";
import * as jobService from "@/services/job.service";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const { page, limit } = parsePagination(request);

    const filters: Record<string, unknown> = {};
    const companyId = url.searchParams.get("companyId");
    if (companyId) filters.companyId = parseInt(companyId, 10);
    const location = url.searchParams.get("location");
    if (location) filters.location = location;
    const jobType = url.searchParams.get("jobType");
    if (jobType) filters.jobType = jobType;
    const isActive = url.searchParams.get("isActive");
    if (isActive !== null) filters.isActive = isActive === "true";
    const course = url.searchParams.get("course");
    if (course) filters.course = course;
    const minCgpa = url.searchParams.get("minCgpa");
    if (minCgpa) filters.minCgpa = parseFloat(minCgpa);
    const maxBacklogs = url.searchParams.get("maxBacklogs");
    if (maxBacklogs) filters.maxBacklogs = parseInt(maxBacklogs, 10);

    const studentIdParam = url.searchParams.get("studentId");
    if (studentIdParam) {
      const studentId = parseInt(studentIdParam, 10);
      const offset = (page - 1) * limit;
      const jobs = await jobService.getEligibleJobsForStudent(studentId, {
        limit,
        offset,
      });
      const paginated = buildPaginatedResponse(request, jobs, { page, limit });
      return NextResponse.json(paginated, { status: 200 });
    }

    const sortBy =
      (url.searchParams.get("sortBy") as
        "title" | "created_at" | "application_deadline") || "created_at";
    const order = url.searchParams.get("order") || "asc";
    const ascending = order === "asc";

    const data = await jobService.listJobs(
      filters as Parameters<typeof jobService.listJobs>[0],
      { page, limit, sortBy, ascending },
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
