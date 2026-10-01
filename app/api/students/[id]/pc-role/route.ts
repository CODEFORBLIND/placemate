import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as studentService from "@/services/student.service";
import { ValidationError } from "@/services/errors";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const studentId = parseId(id);
    const body = await request.json();
    const { role } = body;
    if (
      role !== null &&
      role !== undefined &&
      !["MEMBER", "COORDINATOR"].includes(role)
    ) {
      throw new ValidationError(
        "Invalid role. Allowed: MEMBER, COORDINATOR, null",
      );
    }
    const student = await studentService.assignPcRole(studentId, role ?? null);
    return NextResponse.json(
      { message: "PC role updated", data: student },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
