import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as jobService from "@/services/job.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const jobId = parseId(id);
    const studentIdParam = request.nextUrl.searchParams.get("studentId");
    if (!studentIdParam) {
      return NextResponse.json(
        { error: "studentId query param required" },
        { status: 400 },
      );
    }
    const studentId = parseId(studentIdParam);
    const result = await jobService.checkStudentEligibility(jobId, studentId);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
