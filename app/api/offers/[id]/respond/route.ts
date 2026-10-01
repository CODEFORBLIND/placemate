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
    if (studentId === undefined || studentId === null || !decision)
      return NextResponse.json(
        { error: "studentId and decision required" },
        { status: 400 },
      );
    if (!["ACCEPTED", "REJECTED"].includes(decision)) {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }
    const parsedStudentId = parseId(String(studentId));
    const validatedDecision = decision as "ACCEPTED" | "REJECTED";
    const offer = await offerService.respondToOffer(
      offerId,
      parsedStudentId,
      validatedDecision,
    );
    return NextResponse.json(
      { message: `Offer ${validatedDecision}`, data: offer },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
