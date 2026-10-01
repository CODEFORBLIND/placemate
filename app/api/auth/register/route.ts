import { NextRequest, NextResponse } from "next/server";
import { validateWithSchema } from "@/services/errors";
import { registerSchema } from "@/schemas/auth.schema";
import * as userService from "@/services/user.service";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { handleError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validateWithSchema(registerSchema, body);

    const hashed = await hashPassword(validated.password);

    const user = await userService.createUser({
      email: validated.email,
      passwordHash: hashed,
    });

    const token = signToken({ userId: user.id, email: user.email });

    const response = NextResponse.json(
      {
        message: "User registered successfully",
        data: { id: user.id, email: user.email, is_active: user.is_active },
      },
      { status: 201 },
    );
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
