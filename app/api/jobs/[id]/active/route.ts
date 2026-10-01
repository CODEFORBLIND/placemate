import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as jobService from "@/services/job.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const jobId = parseId(id);
    const body = await request.json();
    const { isActive } = body;
    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive must be boolean" },
        { status: 400 },
      );
    }
    const job = await jobService.setJobActiveStatus(jobId, isActive);
    return NextResponse.json(
      { message: "Job active status updated", data: job },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
