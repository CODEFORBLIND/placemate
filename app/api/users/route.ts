import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/services";
import { handleError, ok, created, getPage } from "@/lib/api-helpers";
import { getSession, requirePc } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    requirePc(session);
    const email = request.nextUrl.searchParams.get("email")?.trim();
    if (email) {
      const user = await userService.getByEmail(email);
      if (!user)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      return ok(userService.toPublic(user));
    }
    const { page, limit } = getPage(request);
    const users = await userService.list(page, limit);
    return ok(users.map(userService.toPublic));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    requirePc(session);
    const body = await request.json();
    const user = await userService.create(body);
    return created(userService.toPublic(user), "User created");
  } catch (error) {
    return handleError(error);
  }
}
