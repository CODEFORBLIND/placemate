import { NextRequest, NextResponse } from "next/server";
import {
  handleError,
  parsePagination,
  buildPaginatedResponse,
} from "@/lib/api-helpers";
import * as companyService from "@/services/company.service";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const { page, limit } = parsePagination(request);

    const searchName = url.searchParams.get("name");
    if (searchName) {
      const data = await companyService.searchCompaniesByName(searchName);
      const paginated = buildPaginatedResponse(
        request,
        data.slice((page - 1) * limit, (page - 1) * limit + limit),
        { page, limit },
      );
      return NextResponse.json(paginated, { status: 200 });
    }

    const filters: Record<string, unknown> = {};
    const location = url.searchParams.get("location");
    if (location) filters.location = location;
    const industry = url.searchParams.get("industry");
    if (industry) filters.industry = industry;
    const isHiring = url.searchParams.get("isHiring");
    if (isHiring !== null) filters.isHiring = isHiring === "true";

    const sortBy =
      (url.searchParams.get("sortBy") as "name" | "created_at") || "created_at";
    const order = url.searchParams.get("order") || "asc";
    const ascending = order === "asc";

    const data = await companyService.searchCompanies(
      filters as Parameters<typeof companyService.searchCompanies>[0],
      { page, limit, sortBy, ascending },
    );
    const paginated = buildPaginatedResponse(request, data, { page, limit });
    return NextResponse.json(paginated, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const company = await companyService.createCompany(body);
    return NextResponse.json(
      { message: "Company created", data: company },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
