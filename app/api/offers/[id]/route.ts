import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as offerService from "@/services/offer.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const offerId = parseId(id);
    const offer = await offerService.getOfferById(offerId);
    return NextResponse.json({ data: offer }, { status: 200 });
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
    const offerId = parseId(id);
    const body = await request.json();
    const offer = await offerService.updateOfferDetails(offerId, body);
    return NextResponse.json(
      { message: "Offer updated", data: offer },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
