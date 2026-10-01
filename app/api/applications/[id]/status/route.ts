import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as applicationService from "@/services/application.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const appId = parseId(id);
    const body = await request.json();
    const { status, remark } = body;
    const application = await applicationService.updateApplicationStatus(
      appId,
      status,
      remark,
    );
    return NextResponse.json(
      { message: "Application status updated", data: application },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
