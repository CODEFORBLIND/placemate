import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { handleError } from "@/lib/api-helpers";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
    clearAuthCookie(response);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
