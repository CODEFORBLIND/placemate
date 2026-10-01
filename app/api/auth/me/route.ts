import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { handleError } from "@/lib/api-helpers";
import * as userService from "@/services/user.service";

export async function GET(request: NextRequest) {
  try {
    const payload = requireAuth(request);
    const user = await userService.getUserById(payload.userId);
    return NextResponse.json(
      {
        data: {
          id: user.id,
          email: user.email,
          is_active: user.is_active,
          last_login_at: user.last_login_at,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
