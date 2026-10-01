import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import * as userService from "@/services/user.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = parseId(id);
    const user = await userService.deactivateUser(userId);
    return NextResponse.json(
      {
        message: "User deactivated",
        data: { id: user.id, is_active: user.is_active },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
