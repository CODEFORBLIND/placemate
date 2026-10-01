import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleError } from "@/lib/api-helpers";
import { signToken, setAuthCookie } from "@/lib/auth";
import * as userService from "@/services/user.service";

export async function POST(request: NextRequest) {
  try {
    const payload = requireAuth(request);
    const user = await userService.getUserById(payload.userId);

    if (!user.is_active) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 401 },
      );
    }

    const newToken = signToken({ userId: user.id, email: user.email });
    const response = NextResponse.json(
      { message: "Token refreshed" },
      { status: 200 },
    );
    setAuthCookie(response, newToken);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
