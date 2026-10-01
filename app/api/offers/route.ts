import { NextRequest, NextResponse } from "next/server";
import {
  handleError,
  parsePagination,
  buildPaginatedResponse,
  parseId,
  parseSortParams,
} from "@/lib/api-helpers";
import * as offerService from "@/services/offer.service";
import { ValidationError } from "@/services/errors";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const studentIdParam = url.searchParams.get("studentId");
    const applicationIdParam = url.searchParams.get("applicationId");

    if (studentIdParam && applicationIdParam) {
      throw new ValidationError(
        "Provide either ?studentId= or ?applicationId=, not both",
      );
    }

    if (applicationIdParam) {
      const appId = parseId(applicationIdParam);
      const offer = await offerService.getOfferByApplicationId(appId);
      return NextResponse.json({ data: offer }, { status: 200 });
    }

    if (studentIdParam) {
      const studentId = parseId(studentIdParam);
      const { page, limit } = parsePagination(request);
      const { sortBy, ascending } = parseSortParams(
        request,
        ["offered_on", "created_at"],
        "offered_on",
      );
      const data = await offerService.getOffersByStudent(studentId, {
        page,
        limit,
        sortBy: sortBy as "offered_on" | "created_at",
        ascending,
      });
      const paginated = buildPaginatedResponse(request, data, { page, limit });
      return NextResponse.json(paginated, { status: 200 });
    }

    return NextResponse.json(
      { error: "Provide ?studentId= or ?applicationId=" },
      { status: 400 },
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const offer = await offerService.createOffer(body);
    return NextResponse.json(
      { message: "Offer created", data: offer },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
