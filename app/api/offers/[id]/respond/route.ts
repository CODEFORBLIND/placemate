import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as offerService from "@/services/offer.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const offerId = parseId(id);
    const body = await request.json();
    const { studentId, decision } = body;
    if (!studentId || !decision)
      return NextResponse.json(
        { error: "studentId and decision required" },
        { status: 400 },
      );
    const offer = await offerService.respondToOffer(
      offerId,
      studentId,
      decision,
    );
    return NextResponse.json(
      { message: `Offer ${decision}`, data: offer },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
