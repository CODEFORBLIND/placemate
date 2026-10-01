import { NextRequest, NextResponse } from "next/server";
import { validateWithSchema, UnauthorizedError } from "@/services/errors";
import { loginSchema } from "@/schemas/auth.schema";
import * as userRepo from "@/repositories/user.repository";
import * as userService from "@/services/user.service";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { handleError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validateWithSchema(loginSchema, body);

    const user = await userRepo.findByEmail(validated.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.is_active) {
      throw new UnauthorizedError("Account is deactivated");
    }

    const isValid = await verifyPassword(
      validated.password,
      user.password_hash,
    );
    if (!isValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    await userService.recordLogin(user.id);

    const token = signToken({ userId: user.id, email: user.email });

    const response = NextResponse.json(
      {
        message: "Login successful",
        data: { id: user.id, email: user.email },
      },
      { status: 200 },
    );
    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return handleError(error);
  }
}
