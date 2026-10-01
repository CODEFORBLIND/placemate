import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-helpers";
import * as assessmentService from "@/services/assessment.service";

export async function GET(request: NextRequest) {
  try {
    const studentIdParam = request.nextUrl.searchParams.get("studentId");
    if (!studentIdParam) {
      return NextResponse.json(
        { error: "studentId query param required" },
        { status: 400 },
      );
    }
    const studentId = parseInt(studentIdParam, 10);
    if (isNaN(studentId) || studentId <= 0)
      return NextResponse.json({ error: "Invalid studentId" }, { status: 400 });
    const summary =
      await assessmentService.getStudentPerformanceSummary(studentId);
    return NextResponse.json({ data: summary }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
