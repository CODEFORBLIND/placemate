import { NextRequest, NextResponse } from "next/server";
import {
  validateWithSchema,
  UnauthorizedError,
  ValidationError,
} from "@/services/errors";
import { resetPasswordSchema } from "@/schemas/auth.schema";
import * as userRepo from "@/repositories/user.repository";
import * as userService from "@/services/user.service";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { handleError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validateWithSchema(resetPasswordSchema, body);

    if (validated.oldPassword) {
      const token = getTokenFromRequest(request);
      if (!token)
        throw new UnauthorizedError(
          "Authentication required for oldPassword flow",
        );
      const payload = verifyToken(token);
      const targetUser = await userRepo.findById(payload.userId);
      if (!targetUser) throw new UnauthorizedError("User not found");

      const isValid = await verifyPassword(
        validated.oldPassword,
        targetUser.password_hash,
      );
      if (!isValid) throw new UnauthorizedError("Old password is incorrect");

      const hashed = await hashPassword(validated.newPassword);
      const updated = await userService.updateUser(targetUser.id, {
        passwordHash: hashed,
      });
      return NextResponse.json(
        {
          message: "Password reset successful",
          data: { id: updated.id, email: updated.email },
        },
        { status: 200 },
      );
    }

    if (validated.email) {
      const user = await userRepo.findByEmail(validated.email.toLowerCase());
      if (!user) {
        return NextResponse.json(
          { message: "If the email exists, password has been reset" },
          { status: 200 },
        );
      }
      const hashed = await hashPassword(validated.newPassword);
      const updated = await userService.updateUser(user.id, {
        passwordHash: hashed,
      });
      return NextResponse.json(
        {
          message: "Password reset successful",
          data: { id: updated.id, email: updated.email },
        },
        { status: 200 },
      );
    }

    throw new ValidationError(
      "Either provide oldPassword (when logged in) or email",
    );
  } catch (error) {
    return handleError(error);
  }
}
