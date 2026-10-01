import { NextRequest, NextResponse } from "next/server";
import {
  handleError,
  parsePagination,
  buildPaginatedResponse,
  parseSortParams,
} from "@/lib/api-helpers";
import * as companyService from "@/services/company.service";
import { ValidationError } from "@/services/errors";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const { page, limit } = parsePagination(request);

    const searchName = url.searchParams.get("name");
    if (searchName && searchName.trim()) {
      const data = await companyService.searchCompaniesByName(
        searchName.trim(),
      );
      const from = (page - 1) * limit;
      const sliced = data.slice(from, from + limit);
      const hasNext = from + limit < data.length;
      const hasPrev = page > 1;
      const buildUrl = (p: number) => {
        const params = new URLSearchParams(url.searchParams.toString());
        params.set("page", String(p));
        params.set("limit", String(limit));
        return `${url.pathname}?${params.toString()}`;
      };
      return NextResponse.json(
        {
          data: sliced,
          pagination: {
            page,
            limit,
            count: sliced.length,
            total: data.length,
            hasNext,
            hasPrev,
            nextUrl: hasNext ? buildUrl(page + 1) : null,
            prevUrl: hasPrev ? buildUrl(page - 1) : null,
          },
        },
        { status: 200 },
      );
    }

    const filters: Record<string, unknown> = {};
    const location = url.searchParams.get("location");
    if (location && location.trim()) filters.location = location.trim();
    const industry = url.searchParams.get("industry");
    if (industry && industry.trim()) filters.industry = industry.trim();
    const isHiring = url.searchParams.get("isHiring");
    if (isHiring !== null) {
      if (!["true", "false"].includes(isHiring))
        throw new ValidationError("isHiring must be true or false");
      filters.isHiring = isHiring === "true";
    }

    const { sortBy, ascending } = parseSortParams(
      request,
      ["name", "created_at"],
      "created_at",
    );

    const data = await companyService.searchCompanies(
      filters as Parameters<typeof companyService.searchCompanies>[0],
      { page, limit, sortBy: sortBy as "name" | "created_at", ascending },
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
