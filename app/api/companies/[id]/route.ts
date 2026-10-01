import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as companyService from "@/services/company.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const companyId = parseId(id);
    const company = await companyService.getCompanyById(companyId);
    return NextResponse.json({ data: company }, { status: 200 });
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
    const companyId = parseId(id);
    const body = await request.json();
    const company = await companyService.updateCompany(companyId, body);
    return NextResponse.json(
      { message: "Company updated", data: company },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
