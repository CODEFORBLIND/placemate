import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as applicationService from "@/services/application.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const appId = parseId(id);
    const body = await request.json();
    const { studentId } = body;
    if (studentId === undefined || studentId === null)
      return NextResponse.json(
        { error: "studentId required" },
        { status: 400 },
      );
    const parsedStudentId = parseId(String(studentId));
    const application = await applicationService.withdrawApplication(
      appId,
      parsedStudentId,
    );
    return NextResponse.json(
      { message: "Application withdrawn", data: application },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
