import { NextRequest, NextResponse } from "next/server";
import { handleError, parseId } from "@/lib/api-helpers";
import { validateWithSchema } from "@/services/errors";
import { updateUserSchema } from "@/schemas/user.schema";
import * as userService from "@/services/user.service";
import { hashPassword } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = parseId(id);
    const user = await userService.getUserById(userId);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = parseId(id);
    const body = await request.json();

    if (body.password && !body.passwordHash) {
      body.passwordHash = await hashPassword(body.password);
      delete body.password;
    } else if (body.passwordHash && !body.passwordHash.startsWith("$2")) {
      body.passwordHash = await hashPassword(body.passwordHash);
    }

    const validated = validateWithSchema(updateUserSchema, body);
    const user = await userService.updateUser(userId, validated);
    return NextResponse.json(
      {
        message: "User updated",
        data: { id: user.id, email: user.email, is_active: user.is_active },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
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
