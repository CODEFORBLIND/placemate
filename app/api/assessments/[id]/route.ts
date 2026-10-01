import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as assessmentService from "@/services/assessment.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const assessmentId = parseId(id);
    const assessment = await assessmentService.getAssessmentById(assessmentId);
    return NextResponse.json({ data: assessment }, { status: 200 });
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
    const assessmentId = parseId(id);
    const body = await request.json();
    const assessment = await assessmentService.updateAssessment(
      assessmentId,
      body,
    );
    return NextResponse.json(
      { message: "Assessment updated", data: assessment },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
