import { NextRequest, NextResponse } from "next/server";
import {
  handleError,
  parsePagination,
  buildPaginatedResponse,
} from "@/lib/api-helpers";
import * as offerService from "@/services/offer.service";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const studentIdParam = url.searchParams.get("studentId");
    const applicationIdParam = url.searchParams.get("applicationId");

    if (applicationIdParam) {
      const appId = parseInt(applicationIdParam, 10);
      const offer = await offerService.getOfferByApplicationId(appId);
      return NextResponse.json({ data: offer }, { status: 200 });
    }

    if (studentIdParam) {
      const studentId = parseInt(studentIdParam, 10);
      const { page, limit } = parsePagination(request);
      const sortBy =
        (url.searchParams.get("sortBy") as "offered_on" | "created_at") ||
        "offered_on";
      const order = url.searchParams.get("order") || "desc";
      const ascending = order === "asc";
      const data = await offerService.getOffersByStudent(studentId, {
        page,
        limit,
        sortBy,
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
