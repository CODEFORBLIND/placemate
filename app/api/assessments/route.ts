import { NextRequest, NextResponse } from "next/server";
import {
  handleError,
  parsePagination,
  buildPaginatedResponse,
} from "@/lib/api-helpers";
import * as assessmentService from "@/services/assessment.service";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const studentIdParam = url.searchParams.get("studentId");
    if (!studentIdParam) {
      return NextResponse.json(
        { error: "studentId query param required" },
        { status: 400 },
      );
    }
    const studentId = parseInt(studentIdParam, 10);
    const { page, limit } = parsePagination(request);
    const sortBy =
      (url.searchParams.get("sortBy") as "created_at" | "score") ||
      "created_at";
    const order = url.searchParams.get("order") || "desc";
    const ascending = order === "asc";

    const data = await assessmentService.getStudentAssessments(studentId, {
      page,
      limit,
      sortBy,
      ascending,
    });
    const paginated = buildPaginatedResponse(request, data, { page, limit });
    return NextResponse.json(paginated, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const assessment = await assessmentService.recordAssessment(body);
    return NextResponse.json(
      { message: "Assessment recorded", data: assessment },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
