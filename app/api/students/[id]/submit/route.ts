import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as studentService from "@/services/student.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const studentId = parseId(id);
    const student = await studentService.submitForApproval(studentId);
    return NextResponse.json(
      { message: "Submitted for approval", data: student },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
