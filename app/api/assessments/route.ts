import { NextRequest, NextResponse } from "next/server";
import {
  handleError,
  parsePagination,
  buildPaginatedResponse,
  parseId,
  parseSortParams,
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
    const studentId = parseId(studentIdParam);
    const { page, limit } = parsePagination(request);
    const { sortBy, ascending } = parseSortParams(
      request,
      ["created_at", "score"],
      "created_at",
    );

    const data = await assessmentService.getStudentAssessments(studentId, {
      page,
      limit,
      sortBy: sortBy as "created_at" | "score",
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
