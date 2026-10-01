import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as studentService from "@/services/student.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const studentId = parseId(id);
    const student = await studentService.getStudentById(studentId);
    return NextResponse.json({ data: student }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const studentId = parseId(id);
    const body = await request.json();
    const student = await studentService.updateProfile(studentId, body);
    return NextResponse.json(
      { message: "Student updated", data: student },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const studentId = parseId(id);
    await studentService.deleteStudent(studentId);
    return NextResponse.json({ message: "Student deleted" }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
