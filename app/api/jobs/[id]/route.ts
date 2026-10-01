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
    const job = await jobService.getJobById(jobId);
    return NextResponse.json({ data: job }, { status: 200 });
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
    const jobId = parseId(id);
    const body = await request.json();
    const job = await jobService.updateJob(jobId, body);
    return NextResponse.json(
      { message: "Job updated", data: job },
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
    const jobId = parseId(id);
    await jobService.deleteJob(jobId);
    return NextResponse.json({ message: "Job deleted" }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
