import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as companyService from "@/services/company.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const companyId = parseId(id);
    const body = await request.json();
    const { isHiring } = body;
    if (typeof isHiring !== "boolean") {
      return NextResponse.json(
        { error: "isHiring must be boolean" },
        { status: 400 },
      );
    }
    const company = await companyService.setHiringStatus(companyId, isHiring);
    return NextResponse.json(
      { message: "Hiring status updated", data: company },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
