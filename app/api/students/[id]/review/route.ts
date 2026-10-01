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
    const body = await request.json();
    const { decision, remark } = body;
    const student = await studentService.reviewProfile(
      studentId,
      decision,
      remark,
    );
    return NextResponse.json(
      { message: `Profile ${decision}`, data: student },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
