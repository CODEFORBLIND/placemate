import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as applicationService from "@/services/application.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const appId = parseId(id);
    const application = await applicationService.getApplicationById(appId);
    return NextResponse.json({ data: application }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
