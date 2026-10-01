import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/api-helpers";
import { validateWithSchema } from "@/services/errors";
import { registerSchema } from "@/schemas/auth.schema";
import * as userService from "@/services/user.service";
import { hashPassword } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    if (email) {
      const user = await userService.getUserByEmail(email);
      if (!user)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json(
        { data: { id: user.id, email: user.email, is_active: user.is_active } },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { error: "Provide ?email= to fetch user or use /api/users/[id]" },
      { status: 400 },
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let email: string;
    let hash: string;
    if (body.password) {
      const validated = validateWithSchema(registerSchema, body);
      email = validated.email;
      hash = await hashPassword(validated.password);
    } else {
      const { createUserSchema } = await import("@/schemas/user.schema");
      const validated = validateWithSchema(createUserSchema, body);
      email = validated.email;
      if (
        validated.passwordHash.startsWith("$2a$") ||
        validated.passwordHash.startsWith("$2b$")
      ) {
        hash = validated.passwordHash;
      } else {
        hash = await hashPassword(validated.passwordHash);
      }
    }

    const user = await userService.createUser({ email, passwordHash: hash });
    return NextResponse.json(
      {
        message: "User created",
        data: { id: user.id, email: user.email, is_active: user.is_active },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
